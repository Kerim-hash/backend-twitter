import express from 'express';
import { ConversationModel } from '../models/Conversation';

class ConversationController {
    // Request 
    async index(req: express.Request, res: express.Response): Promise<void> {
        try {
            const newConversation = new ConversationModel({
                members: [req.body.senderId, req.body.receiverId]
            })
            newConversation.save()
            res.json({
                status: 'success',
                data: newConversation
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
             
            const conversation = await ConversationModel.find({
                members: {$in: [req.params.userId]}
            })

            res.json({
                status: 'success',
                data: conversation
            })


        } catch (err) {
            res.status(500).send({
                status: 'error',
                errors: err
            });
        }
    }
}


export const ConversationCtrl = new ConversationController()