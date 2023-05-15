import db from "../database/connectDB.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { UserSchema } from "../schema/user.ts";
import { create } from "https://deno.land/x/djwt/mod.ts";
import { key } from "../utils/apiKey.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
import { ProfileSchema } from "../schema/profile.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.2/src/objectid.ts";

const client = new SmtpClient();

await client.connect({
  hostname: "smtp-relay.sendinblue.com",
  port: 587,
  username: "encrygen@gmail.com",
  password: "xOr9PCUjFHbDLKv0",
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
  await client.send({
    from: "louai.zaiter@ultimatejobs.co",
    to: email,
    subject: "Thanks for registering",
    content: "Dear"+ username+",\nThanks for registering at UltimateJobs.io.\nNow you can browse open vacancies and apply with one click after setting up your profile.\nBest regards,\nUltimateJobs Team."
});
  await client.close();
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
