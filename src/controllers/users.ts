import db from "../database/connectDB.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { UserSchema } from "../schema/user.ts";
import { create } from "https://deno.land/x/djwt/mod.ts";
import { key } from "../utils/apiKey.ts";
import { ProfileSchema } from "../schema/profile.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.2/src/objectid.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const client = new SMTPClient({
  connection: {
    hostname: "smtp-relay.sendinblue.com",
    port: 465,
    tls: true,
    auth: {
      username: "encrygen@gmail.com",
      password: "xOr9PCUjFHbDLKv0",
    },
  },
});




const profiles= db.collection<ProfileSchema>('profile');
const Users = db.collection<UserSchema>("users");
export const signup = async (
  { request, response }: { request: any; response: any }
) => {
  const { username, password , email} = await request.body().value;
  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, salt);
  const _id = await Users.insertOne({
    username: username,
    email: email,
    password: hashedPassword,
  });
try{
  await client.send({
    from: "Ultimate Jobs <encrygen@gmail.com>",
    to: email,
    subject: "thanks for registering",
    html: `<p>Dear ${username}<br/> <br/>Welcome to our awesome app.  <br/>  Now you can browse and apply to featured jobs at <a href="https://ultimatejobs.co" >Ultimatejobs.co</a> 💡 
    <br/> <br/>Best Regards,<br/> JobHunter Team</p>`,
    content: ""
});
}catch(error){
    response.status = 200;
    response.body = { message: "user created", userId: _id, user: username };
  }
  response.status = 200;
  response.body = { message: "user created", userId: _id, user: username };
};

export const signin = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();
  const { username, password } = await body.value;

  const user = await Users.findOne({ username });
  if (!user) {
    response.status = 404;
    response.body = { message: `user "${username}" not found` };
    return;
  }

  const confirmPassword = await bcrypt.compare(password, user.password);

  if (!confirmPassword) {
    response.status = 404;
    response.body = { message: "Incorrect Password" };
  }

  const payload = {
    id: user._id,
    name: username,
  };

  const jwt = await create({ alg: "HS512", typ: "JWT" }, { payload }, key);
  const profile= await profiles.findOne({user_id: user._id})
  console.log(profile);
  
  if (jwt) {
    response.status = 200;
    response.body = {
      profileId: profile?._id,
      userId: user._id,
      username: user.username,
      token: jwt,
    };
  } else {
    response.status = 500;
    response.body = {
      message: "Internal Server Error",
    };
  }
  return;
};
