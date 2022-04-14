import express from 'express';
import { validationResult } from 'express-validator';
import { generateMD5 } from '../utils/generateHash';
import { UserModel } from '../models/UserModel';
import mailer from '../core/mailer'
import { SentMessageInfo } from "nodemailer/lib/sendmail-transport";
import { UserModelInterface, UserModelDocumentInterface } from '../models/UserModel'
import jwt from 'jsonwebtoken'
import { isValidObjectId } from '../utils/isValidObjectId';
import { TweetModel } from '../models/TweetModel';


class UserController {
    // Request Get All User
    async index(req: express.Request, res: express.Response): Promise<void> {
        try {
            const users = await UserModel.find({}).exec()

            res.json({
                status: 'success',
                data: users.splice(0, 3)
            })


        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
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
                const userId = req.body.id
                const userData = await UserModel.findById(userId)
                if (userData) {
                    if (String(userData._id) === String(user._id)) {
                        const userUP = await UserModel.findOneAndUpdate({ _id: req.body.id }, {
                            $set: {
                                avatar: req.body.avatar,
                                about: req.body.about,
                                location: req.body.location,
                                fullname: req.body.fullname,
                                website: req.body.website,
                                bgImage: req.body.bgImage,
                            }
                        },
                            { unsert: true }
                        ).populate('bookmarks')

                        res.status(200).send({
                            status: 'success',
                            data: userUP
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
    async search(req: express.Request, res: express.Response): Promise<void> {
        try {
            const users = await UserModel.find({username: {$regex: req.params.username, $options: "$i"}}).exec()

            res.json({
                status: 'success',
                data: users
            })


        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }
    // Request Get User By id
    async show(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = req.params.id

            if (!isValidObjectId(userId)) {
                res.status(400).send()
                return
            }

            const user = await UserModel.findById(userId).populate('followers followings liked').exec()

            if (!user) {
                res.status(400).send()
                return
            } else {
                res.json({
                    status: 'success',
                    data: user
                })
            }

        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }
    async withoutDetailsShow(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = req.params.id

            if (!isValidObjectId(userId)) {
                res.status(400).send()
                return
            }

            const user = await UserModel.findById(userId)

            if (!user) {
                res.status(400).send()
                return
            } else {
                res.json({
                    status: 'success',
                    data: user
                })
            }

        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }
    // sign Up
    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ status: 'error', errors: errors.array() });
                return
            }

            const data: UserModelInterface = {
                email: req.body.email,
                username: req.body.username,
                fullname: req.body.fullname,
                password: generateMD5(req.body.password + process.env.SECKRET_KEY),
                confirm_hash: generateMD5(process.env.SECKRET_KEY || Math.random().toString())
            }

            let token = jwt.sign({ data: req.user }, process.env.SECKRET_KEY || '8D@UID@2d22erf', {
                expiresIn: 604800,
            });

            const user = await UserModel.create(data);

            await mailer.sendMail(
                {
                    from: "admin@twitter.com",
                    to: data.email,
                    subject: "Подтверждение почты Twitter Tutorial",
                    html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:8080/auth/verify?hash=${data.confirm_hash}">по этой ссылке</a>`,
                },
                function (err: Error | null, info: SentMessageInfo) {
                    if (err) {
                        res.status(500).json({
                            status: 'error',
                            message: err.message
                        })
                    } else {
                        res.status(201).json({
                            status: 'success',
                            message: "Sucessfuly Created User",
                            link: `https://twitter-2022.herokuapp.com/auth/verify?hash=${data.confirm_hash}`
                        })
                    }
                }
            );
        } catch (err: any) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
        }
    }
    // verify
    async verify(req: express.Request, res: express.Response): Promise<void> {
        try {
            const hash = req.query.hash

            if (!hash) {
                res.status(400).send();
                return
            }

            const user = await UserModel.findOne({ confirm_hash: hash }).exec()
            if (user) {
                user.confirmed = true
                user.save();
                res.send(`<!DOCTYPE html>
                              <html>
                              <head>
                              <title>Добро пожаловать в Twitter!</title>
                              <meta charset="utf-8" />
                              </head>
                              <style>
                                h1 {color:blue; text-align: center}
                                h3 {color:blue; text-align: center}
                                a {color: blue}
                                </style>
                                <body>
                                    <h1> 🎉🎉Ваш аккаунт Twitter успешно подтвержден🎉🎉</h1>
                                    <h3>Перейти на  <a href="https://ubiquitous-dango-78ed99.netlify.app/auth">сайт</a></h3>
                                </body>
                            <html>`);
            } else {
                res.status(400).json({
                    status: 'error',
                    message: 'Пользователь не найден'
                });
            }


        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }

    }

    async login(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user ? (req.user as UserModelDocumentInterface).toJSON() : undefined
            res.json({
                ...user,
                token: jwt.sign({ data: req.user }, process.env.SECKRET_KEY || '8D@UID@2d22erf', {
                    expiresIn: 604800,
                })
            })

        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }

    async getUserInfo(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user: any = req.user ? (req.user as UserModelDocumentInterface).toJSON() : undefined
            if(user) {
                // const userData: any = await UserModel.findById(user._id).getPopulatedPaths({path: 'bookmarks'})

                const query = await UserModel.findById(user._id).populate({path: 'bookmarks'})
                  
                // console.log("Populate:", query?.populated);
                res.json({
                    status: 'success',
                    data: query,
                })
            }else{
                res.status(500).send({
                    status: 'error',
                });
            }
           
        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }

    async unfollow(req: express.Request, res: express.Response): Promise<void> {
        try {
            if (req.body.userId !== req.params.id) {
                try {
                    const user = await UserModel.findById(req.params.id);
                    const currentUser = await UserModel.findById(req.body.userID);
                    if (user?.followers?.includes(req.body.userID)) {

                        await user?.updateOne({ $pull: { followers: req.body.userID } });
                        await currentUser?.updateOne({ $pull: { followings: req.params.id } });

                        res.status(200).json({ message: "user has been unfollowed", followed: false, follower: req.params.id, status: true });
                    } else {
                        res.status(403).json("you allready follow this user");
                    }
                } catch (err) {
                    res.status(500).json(err);
                }
            }
        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }

    async follow(req: express.Request, res: express.Response): Promise<void> {
        try {
            if (req.body.userId !== req.params.id) {
                try {
                    const user: any = await UserModel.findById(req.params.id);
                    const currentUser = await UserModel.findById(req.body.userID);
                    if (!user?.followers?.includes(req.body.userID)) {
                        await user?.updateOne({ $push: { followers: currentUser } });

                        await currentUser?.updateOne({ $push: { followings: req.params.id } });

                        res.status(200).json({ message: "user has been followed", followed: true, follower: req.params.id, status: true });
                    } else {
                        res.status(403).json("you allready follow this user");
                    }
                } catch (err) {
                    res.status(500).json(err);
                }
            }
        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }

    async bookmarks(req: express.Request, res: express.Response): Promise<void> {
        try {
            if (req.body.userId !== req.params.id) {
                try {
                    const user: any = await UserModel.findById(req.params.id);
                    const tweet = await TweetModel.findById(req.body.tweetID);
                    
                    if (!user?.bookmarks?.includes(req.body.tweetID)) {
                        await tweet?.updateOne({ $push: { bookmarks: req.params.id } });
                        await user?.updateOne({ $push: { bookmarks: req.body.tweetID } });
                        res.status(200).json({ message: "tweet bookmarksed", tweetID: req.body.tweetID, userID: req.params.id });
                    } else {
                        await tweet?.updateOne({ $pull: { bookmarks: req.params.id } });
                        await user?.updateOne({ $pull: { bookmarks: req.body.tweetID } });
                        res.status(200).json({ message: "tweet unbookmarksed",tweetID: req.body.tweetID, userID: req.params.id });
                    }
                } catch (err) {
                    res.status(500).json(err);
                }
            }
        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }
}


export const UserCtrl = new UserController()