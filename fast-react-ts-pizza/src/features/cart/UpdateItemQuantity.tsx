import { useCustomDispatch } from "../../hook";

import Button from "../../ui/Button";

import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";

interface UpdateItemQuantityProps {
  pizzaId: number;
  currentQuantity: number;
}

function UpdateItemQuantity({
  pizzaId,
  currentQuantity,
}: UpdateItemQuantityProps) {
  const dispatch = useCustomDispatch();
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Button
        typeOfElement="round"
        onClick={() => dispatch(decreaseItemQuantity(pizzaId))}>
        -
      </Button>
      <span className="text-sm font-medium">{currentQuantity}</span>
      <Button
        typeOfElement="round"
        onClick={() => dispatch(increaseItemQuantity(pizzaId))}>
        +
      </Button>
    </div>
  );
}

export default UpdateItemQuantity;
