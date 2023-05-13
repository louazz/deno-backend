import {ObjectId} from "https://deno.land/x/mongo@v0.30.0/mod.ts";

export interface  ApplicationSchema {
    _id: ObjectId,
    user_id: ObjectId,
    post_id: ObjectId
}