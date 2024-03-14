import { objectify } from "../utils/objectify";

export interface Product {
  id?: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  sold: number; //sell operations of each product.
  price: number;
  priceAfterDiscount?: number;
  colors: string[];
  imgColors: string[];
  images: string[];
  category: any; //id category <Foriegn Key>
  subCategory: string[]; //id subcategories   <Foriegn Key>
  brand: any; //id prand    <Foriegn Key>
  ratingsAverage: number; // min =1 , max =5
  ratingsQuantity: number; // persons number who is rating my product
}
const defaultProdact: Required<Product> = {
  id: '',
  title: '',
  slug: '',
  description: '',
  quantity: 0,
  sold: 0, //sell operations of each product.
  price: 0,
  priceAfterDiscount: 0,
  colors: [],
  imgColors: [],
  images: [],
  category: '', //id category <Foriegn Key>
  subCategory :[], //id subcategories   
  brand: '', //id prand    <Foriegn Key>
  ratingsAverage: 0, // min =1 , max =5
  ratingsQuantity: 0,
};
export const getDefaultProduct = () => {
  return objectify(defaultProdact);
};
