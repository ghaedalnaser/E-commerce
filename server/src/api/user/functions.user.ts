import { Request, Response, NextFunction, RequestHandler } from "express";
import { body, param } from "express-validator";
import * as pg from "../../lib.pool";
import { apiResponder } from "../../utils/apiResponder";
import {
  generateInsertQuery,
  generateUpdateQuery,
  generateDeleteQuery,
} from "../../lib.sqlUtils";
import { apiValidator } from "../../utils/apiValidator";
import { User, getDefaultUser } from "../.././../../models/user.model";
import * as bcrypt from "bcrypt";

// -----------------------GET BY USER----------------------------//

export const getByUser: RequestHandler[] = [
  param("key").optional().isString(),
  param("value").optional(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    let result: User[] = [];
    result = await getBy(req.params.key, req.params.value);
    return result || [];
  }),
];

//-----------------Register Route------------------//
//-----------------------POST USER--------------------------------//
export const postUser: RequestHandler = [
  body("id").optional().bail().isString(),
  body("name").exists().isString().bail(),
  body("email").exists().isString().isEmail().bail(),
  body("isAdmin").exists().isBoolean().bail(),
  body("password").exists().isString(),
  body("sex").optional().bail().isString(),
  body("birth").optional().bail().isString(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const payload: User = req.body;
    const result = await getBy("email", payload.email);
    if (result.length === 0) {
      const result = await createUser(payload);
      console.log(result);
      return result;
    } else {
      throw { message: "User already exist" };
    }
  }),
];

//---------------------PUT USER--------------------//

export const putUser: RequestHandler = [
  param("id").exists().isString(),
  apiValidator,
  apiResponder(async (req: Request) => {
    const payload: User = req.body;
    if (payload.email) {
      const result = await getBy("email", payload.email);
      if (result.length === 0) {
        const result = await updateuser(payload, req.params.id);
        return result;
      } else {
        throw { message: "User already exist" };
      }
    } else {
      console.log(req.params.id);
      const result = await updateuser(payload, req.params.id);
      return result;
    }
  }),
];
//-----------------DeleteUser-------------//

export const deleteUser: RequestHandler = [
  param("id").exists().isString(),
  apiValidator,
  apiResponder(async (req: Request) => {
    const user: User = req.params;
    const result = await dropUser(user);
    return result || [];
  }),
];

//   ---------------------- getby  Function----------------------//
export const getBy = async (key?: string, value?: any): Promise<User[]> => {
  let user: User[];
  if ((!key && value) || (key && !value)) throw Error("Invalid Arguments");

  let query = `SELECT * FROM public."user"`;
  const queryValues: any[] = [];
  if (key && value && Object.keys(getDefaultUser()).includes(key.trim())) {
    query += `WHERE "${key.trim()}" =  $1 `;
    queryValues.push(value);
  }
  query += ";";
  user = (await pg.db.query<User>(query, queryValues)).rows;
  return user;
};
//-----------------Function createuser---------------------------//

export const createUser = async (user: User) => {
  const password = await bcrypt.hash( user.password ? user.password : user.email, 10 );
  user.password = password;  
    const query = generateInsertQuery(
      `public."user"`,
      getDefaultUser(),
      user,
      true,
      false
    );
   const  result = (await pg.db.query<User>(query.text, query.values)).rows[0];
  return result;
};

//--------------Function  update userdata --------------------//
export const updateuser = async (user: User, id: string) => {
  if (user.password) {
    let password = bcrypt.hash(user.password ? user.password : user.email, 10);
    user.password = password;
  }
  const query = generateUpdateQuery(
    'public."user"',
    getDefaultUser,
    user,
    true
  );
  query.text += ` WHERE  id  =  '${id}'  ;`;
  const result = (await pg.db.query<User>(query.text, query.values)).rows;
  return result;
};
//--------------------------DROP user   -------------------//
export const dropUser = async (user: User) => {
  const query = generateDeleteQuery('public."user"', user);
  const result = (await pg.db.query<User>(query.text, query.values)).rows[0];
  return result;
};
