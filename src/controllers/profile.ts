import { ObjectId } from "https://deno.land/x/web_bson@v0.2.2/src/objectid.ts";
import db from "../database/connectDB.ts";
import {ApplicationSchema} from "../schema/application.ts";
import { type RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ProfileSchema } from "../schema/profile.ts";
import { any } from "https://cdn.skypack.dev/ramda@^0.27.1";
import { request } from "https://deno.land/x/opine@2.3.4/mod.ts";
import { response } from "https://deno.land/x/opine@2.3.4/mod.ts";
const profiles= db.collection<ProfileSchema>('profile');

export const createProfile= async(
    {request, response}:{request:any, response: any})=>{
    const {user_id, fullname, description, email}= await request.body().value;
    const _id= await profiles.insertOne(
        {
            user_id: new ObjectId(user_id),
            fullname: fullname,
            description: description,
            email: email,
            cv : user_id

        }
    );
    response.status=201;
    response.body={message: "profile created", profileId: _id}
}

export const UpdateProfile= async({
    params,
    request,
    response
}:{
    params: {profileId: string},
    request: any,
    response: any
})=>{
    const profileId= params.profileId;
    console.log(profileId)
    const {user_id, fullname, description, email}= await request.body().value;
    const profile= await profiles.updateOne({_id: new ObjectId(profileId)},{
        $set: {user_id: user_id, fullname: fullname, description: description, email:email, cv: user_id}
    });
    if(!profile){
        response.status= 404;
        response.body= {message:"no profile with that id" + profileId}
        return;
    }
    response.status= 200;
    response.body={profile: profile}
    
}

export const findProfile= async (
    {params, response}: {params:{profileId: string}, response: any}
)=>{
    const profileId= params.profileId;
    //console.log(profileId);
    const profile= await profiles.findOne({_id: new ObjectId(profileId)});
    response.status= 200;
    response.body= {profile: profile}
}

//implement a view resume function

export const fileExplore = async({request, response, params}:{
    request:any,
    response:any,
    params:{profileId: string}
})=>{
    const file=await Deno.readFile("./src/uploads/"+ params.profileId+".pdf");
    const head= new Headers();
    head.set('content-type', 'application/pdf');
    response.head= head;
    response.body= file;
    response.status= 200;
}

export const getProfiles= async (
    {request, response}: {request: any, response:any},
)=>{
    const allProfiles= await profiles.find({}).toArray();
    response.status=200;
    response.body= {profiles: allProfiles}
}

export const deleteProfileAll= async (
    {request, response}: {request:any, response:any},
)=>{
    const profile= await profiles.drop();
    response.status=200
    response.body= {message: "deleted all the profiles"}
}