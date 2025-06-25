import { useCustomDispatch } from "../../hook";

import Button from "../../ui/Button";
import { deleteItem } from "./cartSlice";

function DeleteItem({ pizzaId }: { pizzaId: number }) {
  const dispatch = useCustomDispatch();
  return (
    <div>
      <Button
        typeOfElement="small"
        onClick={() => dispatch(deleteItem(pizzaId))}>
        Delete
      </Button>
    </div>
  );
}

export default DeleteItem;
