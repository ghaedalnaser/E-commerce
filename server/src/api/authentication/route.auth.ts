import {Router} from 'express';
import { signInUser } from './functions.auth';

export const authRoutes = new Router();

authRoutes.route(`/auth`).post(signInUser);

