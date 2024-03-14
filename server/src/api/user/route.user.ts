import {Router} from 'express';
import { deleteUser, getByUser, postUser, putUser } from './functions.user';

export const userRoutes =  new Router();

userRoutes.route('/user/:key?/:value?').get(getByUser);
userRoutes.route('/createuser').post(postUser);
userRoutes.route('/updateuser/:id?').put(putUser);
userRoutes.route('/deleteuser/:id?').delete(deleteUser);


