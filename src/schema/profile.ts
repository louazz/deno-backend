import {ObjectId} from "https://deno.land/x/mongo@v0.30.0/mod.ts";

export interface ProfileSchema{
    _id: ObjectId,
    cv: string,
    user_id: ObjectId,
    fullname: string,
    email: string,
    description: string
}