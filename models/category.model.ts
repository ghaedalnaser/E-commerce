import { objectify } from "../utils/objectify";

export interface Category {
  id?: string,
  name:string,
  slug?:string;
};

const defauleCategory: Required<Category> = {
    id:'',
    name:'',
    slug:''
};
export const getDefaultCategory = () => {
    return objectify(defauleCategory);
};
