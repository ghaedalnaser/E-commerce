import { Router } from "express";
import { categoryRoutes } from "./category/route.category";
import { subCategoryRoutes } from "./subcategory/route.subCategory";
import { brandRoutes } from "./brand/route.brand";
import { productRoutes } from "./product/route.product";
import { userRoutes } from "./user/route.user";
import { authRoutes } from "./authentication/route.auth";

export const apiRoutes: Router = Router();

apiRoutes.use(categoryRoutes);
apiRoutes.use(subCategoryRoutes);
apiRoutes.use(brandRoutes);
apiRoutes.use(productRoutes);
apiRoutes.use(userRoutes);
apiRoutes.use(authRoutes);