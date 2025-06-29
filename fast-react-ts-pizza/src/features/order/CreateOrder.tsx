import { useState } from "react";
import { useCustomDispatch, useCustomSelector } from "../../hook";
import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router-dom";

import Button from "../../ui/Button";
import EmptyCart from "../cart/EmptyCart";

import { createOrder } from "../../services/apiRestaurant";
import { getCart, getTotalCartPrice } from "../cart/cartSlice";
import type { IOrder } from "./order.types";
import store from "../../store";
import { clearCart } from "../cart/cartSlice";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

interface IFormErrors {
  phone?: string;
}

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);

  const dispatch = useCustomDispatch();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useCustomSelector((store) => store.user);

  const isLoadingAddress = address === "loading";
  const formErrors = useActionData() as IFormErrors | undefined;

  const cart = useCustomSelector(getCart);
  const totalCartPrice = useCustomSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            defaultValue={username}
            type="text"
            name="customer"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input
              className="input w-full"
              type="tel"
              name="phone"
              required
            />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className=" absolute right-[3px] top-[3px] z-50  md:right-[3px] md:top-[5px]">
              <Button
                disabled={isLoadingAddress || isLoadingAddress}
                typeOfElement="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}>
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority.toString()}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label
            htmlFor="priority"
            className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input
            type="hidden"
            name="cart"
            value={JSON.stringify(cart)}
          />
          <input
            type="hidden"
            name="postion"
            value={
              position.longitude && position.latitude
                ? `${position.latitude}, ${position.longitude}`
                : ""
            }
          />
          <Button
            disabled={isSubmitting}
            typeOfElement="primary">
            {isSubmitting
              ? "Placing order...."
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const raw = Object.fromEntries(formData) as Record<string, string>;

  const order: IOrder = {
    customer: raw.customer,
    phone: raw.phone,
    address: raw.address,
    cart: JSON.parse(raw.cart),
    priority: raw.priority === "true",
  };

  const errors: IFormErrors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";
    return errors;
  }

  const newOrder = await createOrder(order);

  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}
export default CreateOrder;
