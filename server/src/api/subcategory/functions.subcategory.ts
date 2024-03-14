import { Request, Response, NextFunction, RequestHandler } from "express";
import { body, param } from "express-validator";
import * as pg from "../../lib.pool";
import { apiResponder } from "../../utils/apiResponder";
import { apiValidator } from "../../utils/apiValidator";
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";
import {
  generateInsertQuery,
  generateDeleteQuery,
  generateUpdateQuery,
} from "../../lib.sqlUtils";
import {
  subCategory,
  getDefaultSubCategory,
} from "../../../../models/subCategory.model";
import { cat_getBy } from "../category/functions.category";
import { Category } from "../../../../models/category.model";

//------------------  GET <All subCategorys  | |  Specific subCategory by {key:value}>--------------//

export const getBySubCategory: RequestHandler[] = [
  param("key").optional().isString(),
  param("value").optional(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    let result: subCategory[] = [];
    result = await sub_getBy(req.params.key, req.params.value);
    let result2: Category[] = [];
    //##if you want to display the category details of subcategory##
    for (var i = 0; i < result.length; i++) {
      result2 = (await cat_getBy("id", result[i].category));
      result[i].category = {
        id: result[i].category,
        name: result2[0].name,
        slug: result2[0].slug,
      };
    }
    return result || [];
  }),
];

//------------------  POST a new subCategory--------------//

export const setCategoryId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // nested route
  if (!req.body.category) req.body.category = req.params.category;
  next();
};

export const postSubCategory: RequestHandler[] = [
  setCategoryId,
  body("name")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Category name required")
    .isLength({ min: 2, max: 30 })
    .withMessage("length between 2 => 30"),
  body("category").notEmpty().withMessage("category required "),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const subcategory = await sub_getBy("name", payload.name);
    if (subcategory.length === 0) {
      const result = await createSubCategory(payload);
      return result || [];
    } else {
      return res.status(StatusCodes.CONFLICT).json({
        code: StatusCodes.CONFLICT,
        message: " subCategory already  exists",
      });
    }
  }),
];

// -------------PUT a new Category----------------//

export const putSubGategory: RequestHandler[] = [
  param("id").exists().isString(),
  body("name").optional().isString(),
  body("category").optional().isString(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const payload: subCategory = req.body;
    payload.slug = slugify(req.body.name);
    const result = await updateSubCategory(payload, req.params.id);
    return result || [];
  }),
];

//----------DELETE a specifice Category----------------//

export const deleteSubCategory: RequestHandler = [
  param("id").exists().isString(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const subcategory: subCategory = req.params;
    const result = await dropSubCategory(subcategory);
    return result || [];
  }),
];

//---------------Function GET data from DB  <SELECT * ||  SELECT * WHERE KEY=VALUE>------------//

export const sub_getBy = async (
  key?: string,
  value?: string
): Promise<subCategory[]> => {
  let subcategory: subCategory[];
  if ((!key && value) || (key && !value)) throw Error("Invalid Arguments");

  let query = `SELECT * FROM public."subcategory"`;
  const queryValues: any[] = [];
  if (
    key &&
    value &&
    Object.keys(getDefaultSubCategory()).includes(key.trim())
  ) {
    query += `WHERE "${key.trim()}" iLIKE $1`;
    queryValues.push(value);
  }
  query += " ;";
  console.log(query);
  subcategory = (await pg.db.query<subCategory>(query, queryValues)).rows;
  return subcategory;
};

//------------Function CreateCategory using  func(genearteInsertQuery)----------//

export const createSubCategory = async (subategory: subCategory) => {
  subategory.slug = slugify(subategory.name);
  const query = generateInsertQuery(
    `public."subcategory"`,
    getDefaultSubCategory(),
    subategory,
    true,
    false
  );
  const result = (await pg.db.query<subCategory>(query.text, query.values))
    .rows[0];
  return result;
};

//--------------- FUNCTION updateCategory-----------//

export const updateSubCategory = async (subcategory: subCategory, id) => {
  const query = generateUpdateQuery(
    `public."subcategory"`,
    getDefaultSubCategory(),
    subcategory,
    true
  );
  query.text += ` WHERE  id  =  '${id}' ;`;
  const result = (await pg.db.query<subCategory>(query.text, query.values))
    .rows[0];
  return result;
};

//-------------FUNCTION deleteCategory---------------------//

export const dropSubCategory = async (subcategory: subCategory) => {
  const query = generateDeleteQuery('public."subcategory"', subcategory);
  const result = (await pg.db.query<subCategory>(query.text, query.values))
    .rows[0];
  return result;
};
