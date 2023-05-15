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
    {request, response}: {request: any, response: any},
)=>{
    const {user_id, post_id}= await request.body().value;
    const _id = await  applications.insertOne({
user_id: new ObjectId(user_id),
post_id: new ObjectId(post_id),
})
  const user = await Users.findOne({_id: new ObjectId(user_id)});
  const post = await Posts.findOne({_id: new ObjectId(post_id)});
  if ( user!= undefined && post!= undefined){
    await client.send({
      from: "louai.zaiter@ultimatejobs.co",
        to: user.email,
        subject: `thanks for applying to ${post.title}`,
        html: `<p>Dear ${user.username}<br/> You have applied to ${post.title} at ${post.company}.<br/> We will review your CV and get back to you soon.🤖  <br/>  Best Regards,<br/>  JobHunter Team</p>`,
        content: ""
        });
    
        console.log("email sent")
    }
    response.status=201;
    response.body= {message: "application created", appId: _id}
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