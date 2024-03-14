import { postSubCategory, getBySubCategory,putSubGategory,deleteSubCategory } from "./functions.subcategory";
import { Router } from "express";

export const subCategoryRoutes = new Router();

subCategoryRoutes.route(`/subcategory/:key?/:value?`).get(getBySubCategory);
subCategoryRoutes.route(`/subcategory/createsubcategory`).post(postSubCategory);// category in req.body
subCategoryRoutes.route(`/subcategory/createsubcategory/:category?`).post(postSubCategory);//category in req.params
subCategoryRoutes.route(`/subcategory/updatesubcategory/:id?`).put(putSubGategory);
subCategoryRoutes.route(`/subcategory/deletesubcategory/:id?`).delete(deleteSubCategory);

