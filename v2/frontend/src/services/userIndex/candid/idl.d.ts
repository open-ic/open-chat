import type { IDL } from "@dfinity/candid";
import {
    _SERVICE,
    CurrentUserResponse,
    CurrentUserArgs,
    SetUsernameArgs,
    SetUsernameResponse,
    SubmitPhoneNumberArgs,
    SubmitPhoneNumberResponse,
    ConfirmPhoneNumberArgs,
    ConfirmPhoneNumberResponse,
    PhoneNumber,
    ResendCodeResponse,
    UsersArgs,
    UsersResponse,
    UserSummary,
    PartialUserSummary,
    SearchArgs,
    SearchResponse,
    UpgradeCanisterResponse,
    CreateCanisterResponse,
    RegistrationState,
    UnconfirmedPhoneNumberState,
    CyclesFeeState,
    GenerateRegistrationFeeResponse,
    UnconfirmedUserState,
    ConfirmationState,
    RegistrationFee,
    NotifyRegistrationFeePaidResponse,
    RegisterUserResponse,
} from "./types";
export {
    _SERVICE as UserIndexService,
    CurrentUserResponse as ApiCurrentUserResponse,
    CurrentUserArgs as ApiCurrentUserArgs,
    SetUsernameArgs as ApiSetUsernameArgs,
    SetUsernameResponse as ApiSetUsernameResponse,
    SubmitPhoneNumberArgs as ApiSubmitPhoneNumberArgs,
    SubmitPhoneNumberResponse as ApiSubmitPhoneNumberResponse,
    ConfirmPhoneNumberArgs as ApiConfirmPhoneNumberArgs,
    ConfirmPhoneNumberResponse as ApiConfirmPhoneNumberResponse,
    PhoneNumber as ApiPhoneNumber,
    ResendCodeResponse as ApiResendCodeResponse,
    UsersArgs as ApiUsersArgs,
    UsersResponse as ApiUsersResponse,
    UserSummary as ApiUserSummary,
    PartialUserSummary as ApiPartialUserSummary,
    SearchArgs as ApiSearchArgs,
    SearchResponse as ApiSearchResponse,
    UpgradeCanisterResponse as ApiUpgradeCanisterResponse,
    CreateCanisterResponse as ApiCreateCanisterResponse,
    RegistrationState as ApiRegistrationState,
    UnconfirmedPhoneNumberState as ApiUnconfirmedPhoneNumberState,
    CyclesFeeState as ApiCyclesFeeState,
    GenerateRegistrationFeeResponse as ApiGenerateRegistrationFeeResponse,
    UnconfirmedUserState as ApiUnconfirmedUserState,
    ConfirmationState as ApiConfirmationState,
    RegistrationFee as ApiRegistrationFee,
    NotifyRegistrationFeePaidResponse as ApiNotificationFeePaidResponse,
    RegisterUserResponse as ApiRegisterUserResponse,
};

export const idlFactory: IDL.InterfaceFactory;
