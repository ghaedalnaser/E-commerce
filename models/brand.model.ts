import { objectify } from "../utils/objectify";

export interface Brand {
  id?: string;
  name: string;
  slug: string;
  image: string;
}

export const defaultBrand: Required<Brand> = {
  id: "",
  name: "",
  slug: "",
  image: "",
};
export const getDefaultBrand = () => {
    return objectify(defaultBrand);
};

