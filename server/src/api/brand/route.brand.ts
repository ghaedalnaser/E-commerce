import  {Router} from 'express';
import { postBrand, getByBrand,deleteBrand, putBrand} from './functions.brand';

export const brandRoutes =  new Router();

brandRoutes.route(`/brand/:key?/:value?`).get(getByBrand);
brandRoutes.route(`/brand/createbrand`).post(postBrand);
brandRoutes.route(`/brand/updatebrand/:id?`).put(putBrand);
brandRoutes.route(`/brand/deletebrand/:id?`).delete(deleteBrand);



