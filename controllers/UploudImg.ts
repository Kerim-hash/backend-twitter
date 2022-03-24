import express from 'express';
import cloudinary from "../core/cloudinary"

class UploudController {
    async index(req: express.Request, res: express.Response): Promise<void> {
        const file = req.file
        await cloudinary.v2.uploader.upload_stream({resource_auto: 'auto'}, function (err, result) {
            if(err || !result){
                res.status(500).send({
                    status: "error",
                    message: err || 'error'
                })
            }
            res.status(201).send({
                url: result?.url,
                width: result?.width,
                height: result?.height,
            })
        }).end(file?.buffer);
    }

}


export const UploudCtrl = new UploudController()