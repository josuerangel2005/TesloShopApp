import { Product } from "../../model/product";

export interface ForHandleProducts {
  findAll: () => Promise<Product>;
}
