import * as R from 'https://cdn.skypack.dev/ramda@^0.27.1'
import { exists } from 'https://deno.land/std@0.102.0/fs/exists.ts'
import { MultipartReader } from "https://deno.land/std@0.102.0/mime/mod.ts";
import { reset } from 'https://deno.land/std@0.140.0/fmt/colors.ts';
import { request } from 'https://deno.land/x/opine/mod.ts';

const {compose , nth, split}= R

const TMP_DIR= '../uploads';

const getBounday= compose(
    nth(1),
    split('='),
    nth(1),
    split(';')
)

export default function(fieldName= "file"){
    return async (req, res, next)=>{
        let boundary;
        const contentType = req.getBounday('content-type');
        if (contentType.stratWith('multipart/form-data')){
            boundary= getBounday(contentType);
        }

        if (! (await exists(TMP_DIR))){
            await Deno.mkdir(TMP_DIR, {recursive: true})
        }
        const form = await new MultipartReader(req.body , boundary).readForm({
            maxMemory: 10 << 20,
            dir: TMP_DIR
        })
        req.file= form.files(fieldName)[0]
        next()
    }
}