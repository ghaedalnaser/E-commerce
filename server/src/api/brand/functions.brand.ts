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
  Brand,
  getDefaultBrand,
} from "../../../../models/brand.model";
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";
// import {LoggerServices }from'../../Logger.Services';
//------------------  GET <All Brands  | |  Specific Brands by {key:value}>--------------//


// const logger = new LoggerServices('BRAND');

export const getByBrand: RequestHandler[] = [
  param("key").optional().isString(),
  param("value").optional(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    let result: Brand[] = [];
    result = await  getBy(req.params.key, req.params.value);
    // logger.info1('brand',result);
    return result || [];
  }),
];

//------------------  POST a new Brand-------------//

export const postBrand: RequestHandler[] = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Category name required")
    .isLength({ min: 3, max: 20 })
    .withMessage("length between 3 =>30"),
    // body("image").optional().isString(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const brand = await getBy("name", payload.name);
    if (brand.length === 0) {
      const result = await createBrand(payload);
      return result || [];
    } else {
      return res.status(StatusCodes.CONFLICT).json({
        code: StatusCodes.CONFLICT,
        message: " Brand already  exists",
      });
    }
  }),
];

// -------------PUT a new Brand----------------//

export const putBrand: RequestHandler[] = [
  param("id").exists().isString(),
  body("name").exists().isString(),
  body("image").optional().isString(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const payload: Brand = req.body;
    payload.slug = slugify(req.body.name);
    const result = await updateBrand(payload, req.params.id);
    return result || [];
  }),
];

//----------DELETE a specifice Brand----------------//

export const deleteBrand: RequestHandler = [
  param("id").exists().isString(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const brand: Brand = req.params;
    const result = await dropBrand(brand);
    return result || [];
  }),
];

//---------------Function GET data from DB  <SELECT * ||  SELECT * WHERE KEY=VALUE>------------//

export const getBy= async (key?: string, value?: string): Promise<Brand[]> => {
  let brand: Brand[];
  if ((!key && value) || (key && !value)) throw Error("Invalid Arguments");

  let query = `SELECT * FROM public."brand"`;
  const queryValues: any[] = [];
  if (key && value && Object.keys(getDefaultBrand()).includes(key.trim())) {
    query += `WHERE "${key.trim()}" iLIKE  $1 `;
    queryValues.push(value);
  }
  query += " order by name;";
  brand = (await pg.db.query<Brand>(query, queryValues)).rows;
  return brand;
};

//------------Function CreateBrand using  func(genearteInsertQuery)----------//

export const createBrand = async (brand:Brand) => {
  brand.slug = slugify(brand.name);
  const query = generateInsertQuery(
    `public."brand"`,
    getDefaultBrand(),
    brand,
    true,
    false
  );
  const result = (await pg.db.query<Brand>(query.text, query.values))
    .rows[0];
  return result;
};

//--------------- FUNCTION updateBrand-----------//

export const updateBrand = async (brand:Brand, id) => {
  const query = generateUpdateQuery(
    `public."brand"`,
    getDefaultBrand(),
    brand,
    true
  );
  query.text += ` WHERE  id  =  '${id}' ;`;
  const result = (await pg.db.query<Brand>(query.text, query.values))
    .rows[0];
  return result;
};

//-------------FUNCTION deleteBrand---------------------//

export const dropBrand = async (brand:Brand) => {
  const query = generateDeleteQuery('public."brand"', brand);
  const result = (await pg.db.query<Brand>(query.text, query.values))
    .rows[0];
  return result;
};
