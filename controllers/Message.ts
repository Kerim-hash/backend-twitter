import express from 'express';
import { MessageModel, MessageModelDocumentInterface, MessageModelInterface } from '../models/Message';

class MessageController {
    // Request Get All User
    async index(req: express.Request, res: express.Response): Promise<void> {
        try {
            const data: MessageModelInterface = {
                conversationId: req.body.conversationId,
                text: req.body.text,
                sender: req.body.sender
            } 

            const savedMessage = await MessageModel.create(data)
            
            res.json({
                status: 'success',
                data: savedMessage
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
            const message = await MessageModel.find({
                conversationId: req.params.conversationId
            })

            res.json({
                status: 'success',
                data: message
            })


        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }
}


export const MessageCtrl = new MessageController()