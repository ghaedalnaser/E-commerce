import { objectify } from "../utils/objectify";

export interface User {
    id? : string,
    name:string,
    email:string,
    password:string,
    isAdmin?:boolean,
    sex?:string,
    birth?:string
};

const defaultUser: Required<User> = {
    id :"",
    name:"",
    email:"",
    password:"",
    isAdmin:false,
    sex:"",
    birth:""
};
export const getDefaultUser = ()=>{
    return objectify(defaultUser);
}
