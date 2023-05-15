import { ObjectId } from "https://deno.land/x/web_bson@v0.2.2/src/objectid.ts";
import db from "../database/connectDB.ts";
import {ApplicationSchema} from "../schema/application.ts";
import { type RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { upload } from "https://deno.land/x/upload_middleware_for_oak/mod.ts";
import { multiParser } from 'https://deno.land/x/multiparser/mod.ts'
import { any } from "https://cdn.skypack.dev/ramda@^0.27.1";
import { UserSchema } from "../schema/user.ts";
import { PostSchema } from "../schema/post.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";
import { verify } from "https://deno.land/x/djwt/mod.ts";
import { key } from "../utils/apiKey.ts";

const client = new SmtpClient();


await client.connect({
  hostname: "smtp-relay.sendinblue.com",
  port: 587,
  username: "encrygen@gmail.com",
  password: "xOr9PCUjFHbDLKv0",
});


const applications= db.collection<ApplicationSchema>("application")
const Users = db.collection<UserSchema>("users");
const Posts = db.collection<PostSchema>("post");

export const createApp = async (
    {ctx,request, response}: {ctx: Context,request: any, response: any},
)=>{

  try {
    const headers: Headers = ctx.request.headers;
    const authorization = headers.get("Authorization");
    if (!authorization) {
      ctx.response.status = 401;
      return;
    }
    const jwt = authorization.split(" ")[1];
    if (!jwt) {
      ctx.response.status = 401;
      return;
    }
    const payload = await verify(jwt, key);
    if (!payload) {
      throw new Error("!payload");
    }
  


    const {user_id, post_id}= await request.body().value;
    const _id = await  applications.insertOne({
user_id: new ObjectId(user_id),
post_id: new ObjectId(post_id),
})
  const user = await Users.findOne({_id: new ObjectId(user_id)});
  const post = await Posts.findOne({_id: new ObjectId(post_id)});

    await client.send({
      from: "louai.zaiter@ultimatejobs.co",
        to: user.email,
        subject: `thanks for applying to ${post.title}`,
        html: `<p>Dear ${user.username}<br/> You have applied to ${post.title} at ${post.company}.<br/> We will review your CV and get back to you soon.  <br/>  Best Regards,<br/>  JobHunter Team</p>`,
        content: ""
        });
    
        console.log("email sent")
 
    await client.close()   
    response.status=201;
    response.body= {message: "application created", appId: _id}
  } catch (error) {
    ctx.response.status = 401;
    ctx.response.body = { message: "You are not Authorized to access route" };
    return;
  }

  }

export const findByPostId= async (
    {params, response}: {params: {postId: string}; response:any}
)=>{
    const postId = params.postId;
    const app= await applications.find({post_id: new ObjectId(postId)}).toArray()
    response.status= 201;
    response.body= {app: app}
}

export const findByUserId= async (
    {params, response}: {params: {userId: string}; response:any}
)=>{
    const userId = params.userId;
    //console.log(userId)
    const app= await applications.find({user_id: new ObjectId(userId)}).toArray()
    //console.log(app)
    response.status= 201;
    response.body= {app: app}
}


export const fileUpload= async ({request, response, params}: {request: any, response:any, params:{appId: string}}) => {
  /*  const body = await request.body({
      type: 'form-data'
    })
  */
    const form = await multiParser(request.originalRequest.request);
    const data= form.files['key'].content;
    await Deno.writeFile( "./src/uploads/"+params.appId+".pdf", data);
  
    response.status=200
  }