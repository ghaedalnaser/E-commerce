import { Router } from "express";

import {
  deleteCategory,
  getByCategory,
  postCategory,
  putGategory,
} from "./functions.category";

export const categoryRoutes: Router = Router();

categoryRoutes.route("/category/:key?/:value?").get(getByCategory);
categoryRoutes.route(`/category/createCategory`).post(postCategory);
categoryRoutes.route(`/category/updateCategory/:id?`).put(putGategory);
categoryRoutes.route(`/category/deleteCategory/:id?`).delete(deleteCategory);
