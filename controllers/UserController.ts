import express from 'express';
import { validationResult } from 'express-validator';
import { generateMD5 } from '../utils/generateHash';
import { UserModel } from '../models/UserModel';
import { sendEmail } from '../utils/sendEmail';
import mailer from '../core/mailer'
import { SentMessageInfo } from "nodemailer/lib/sendmail-transport";
import { UserModelInterface, UserModelDocumentInterface } from '../models/UserModel'

import jwt from 'jsonwebtoken'
import { isValidObjectId } from '../utils/isValidObjectId';


class UserController {
    // Request Get All User
    async index(req: express.Request, res: express.Response): Promise<void> {
        try {
            const users = await UserModel.find({}).exec()

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

            const user = await UserModel.findById(userId).populate('tweets').exec()

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
                            link: `http://localhost:8080/auth/verify?hash=${data.confirm_hash}`
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
      <h3>Перейти на  <a href="http://localhost:3000/auth">сайт</a></h3>
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
            const user = req.user ? (req.user as UserModelDocumentInterface).toJSON() : undefined
            res.json({
                status: 'success',
                data: user,
            })
        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }
}


export const UserCtrl = new UserController()