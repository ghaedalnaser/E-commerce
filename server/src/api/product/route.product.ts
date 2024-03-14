import {Router} from 'express';
import { getByProduct,postProduct,deleteProduct, putProduct , filterProducts,searchProducts} from './functions.product';


export const productRoutes =  new Router();

productRoutes.route(`/product/:key?/:value?`).get(getByProduct);
productRoutes.route(`/product/createproduct`).post(postProduct);
productRoutes.route(`/product/updateproduct/:id?`).put(putProduct);
productRoutes.route(`/product/deleteproduct/:id?`).delete(deleteProduct);
productRoutes.route(`/productfilter`).get(filterProducts);
productRoutes.route(`/productsearch`).get(searchProducts);




