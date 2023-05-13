import { ObjectId } from "https://deno.land/x/web_bson@v0.2.2/src/objectid.ts";
import db from "../database/connectDB.ts";
import { PostSchema } from "../schema/post.ts";

const posts = db.collection<PostSchema>("post");

export const create = async (
  { request, response }: { request: any; response: any },
) => {
  const { title, description, user_id, location, date, company } = await request.body().value;
  const _id = await posts.insertOne({
    title,
    description,
    owner_id: new ObjectId(user_id),
    location,
    date,
    company
  });
  response.status = 201;
  response.body = { message: "post created", postId: _id, userId: user_id };
};

export const getPosts = async (
  { request, response }: { request: any; response: any },
) => {
  const allPosts = await posts.find({}).toArray();
  response.status = 201;
  response.body = { posts: allPosts };
};

export const getById = async ({
  params,
  response,
}: {
  params: { postId: string };
  response: any;
}) => {
  const postId = params.postId;
  const post = await posts.findOne({ _id: new ObjectId(postId) });

  if (!post) {
    response.status = 404;
    response.body = { message: "no post with the id" + postId };
    return;
  }
  response.status = 200;
  response.body = { post: post };
};

export const getByUserId = async ({
  params,
  response,
}: {
  params: { userId: string };
  response: any;
}) => {
  const userId = params.userId;
  const userPosts = await posts.find({ owner_id: new ObjectId(userId) })
    .toArray();
  response.status = 201;
  response.body = { posts: userPosts };
};

export const updateById = async ({
  params,
  request,
  response,
}: {
  params: { postId: string };
  request: any;
  response: any;
}) => {
  const postId = params.postId;
  const { title, description, date, location, company } = request.body().value;
  const post = await posts.updateOne({ _id: new ObjectId(postId) }, {
    $set: { title: title, description: description , date:date, location:location, company: company},
  });
  if (!post) {
    response.status = 404;
    response.body = { message: "no post with id" + postId };
    return;
  }
  response.status = 200;
  response.body = { post: post };
};

export const deletePost= async ({
  params, response
}:{
  params: {postId : string};
  response : any 
})=>{
 const postId= params.postId;
 const post= await posts.deleteOne({_id: new ObjectId(postId)});
 response.status=200;
 response.body= {message: "Deleted post", post:post}
}

export const deleteAll= async ({
  response
}:{response: any})=>{

  const post= await posts.drop();
  response.status=200;
  response.body= {message: "Dropped posts"}
}