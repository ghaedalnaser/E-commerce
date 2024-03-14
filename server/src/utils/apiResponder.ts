import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const apiResponder = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).then((result:any)=>{
        if(!result) return;
        try{
            res.status(StatusCodes.OK).json({
                code: StatusCodes.OK,
                message: result.message || 'Success',
                data: result.onlyDataToBeSent || result,
            })
        } catch(error){
             console.error(error);
            // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code:StatusCodes.INTERNAL_SERVER_ERROR,message:'',error: error, data:{}});
        }
    }).catch(next);
  };
};
