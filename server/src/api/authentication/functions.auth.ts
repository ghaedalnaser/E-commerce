import { Request, Response, NextFunction, RequestHandler } from "express";
import { body } from "express-validator";
import { StatusCodes as HttpStatus } from "http-status-codes";
import { JWT } from "../../../../models/jwt.model";
import * as bcrypt from "bcrypt";
import * as pg from "../../lib.pool";
import { generateAuthToken, verifyAuthToken } from "../../lib.auth";
import createHttpError = require("http-errors");
import { settings } from "../../../../settings/setting";
import { apiValidator } from "../../utils/apiValidator";

export const signInFunc = async (email: string, password: string) => {
  const query = `SELECT u.*  from public."user"  u  WHERE  lower(u."email")=lower($1)`;
  const PGuser = (await pg.db.query(query, [email])).rows;
  if (PGuser.length <= 0) throw createHttpError.NotFound("user not found .");
  else if (PGuser.length > 1)
    throw createHttpError.Conflict("duplicate user found in Database");
  else if (!!password && !bcrypt.compareSync(password, PGuser[0].password))
   { console.log(PGuser[0]);
    console.log(bcrypt.compareSync(password, PGuser[0].password),!!password);
    throw new createHttpError.NotFound("user name/password error!");}
  return PGuser[0];
};

export const signInUser: RequestHandler = [
  body("email").isEmail().exists().bail(),
  body("password").isString().exists().bail(),
  apiValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const user = await signInFunc(payload.email, payload.password);
      if (user.isRejected) {
        throw new createHttpError.Unauthorized(
          "User is Rejected Please Contact System Administrator."
        );
      }
      const jwt: JWT = {
        uid: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false,
        tokenLife: +settings.jwtTokenLifeTime,
        actorType: "user",
      };
      const jwtToken = generateAuthToken(jwt);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        token: jwtToken,
        message: "success",
      });
    } catch (error) {
        console.log(error);
    }
  },
];

export const verifyRefreshToken=(refreshToken)=>{
    return new Promise((resolve,reject)=>{
        const user = verifyAuthToken(refreshToken)
        const userid =  user?.id;
        resolve(userid);
        })
}


const checkVerifiedUser = async ( email: string, password?: string ) => {
	const pgUser = ( await
		pg.db.query( ` SELECT u.* from public."user" u where lower(u."email") = lower ($1)`, [ email ] ) ).rows;
	if ( pgUser.length <= 0 ) throw new createHttpError.NotFound( 'user not found!' );
	else if ( pgUser.length > 1 ) throw new createHttpError.Conflict( 'duplicate users found in pg' );
	if ( !!password && !bcrypt.compareSync( password, pgUser[ 0 ].password ) ) throw new createHttpError.NotFound( 'user name/passowrd error!' );
	return pgUser[ 0 ];
}

export const checkVerified: RequestHandler[] = [
	body( 'email' ).isString().bail().exists(),
	body( 'password' ).isString().bail().exists(),
	async ( req: Request, res: Response, next: NextFunction ) => {
		try {
			const payload = req.body;
			const user = await checkVerifiedUser( payload.email, payload.password );
			user.password = "";
			const jwt: JWT = {
                uid: user.id,
                name: user.name,
				email: user.email,
				isAdmin: user.isAdmin || false,
				tokenLife: +settings.jwtTokenLifeTime,
				actorType: 'user'
			}
			const jwtToken = generateAuthToken( jwt );

			res.status( HttpStatus.OK ).json( {
				code: HttpStatus.OK, data: { token: jwtToken }, message: 'success'
			} );
		}
		catch ( error ) {
			console.log(error);

		}
	}
]
