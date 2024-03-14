import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import * as createError from 'http-errors';


export const  apiValidator = (req:Request,res:Response,next:NextFunction)=>{
    const errors = validationResult(req);
    if(errors.isEmpty()){
        next();
    }else{
        throw createError(StatusCodes.BAD_REQUEST,'Bad Request',{errors:errors.array()});
    }
}