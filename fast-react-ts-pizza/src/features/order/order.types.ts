import type { ICartItem } from "../cart/cartSlice";

export interface IOrder {
  customer: string;
  phone: string;
  address: string;
  cart: ICartItem[];
  priority: boolean;
}
