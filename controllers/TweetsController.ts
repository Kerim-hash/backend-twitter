import express from 'express';
import { validationResult } from 'express-validator'
import { TweetModel } from '../models/TweetModel';
import { TweetCommentModel } from '../models/TweetCommentModel';
import { UserModel, UserModelDocumentInterface } from '../models/UserModel';
import { isValidObjectId } from '../utils/isValidObjectId';
class TweetsController {
    // Request Get All Tweets
    async index(req: express.Request, res: express.Response): Promise<void> {
        try {
            const tweets = await TweetModel.find({}).populate('user').populate('comment').sort({ 'createdAt': '-1' }).exec()
            res.json({
                status: 'success',
                data: tweets
            })
        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }
   
    async show(req: express.Request, res: express.Response): Promise<void> {
        try {
            const tweetId = req.params.id
            const tweet = await TweetModel.findById(tweetId).populate('user comment').populate({path: 'comment'}).sort({ 'createdAt': '-1' }).exec()
            
            res.json({
                status: 'success',
                data: tweet,
            })

        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }
    // create Tweet
    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelDocumentInterface;
            if (user) {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ status: 'error', errors: errors.array() });
                    return
                }

                const data: any = {
                    text: req.body.text,
                    user: user._id,
                    images: req.body.images,
                }

                const tweet = await TweetModel.create(data)

                if (tweet._id) {
                    user.tweets!.push(tweet._id)
                }

                res.status(201).send({
                    status: 'success',
                    data: await tweet.populate('user')
                });
            }

        } catch (err: any) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
        }
    }
    // delete tweet 
    async delete(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelDocumentInterface;

            if (user) {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ status: 'error', errors: errors.array() });
                    return
                }
                const tweetId = req.params.id

                const tweet = await TweetModel.findById(tweetId)

                if (tweet) {
                    if (String(tweet.user._id) === String(user._id)) {
                        tweet.remove()
                        res.status(202).send({
                            status: 'success',
                            message: 'Successfully deleted tweet'
                        });
                    }
                    else {
                        res.status(403).send()
                    }
                } else {
                    res.status(404).send()
                }

            }

        } catch (err: any) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
        }
    }
    // update tweet
    async addNewComment(req: express.Request, res: express.Response): Promise<void> {
        try {
            const comment = new TweetCommentModel()
            comment.text = req.body.text;
            comment.productID = req.params.id;
            comment.avatar = req.body.avatar
            comment.images = req.body.images;
            comment.username = req.body.username;
            comment.fullname = req.body.fullname;

            await TweetModel.findByIdAndUpdate({ _id: req.params.id }, { $push: { comment: comment._id,  $position: 0},  })
            
            const saveComment = await comment.save()

            if (saveComment) {
                res.status(201).send({
                    status: true,
                    message: 'added new coment',
                    comment: saveComment,
                    tweetID: req.params.id
                })
            }
        } catch (err: any) {
            res.status(500).send({
                status: false,
                message: err
            });
        }
    }

    async like(req: express.Request, res: express.Response): Promise<void> {
        try {
            const tweet = await TweetModel.findById(req.params.id)

            if (!tweet?.likes.includes(req.body.userId)) {
                await tweet?.updateOne({ $push: { likes: req.body.userId } })
                await UserModel?.findById(req.body.userId).updateOne({ $push: { liked: req.params.id } })
                res.status(201).json({ message: 'liked', liked: true })
            } else {
                await tweet?.updateOne({ $pull: { likes: req.body.userId } })
                await UserModel?.findById(req.body.userId).updateOne({ $pull: { liked: req.params.id }})
                res.status(202).json({ message: 'disliked', liked: false })
            }

        } catch (err: any) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
        }
    }

    async update(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelDocumentInterface;

            if (user) {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ status: 'error', errors: errors.array() });
                    return
                }
                const tweetId = req.params.id
                const tweet = await TweetModel.findById(tweetId)
                if (tweet) {
                    if (String(tweet.user._id) === String(user._id)) {
                        const tweet = await TweetModel.findOneAndUpdate({ _id: req.params.id }, {
                            $set: {
                                text: req.body.text,
                            }
                        },
                            { unsert: true }
                        )
                        res.status(200).send({
                            status: 'success',
                            data: tweet
                        });
                    }
                    else {
                        res.status(403).send()
                    }
                } else {
                    res.status(404).send()
                }

            }

        } catch (err: any) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
        }
    }
    
    async getUserTweets(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = req.params.id

            if (!isValidObjectId(userId)) {
                res.status(404).send()
                return
            }

            const tweet = await TweetModel.find({ user: userId }).populate('user').exec()
            res.json({
                status: 'success',
                data: tweet
            })

        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }

    async bookmarks(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = req.params.id

            if (!isValidObjectId(userId)) {
                res.status(404).send()
                return
            }

            const tweet = await UserModel.find({_id: userId}).exec()
            res.json({
                status: 'success',
                data: tweet
            })

        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }
}


export const TweetsCtrl = new TweetsController()