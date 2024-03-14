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
import {
  Category,
  getDefaultCategory,
} from "../../../../models/category.model";
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";

//------------------  GET <All Categorys  | |  Specific Category by {key:value}>--------------//

export const getByCategory: RequestHandler[] = [
  param("key").optional().isString(),
  param("value").optional(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    let result: Category[] = [];
    result = await cat_getBy(req.params.key, req.params.value);
    return result || [];
  }),
];

//------------------  POST a new Category--------------//

export const postCategory: RequestHandler[] = [
  body("name")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Category name required")
    .isLength({ min: 3, max: 30 })
    .withMessage("length between 3 =>30"),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const category = await cat_getBy("name", payload.name);
    if (category.length === 0) {
      const result = await createCategory(payload);
      return result || [];
    } else {
      return res.status(StatusCodes.CONFLICT).json({
        code: StatusCodes.CONFLICT,
        message: " Category already  exists",
      });
    }
  }),
];

// -------------PUT a new Category----------------//

export const putGategory: RequestHandler[] = [
  param("id").exists().isString(),
  body("name").exists().isString(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const payload: Category = req.body;
    payload.slug = slugify(req.body.name);
    const result = await updateCategory(payload, req.params.id);
    return result || [];
  }),
];

//----------DELETE a specifice Category----------------//

export const deleteCategory: RequestHandler = [
  param("id").exists().isString(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const category: Category = req.params;
    const result = await dropCategory(category);
    return result || [];
  }),
];

//---------------Function GET data from DB  <SELECT * ||  SELECT * WHERE KEY=VALUE>------------//

export const cat_getBy= async (key?: string, value?: string): Promise<Category[]> => {
  let category: Category[];
  if ((!key && value) || (key && !value)) throw Error("Invalid Arguments");

  let query = `SELECT * FROM public."category"`;
  const queryValues: any[] = [];
  if (key && value && Object.keys(getDefaultCategory()).includes(key.trim())) {
    query +=" "+ `WHERE "${key.trim()}" =  $1 `;
    queryValues.push(value);
  }
  query += "order by name;";
  category = (await pg.db.query<Category>(query, queryValues)).rows;
  return category;
};

//------------Function CreateCategory using  func(genearteInsertQuery)----------//

export const createCategory = async (category: Category) => {
  category.slug = slugify(category.name);
  const query = generateInsertQuery(
    `public."category"`,
    getDefaultCategory(),
    category,
    true,
    false
  );
  const result = (await pg.db.query<Category>(query.text, query.values))
    .rows[0];
  return result;
};

//--------------- FUNCTION updateCategory-----------//

export const updateCategory = async (category: Category, id) => {
  const query = generateUpdateQuery(
    `public."category"`,
    getDefaultCategory(),
    category,
    true
  );
  query.text += ` WHERE  id  =  '${id}' ;`;
  const result = (await pg.db.query<Category>(query.text, query.values))
    .rows[0];
  return result;
};

//-------------FUNCTION deleteCategory---------------------//

export const dropCategory = async (category: Category) => {
  const query = generateDeleteQuery('public."category"', category);
  const result = (await pg.db.query<Category>(query.text, query.values))
    .rows[0];
  return result;
};
