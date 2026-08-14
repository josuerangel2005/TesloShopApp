import { Role } from "../../../../modules/auth/domain/model/role";

export interface Product {
  //TODO
  //id:string
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: string[];
  slug: string;
  tags: string[];
  title: string;
  type: string;
  gender: string;
}

export interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  image: string;
  emailVerified: Date | null;
  emailVerificationToken: string | null;
  emailVerificationExpires: Date | null;
}

export type ValidSizes = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type ValidTypes = "shirts" | "pants" | "hoodies" | "hats";
export type ValidGenders = "men" | "women" | "kid";
export const validGenders: string[] = ["men", "women", "kid"];

export interface SeedData {
  users: SeedUser[];
  products: Product[];
  categories: ValidTypes[];
}
