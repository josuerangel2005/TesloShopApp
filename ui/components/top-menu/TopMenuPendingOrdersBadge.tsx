"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { getHandlePendingNumberOrdersFactory } from "../../../modules/shared/ui-state/infrastructure/config/factory/handle-pending-number-orders-factory";
import { TopMenuPendingOrdersCount } from "./TopMenuPendingOrdersCount";

export const TopMenuPendingOrdersBadge = ({
  pendingOrders,
}: {
  pendingOrders: number;
}) => {
  const [handlePendingNumberOrdes] = useState(() =>
    getHandlePendingNumberOrdersFactory(),
  );

  useEffect(() => {
    handlePendingNumberOrdes.setPendingOrders(pendingOrders);
  }, [handlePendingNumberOrdes, pendingOrders]);

  const pendingOrdersCount = useSyncExternalStore(
    (listener) => handlePendingNumberOrdes.subscribe(listener),
    () => handlePendingNumberOrdes.getTotalPendigOrders(),
    () => 0,
  );

  return pendingOrdersCount > 0 ? (
    <TopMenuPendingOrdersCount pendingOrdersCount={pendingOrdersCount ?? 0} />
  ) : null;
};
