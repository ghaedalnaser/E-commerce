import { objectify } from "../utils/objectify";

export interface subCategory {
  id?: string;
  name: string;
  slug?: string;
  category: any;
}

const defauleSubCategory: Required<subCategory> = {
  id: "",
  name: "",
  slug: "",
  category: "",
};

export const getDefaultSubCategory = () => {
  return objectify(defauleSubCategory);
};
