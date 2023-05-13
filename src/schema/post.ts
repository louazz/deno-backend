import {ObjectId} from "https://deno.land/x/mongo@v0.30.0/mod.ts";

export interface PostSchema{
    _id: ObjectId,
    title: string,
    description: string,
    date: string,
    company: string,
    location: string,
    owner_id: ObjectId
}