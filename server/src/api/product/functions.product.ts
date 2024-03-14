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
import { Product, getDefaultProduct } from "../../../../models/product.model";
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";
import { cat_getBy } from "../category/functions.category";
import { sub_getBy } from "../subcategory/functions.subcategory";
import { removeDuplicatesFromArray } from "../../../../utils/removeDuplicates";
import * as multer from "multer";
import * as fs from 'fs'

//---IMAGE--//

//------------------  GET <All Product  | |  Specific product by {key:value}>--------------//

export const getByProduct: RequestHandler[] = [
  param("key").optional().isString(),
  param("value").optional(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    let result: Product[] = [];
    result = await getBy(req.params.key, req.params.value);
    return result || [];
  }),
];
//--------FIlTERATION---------//
//-----------------GET <Product By Filter>---------------------------------//
export const filterProducts: RequestHandler[] = [
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const products = await getByFilter(req.query);
    return products || [];
  }),
];

//-----------SEARCHING---------//
export const searchProducts: RequestHandler[] = [
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    let result: Product[] = [];
    result = await search(req.query.keyword);
    return result || [];
  }),
];
//------------------  POST a new Product--------------//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname
    );
  },
});
export const upload = multer({
  storage: storage,
  limits: { filesSize: 100 * 1024 * 1024 },
});

export const postProduct: RequestHandler[] = [
  body("title")
    .isString()
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters")
    .notEmpty()
    .withMessage("titile required"),
  body("description")
    .isString()
    .isLength({ max: 2000 })
    .notEmpty()
    .withMessage("product description is required"),
  body("quantity")
    .isNumeric()
    .withMessage("quantity must be a number")
    .notEmpty()
    .withMessage("quantity product is required"),
  body("sold").optional().isNumeric().withMessage("sold must be a number"),
  body("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("price must be a number")
    .isLength({ max: 32 })
    .withMessage("too long price"),
  body("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage(" priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value)
        throw `PriceAfterDiscount must be lower than price`;
      return true;
    }),
  body("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be a array of strings"),
  body("imgColors").optional(), //.notEmpty().withMessage("imgColor is required"),
  body("images").optional(),
  body("category")
    .isString()
    .notEmpty()
    .withMessage("product category required"),
  body("subCategory").optional(),
  body("brand").isString().optional(),
  body("ratingsAverage")
    .isNumeric()
    .withMessage("ratingsAverage of product must be a number")
    .isLength({ min: 1, max: 5 })
    .withMessage("ratingsAverage must between 1 && 5"),
  body("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
    body('images').exists().bail().isArray(),
  upload.array("images",3),
  body('colors').bail(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const category1 = await cat_getBy("id", payload.category);
    const product_title = await getBy("title", payload.title);
    //image
    const uploadedImages: string[] = [];
    for (const fieldname in req.files) {
      if (!fs.existsSync(`../../../images/`)) fs.mkdirSync('../../../images/');
      uploadedImages.push(`../../../images/${req.files[fieldname].originalname}`);
    }
    payload.images = uploadedImages;
    // testing of subcategories include in database.
    let values = new Array();
    let subcategories = new Array();
    payload.subCategory = removeDuplicatesFromArray(payload.subCategory);
    for (let i = 0; i < payload.subCategory.length; ++i) {
      values[i] = await sub_getBy("id", payload.subCategory[i]);
      if (values[i].length != 0) subcategories.push(values[i]);
    }
    //testi if subucategories include find  in same category
    const subcategories1 = await sub_getBy("category", payload.category);
    let subcategoriesID = new Array();
    subcategories1.forEach((subcategory) => {
      subcategoriesID.push(subcategory.id);
    });
    if (!payload.subCategory.every((value) => subcategoriesID.includes(value)))
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        message: "subcategories not belong to category",
      });
    if (
      product_title.length == 0 &&
      category1.length != 0 &&
      subcategories.length != 0 &&
      subcategories.length == payload.subCategory.length
    ) {
      const result = await createProduct(payload);
      return result || [];
    } else {
      if (product_title.length != 0) {
        return res.status(StatusCodes.CONFLICT).json({
          code: StatusCodes.CONFLICT,
          message: " Product already  exists",
        });
      } else if (category1.length == 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          code: StatusCodes.NOT_FOUND,
          message: " Category does not exist",
        });
      } else if (
        subcategories.length === 0 ||
        subcategories.length != payload.subCategory.length
      ) {
        return res.status(StatusCodes.NOT_FOUND).json({
          code: StatusCodes.NOT_FOUND,
          message: " subCategory does not exist",
        });
      }
    }
  }),
];

// -------------PUT a new Product----------------//

export const putProduct: RequestHandler[] = [
  param("id").exists().isString(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const payload: Product = req.body;
    if (req.body.titile) payload.slug = slugify(req.body.title);
    const result = await updateProduct(payload, req.params.id);
    return result || [];
  }),
];

//----------DELETE a specifice Product----------------//

export const deleteProduct: RequestHandler = [
  param("id").exists().isString(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const product: Product = req.params;
    const result = await dropProduct(product);
    return result || [];
  }),
];

//---------------Function GET data from DB  <SELECT * ||  SELECT * WHERE KEY=VALUE>------------//

export const getBy = async (key?: string, value?: any): Promise<Product[]> => {
  let product: Product[];
  if ((!key && value) || (key && !value)) throw Error("Invalid Arguments");

  let query = `SELECT * FROM public."product"`;
  const queryValues: any[] = [];
  if (key && value && Object.keys(getDefaultProduct()).includes(key.trim())) {
    query += `WHERE "${key.trim()}" =  $1 `;
    queryValues.push(value);
  }
  query += ";";
  product = (await pg.db.query<Product>(query, queryValues)).rows;
  return product;
};
//---------------Function GET data from DB  <SELECT * ||  SELECT * WHERE KEY=VALUE  FILTERATOIN>------------//

const getByFilter = async (filter) => {
  var whereQuery: any[] = [];
  if (filter.title) {
    whereQuery.push(`p.title LIKE '%${filter.title}%'`);
  }
  if (filter.category) {
    whereQuery.push(`p.category='${filter.category}'`);
  }
  if (filter.subCategory) {
    whereQuery.push(`p."subCategory"='${filter.subCategory}' `);
  }
  if (filter.priceFrom) {
    whereQuery.push(`p.price>='${filter.priceFrom}'`);
  }
  if (filter.priceTo) {
    whereQuery.push(`p.price<='${filter.priceTo}'`);
  }
  if (filter.brand) {
    whereQuery.push(`p.brand='${filter.brand}' `);
  }
  if (filter.ratingsAverageFrom) {
    whereQuery.push(`p."ratingsAverage">='${filter.ratingsAverageFrom}' `);
  }
  if (filter.ratingsAverageTo) {
    whereQuery.push(`p."ratingsAverage"<='${filter.ratingsAverageTo}' `);
  }
  let filterQuery = "";

  for (let it = 0; it < whereQuery.length; it++) {
    if (it == 0) {
      filterQuery = "Where " + whereQuery[it];
    } else {
      filterQuery += " and " + whereQuery[it];
    }
  }
  let fileds = ``;
  let join = ``;
  if (filter.category) {
    fileds += " " + `c.name as category_name ,`;
    join += " " + ` join public."category" as c on p.category=c.id `;
  }
  if (filter.subCategory) {
    fileds += " " + `s.name as subCategory_name ,`;
    join += " " + `join public."subcategory" as s on p."subCategory" = s.id`;
  }
  if (filter.brand) {
    fileds += " " + `b.name as brand_name ,`;
    join += " " + `join public."brand" as b on b.id = p.brand`;
  }
  fileds += " " + "p.*";
  let query = `SELECT  ${fileds}  FROM public."product" as p ${join} `;
  query += " " + filterQuery;

  //-----SORTING ORDER BY PRICE ----//
  if (filter.priceFrom) {
    query += " " + "order by p.price desc;";
  }
  if (filter.priceTo) {
    query += " " + "order by p.price asc;";
  }
  console.log(query);
  let products: Product[];
  products = (await pg.db.query<Product>(query)).rows;
  return products;
};

//------------GET SEARCHING-----------//

const search = async (keyword: String) => {
  let query = `SELECT  *  FROM public."product" WHERE title iLIKE '%${keyword}%' or description iLIKE '%${keyword}%';`;
  console.log(query);
  let products: Product[] = [];
  products = (await pg.db.query<Product>(query)).rows;
  return products;
};

//------------Function CreateProduct using  func(genearteInsertQuery)----------//

export const createProduct = async (product: Product) => {
  product.slug = slugify(product.title);
  const query = generateInsertQuery(
    `public."product"`,
    getDefaultProduct(),
    product,
    true,
    false
  );
  const result = (await pg.db.query<Product>(query.text, query.values)).rows[0];
  return result;
};

//--------------- FUNCTION updateProduct----------//

export const updateProduct = async (product: Product, id) => {
  const query = generateUpdateQuery(
    `public."product"`,
    getDefaultProduct(),
    product,
    true
  );
  query.text += ` WHERE  id  =  '${id}' ;`;
  const result = (await pg.db.query<Product>(query.text, query.values)).rows[0];
  return result;
};

//-------------FUNCTION deleteProduct---------------------//

export const dropProduct = async (product: Product) => {
  const query = generateDeleteQuery('public."product"', product);
  const result = (await pg.db.query<Product>(query.text, query.values)).rows[0];
  return result;
};

//------------------------------------------------------------------------------------------


// // --------------
// interface Photo {
//   image?: string;
//   images: any[];
// }
// const fs = require("fs");
// export const photo: RequestHandler = [
//   body("images").isArray(),
//   upload.array("images", 2),
//   apiResponder(async (req: Request, res: Response, next: NextFunction) => {
//     const uploadedImages: string[] = [];
//     for (const fieldname in req.files) {
//       if (!fs.existsSync(`../../../images/`)) fs.mkdirSync('../../../images/');
//       uploadedImages.push(`../../../images/${req.files[fieldname].originalname}`);
//     }
//     const photo : Photo = req.files ;
//     photo.images =uploadedImages;
//    return uploadedImages;
//   }),
// ];


// const defaultPhoto: Required<Photo> = {
//   image: "",
//   images: [],
// };
// export const getDefaultPhoto = () => {
//   return objectify(defaultPhoto);
// };
// export const createimage = async (image: Photo) => {
//   const query = generateInsertQuery(
//     `public."photo"`,
//     getDefaultPhoto(),
//     image,
//     true,
//     false
//   );
//   const result = (await pg.db.query<Photo>(query.text, query.values)).rows[0];
//   return result;
// };
