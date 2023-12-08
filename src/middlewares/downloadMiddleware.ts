
import Joi from "joi";
import { BadRequest } from "../errorHandler";
import { NextFunction, Request, Response } from "express";

class DownloadMiddleware{

    static downloadMiddleware(req:Request,res:Response,next:NextFunction){
        const joiSchema=Joi.object({
            url:Joi.string().required(),
            isMp3:Joi.boolean().optional(),
        });
        const {error}=joiSchema.validate(req.body);
        if(error){
            throw new BadRequest(error.details[0].message);
        }else{
            next();
        }

    }

}

export default DownloadMiddleware;