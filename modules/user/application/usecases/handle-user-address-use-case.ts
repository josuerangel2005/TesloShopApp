import { UserAddressSaveCommand } from "../../domain/model/commands/user-address-save-command";
import { UserAddress } from "../../domain/model/user-address";
import { ForHandleUserAddress } from "../../domain/ports/driven/for-handle-user-address";

export class HandleUserAddressUseCase {
  private readonly forHandleUserAddress: ForHandleUserAddress;

  constructor(forHandleUserAddress: ForHandleUserAddress) {
    this.forHandleUserAddress = forHandleUserAddress;
  }

  public getUserAddressByUserId(userId: string): Promise<UserAddress | null> {
    return this.forHandleUserAddress.getUserAddressByUserId(userId);
  }

  public saveUserAddress(userAddress: UserAddressSaveCommand): Promise<void> {
    return this.forHandleUserAddress.saveUserAddress(userAddress);
  }

  public deleteUserAddressByUserId(userId: string): Promise<void> {
    return this.forHandleUserAddress.deleteUserAddressByUserId(userId);
  }
}
