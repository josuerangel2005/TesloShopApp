export interface OrderAddress {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  address2: string | null;
  postalCode: string;
  city: string;
  phone: string;
  countryId: string;
  orderId: string;
}