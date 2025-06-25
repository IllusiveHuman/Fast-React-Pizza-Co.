import { useFetcher, type ActionFunctionArgs } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";
import type { IOrder } from "./Order";

function UpdateOrder({ order }: { order: IOrder }) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form
      method="PATCH"
      className="text-right">
      <Button typeOfElement="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({ request, params }: ActionFunctionArgs) {
  const data = { priority: true };
  if (!params.orderId) {
    throw new Error("Order ID is required");
  }
  await updateOrder(params.orderId, data);
  return null;
}
