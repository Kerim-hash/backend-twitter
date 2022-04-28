import dotenv from 'dotenv'
dotenv.config()
import './core/db'
import express from 'express';
import multer from 'multer'
import bodyParser from 'body-parser'
import cors from 'cors'
import { registerValidations } from './validations/register';
import { passport } from './core/passport';
import { createTweetValidations } from './validations/createTweet';
// midlewares
// import { upload } from "./core/upload-photo"
const storage = multer.memoryStorage()
const upload = multer({ storage })
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cors())
// require routes
import { TweetsCtrl } from './controllers/TweetsController';
import { UploudCtrl } from './controllers/UploudImg';
import { UserCtrl } from './controllers/UserController'
import { MessageCtrl } from './controllers/Message';
import { ConversationCtrl } from './controllers/Conversation';

// routes

//  User
app.get('/users', passport.authenticate('jwt', { session: false }), UserCtrl.index)
app.put('/users/update/', passport.authenticate('jwt'),  UserCtrl.update)
app.get('/users/search/:username',passport.authenticate('jwt'), UserCtrl.search)
app.get('/users/me', passport.authenticate('jwt', { session: false }), UserCtrl.getUserInfo)
app.get('/users/:id', UserCtrl.show)
app.get('/users/withoutDetails/:id', UserCtrl.withoutDetailsShow)

app.put('/users/follow/:id', UserCtrl.follow)
app.put('/users/bookmarks/:id', UserCtrl.bookmarks)
app.put('/users/unfollow/:id', UserCtrl.unfollow)

// auth
app.post('/auth/register', registerValidations, UserCtrl.create)
app.get('/auth/verify', UserCtrl.verify)
app.post('/auth/login', passport.authenticate('local'),  UserCtrl.login)

// Tweeter 
app.get('/tweets', TweetsCtrl.index)
app.get('/tweets/bookmarks/:id', TweetsCtrl.bookmarks)
app.get('/tweet/:id', TweetsCtrl.show)
app.get('/tweet/user/:id', TweetsCtrl.getUserTweets)
app.delete('/tweet/:id', passport.authenticate('jwt'), TweetsCtrl.delete)
app.post('/tweets', passport.authenticate('jwt'), createTweetValidations, upload.single("photo"), TweetsCtrl.create)
app.patch('/tweet/:id', passport.authenticate('jwt'), TweetsCtrl.update)
app.post('/tweet/comment/:id', passport.authenticate('jwt'), TweetsCtrl.addNewComment)
app.patch('/tweet/like/:id', passport.authenticate('jwt'), TweetsCtrl.like)


// Uploud
app.post('/uploud', upload.single("image"), UploudCtrl.index)
// conversation
app.post('/conversation',  ConversationCtrl.index)
app.get('/conversation/:userId',  ConversationCtrl.show)
app.get('/conversation/detail/:id',  ConversationCtrl.getConversationById)
app.delete('/conversation/:id',  passport.authenticate('jwt'), ConversationCtrl.deleteConversation)
// message
app.post('/message',  MessageCtrl.index)
app.get('/message/:conversationId',  MessageCtrl.show)

let port = process.env.PORT || 5000
app.listen(port, () => {
        console.log(port)
})