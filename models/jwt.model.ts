import { objectify } from "../utils/objectify";

export interface JWT {
    uid: string,  // id
    name: string,
	email: string,
	type?: string,
	isAdmin?: boolean, // default false
	tokenLife?: number,
	refreshToken?: string,
	refreshTokenLife?: number,
	token?: string; //AccessToken
	actorType?: string
}
 export const defaultJWT :JWT={
    uid: '',
    name: '',
	email: '',
	type: '',
	isAdmin: false, // default false
	tokenLife: 0,
	refreshToken: '',   
	refreshTokenLife: 0,
	token: '',
	actorType: ''
 }
 export  const getdefaultJWT = ()=>{
    return objectify(defaultJWT);
 }