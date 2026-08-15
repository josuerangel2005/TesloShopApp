import { UserAddress } from "../../model/user-address";
import { UserAddressSaveCommand } from "../../model/commands/user-address-save-command";

export interface ForHandleUserAddress {
  getUserAddressByUserId(userId: string): Promise<UserAddress | null>;
  saveUserAddress(userAddress: UserAddressSaveCommand): Promise<void>;
  deleteUserAddressByUserId(userId: string): Promise<void>;
}
