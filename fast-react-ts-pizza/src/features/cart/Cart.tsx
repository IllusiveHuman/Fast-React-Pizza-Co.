import { useCustomDispatch, useCustomSelector } from "../../hook";

import Button from "../../ui/Button";
import LinkButton from "../../ui/LinkButton";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";

import { getUsername } from "../user/userSlice";
import { clearCart, getCart } from "./cartSlice";

function Cart() {
  const username = useCustomSelector(getUsername);
  const cart = useCustomSelector(getCart);

  const dispatch = useCustomDispatch();
  if (!cart.length) {
    return <EmptyCart />;
  }
  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Your cart, {username}</h2>

      <ul className="mt-3 divide-y divide-stone-200 border-b">
        {cart.map((item) => (
          <CartItem
            item={item}
            key={item.pizzaId}
          />
        ))}
      </ul>

      <div className="mt-6 space-x-2">
        <Button
          to="/order/new"
          typeOfElement="primary">
          Order pizzas
        </Button>

        <Button
          typeOfElement="secondary"
          onClick={() => dispatch(clearCart())}>
          Clear cart
        </Button>
      </div>
    </div>
  );
}

export default Cart;
