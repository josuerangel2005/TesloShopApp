import { OrderAddress as DomainOrderAddress } from "../../../../modules/orders/domain/model/order-address";
import { OrderAddress } from "../interfaces/order-address";

export const orderAddressToOrderAddress = (
  orderAddress: DomainOrderAddress,
): OrderAddress => ({
  id: orderAddress.getId(),
  firstName: orderAddress.getFirstName(),
  lastName: orderAddress.getLastName(),
  address: orderAddress.getAddress(),
  address2: orderAddress.getAddress2(),
  postalCode: orderAddress.getPostalCode(),
  city: orderAddress.getCity(),
  phone: orderAddress.getPhone(),
  countryId: orderAddress.getCountryId(),
  orderId: orderAddress.getOrderId(),
});
