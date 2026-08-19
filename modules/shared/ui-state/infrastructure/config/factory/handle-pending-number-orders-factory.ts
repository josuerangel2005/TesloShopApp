import { HandlePendingNumberOrdes } from "../../../application/usecases/handle-pending-number-orders";
import { pendingOrdersStore } from "../../adapters/out/PendingOrdersState/pending-orders-store";
import { ZustandPendingOrdersAdapter } from "../../adapters/out/PendingOrdersState/zustand-pending-orders-adapter";

const zustandPendingOrdersAdapter = new ZustandPendingOrdersAdapter(
  pendingOrdersStore,
);

export const getHandlePendingNumberOrdersFactory = () =>
  new HandlePendingNumberOrdes(zustandPendingOrdersAdapter);
