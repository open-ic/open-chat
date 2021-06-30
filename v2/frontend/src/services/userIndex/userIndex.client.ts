import type { Identity } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import idlFactory, { UserIndexService } from "api-canisters/user_index/canister";
import type {
    ConfirmPhoneNumberResponse,
    GetCurrentUserResponse,
    RegisterPhoneNumberResponse,
    UpdateUsernameResponse,
} from "../../domain/user";
import { CandidService } from "../candidService";
import {
    updateUsernameResponse,
    getCurrentUserResponse,
    registerPhoneNumberResponse,
    confirmPhoneNumber,
} from "./mappers";
import type { IUserIndexClient } from "./userIndex.client.interface";

export class UserIndexClient extends CandidService implements IUserIndexClient {
    private userService: UserIndexService;

    constructor(identity: Identity) {
        super(identity);
        this.userService = this.createServiceClient<UserIndexService>(
            idlFactory,
            "user_index_canister_id" // todo - where does this come from
        );
    }

    getCurrentUser(): Promise<GetCurrentUserResponse> {
        return this.handleResponse(
            this.userService.get_current_user({
                user_id: [],
                username: [],
            }),
            getCurrentUserResponse
        );
    }

    updateUsername(userPrincipal: Principal, username: string): Promise<UpdateUsernameResponse> {
        return this.handleResponse(
            this.userService.update_username({
                user_principal: userPrincipal,
                username: username,
            }),
            updateUsernameResponse
        );
    }

    registerPhoneNumber(
        countryCode: number,
        phoneNumber: number
    ): Promise<RegisterPhoneNumberResponse> {
        return this.handleResponse(
            this.userService.register_phone_number({
                number: {
                    country_code: countryCode,
                    number: BigInt(phoneNumber),
                },
            }),
            registerPhoneNumberResponse
        );
    }

    confirmPhoneNumber(code: string): Promise<ConfirmPhoneNumberResponse> {
        return this.handleResponse(
            this.userService.confirm_phone_number({
                confirmation_code: code,
            }),
            confirmPhoneNumber
        );
    }
}
