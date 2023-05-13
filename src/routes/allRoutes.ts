import {Router} from "https://deno.land/x/oak/mod.ts";
import { signin,signup } from "../controllers/users.ts";
import {create, getPosts, getById, getByUserId, deletePost, updateById, deleteAll} from "../controllers/post.ts"
import {createApp, findByPostId, fileUpload, findByUserId} from "../controllers/application.ts"
import { authorized} from "../middlewares/isAuthorized.ts"
import { UpdateProfile, createProfile, deleteProfileAll, fileExplore, findProfile, getProfiles } from "../controllers/profile.ts";

const router = new Router();

router.post("/api/signup", signup);
router.post("/api/signin", signin);

router.get("/api/posts", getPosts);
router.post("/api/posts", authorized, create);
router.get("/api/posts/:postId", authorized, getById);
router.get("/api/posts/:userId", authorized, getByUserId);
router.patch("/api/posts/:postId", authorized, updateById);
router.delete("/api/posts",authorized ,deletePost);
router.delete("/api/posts/all" ,deleteAll);


router.post("/api/apply", authorized, createApp);
router.get("/api/apply/:postId", authorized, findByPostId);
router.get("/api/apply/user/:userId", authorized, findByUserId);

router.post('/upload/:appId', fileUpload);
router.get("/api/resume/:profileId", authorized, fileExplore);
router.get("/api/profile/:profileId", authorized, findProfile);
router.post("/api/profile", authorized, createProfile)
router.patch("/api/profile/:profileId", authorized, UpdateProfile);
router.get("/api/profile", authorized, getProfiles)
router.delete("/api/profile", authorized, deleteProfileAll)
export default router;