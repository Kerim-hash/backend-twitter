import express from 'express';
import { validationResult } from 'express-validator';
import { ConversationModel } from '../models/Conversation';
import { UserModelDocumentInterface } from '../models/UserModel';

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
    async getConversationById(req: express.Request, res: express.Response): Promise<void> {
        try {
             
            const conversation = await ConversationModel.findById(req.params.id)

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
    async deleteConversation(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelDocumentInterface;

            if (user) {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ status: 'error', errors: errors.array() });
                    return
                }
                const conversationId = req.params.id

                const conversation = await ConversationModel.findById(conversationId)

//               console.log(conversation.members[0] ? conversation.members[0] : conversation.members[1])
                if (conversation) {
                    if (String(conversation.members[0]) || String(conversation.members[1])  === String(user._id)) {

                        conversation.remove()
                        res.status(202).send({
                            status: 'success',
                            message: 'Successfully deleted conversation'
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
}


export const ConversationCtrl = new ConversationController()