export default ({ IDL }) => {
  const PhoneNumber = IDL.Record({
    'country_code' : IDL.Nat16,
    'number' : IDL.Vec(IDL.Nat8),
  });
  const CreateUserRequest = IDL.Record({
    'user_principal' : IDL.Principal,
    'phone_number' : PhoneNumber,
  });
  const CanisterId = IDL.Principal;
  const CreateUserResponse = IDL.Variant({
    'UserLimitReached' : IDL.Nat64,
    'Success' : IDL.Record({ 'canister' : CanisterId }),
    'UserExists' : IDL.Null,
  });
  const UserId = CanisterId;
  const GetCurrentUserRequest = IDL.Record({
    'username' : IDL.Opt(IDL.Text),
    'user_id' : IDL.Opt(UserId),
  });
  const GetCurrentUserResponse = IDL.Variant({
    'Success' : IDL.Record({
      'id' : UserId,
      'username' : IDL.Text,
      'version' : IDL.Nat32,
      'account_balance' : IDL.Nat,
    }),
    'UserNotFound' : IDL.Null,
  });
  const GetUserRequest = IDL.Record({
    'username' : IDL.Opt(IDL.Text),
    'user_id' : IDL.Opt(UserId),
  });
  const UserSummary = IDL.Record({
    'id' : UserId,
    'username' : IDL.Text,
    'version' : IDL.Nat32,
    'seconds_since_last_online' : IDL.Nat32,
  });
  const GetUserResponse = IDL.Variant({
    'Success' : UserSummary,
    'UserNotFound' : IDL.Null,
  });
  const Timestamp = IDL.Nat64;
  const GetUsersRequest = IDL.Record({
    'users' : IDL.Vec(UserId),
    'updated_since' : IDL.Opt(Timestamp),
  });
  const GetUsersResponse = IDL.Variant({
    'Success' : IDL.Record({
      'timestamp' : Timestamp,
      'users' : IDL.Vec(UserSummary),
    }),
  });
  const MarkAsOnlineRequest = IDL.Record({});
  const Metrics = IDL.Record({
    'user_count' : IDL.Nat64,
    'cycles_balance' : IDL.Int64,
    'caller_id' : IDL.Principal,
    'bytes_used' : IDL.Nat64,
    'timestamp' : IDL.Nat64,
    'online_user_count' : IDL.Nat64,
    'wasm_memory_used' : IDL.Nat64,
    'cycles_transferred' : IDL.Nat,
    'active_user_count' : IDL.Nat64,
  });
  const BalanceNotification = IDL.Record({ 'balance' : IDL.Nat });
  const SearchUsersRequest = IDL.Record({
    'max_results' : IDL.Nat8,
    'search_term' : IDL.Text,
  });
  const SearchUsersResponse = IDL.Variant({
    'Success' : IDL.Record({ 'users' : IDL.Vec(UserSummary) }),
  });
  const TransferCyclesRequest = IDL.Record({
    'recipient' : UserId,
    'sender' : UserId,
    'amount' : IDL.Nat,
  });
  const TransferCyclesResponse = IDL.Variant({
    'BalanceExceeded' : IDL.Null,
    'Success' : IDL.Record({ 'new_balance' : IDL.Nat }),
    'UserNotFound' : IDL.Null,
    'RecipientNotFound' : IDL.Null,
  });
  const UpdateUsernameRequest = IDL.Record({ 'username' : IDL.Text });
  const UpdateUsernameResponse = IDL.Variant({
    'SuccessNoChange' : IDL.Null,
    'UsernameTaken' : IDL.Null,
    'UsernameTooShort' : IDL.Nat16,
    'UsernameTooLong' : IDL.Nat16,
    'Success' : IDL.Null,
    'UserNotFound' : IDL.Null,
  });
  const UpgradeRequest = IDL.Record({
    'wasm' : IDL.Vec(IDL.Nat8),
    'version' : IDL.Text,
  });
  const UpgradeResponse = IDL.Variant({
    'Success' : IDL.Record({ 'canister_id' : CanisterId }),
    'Failure' : IDL.Null,
  });
  return IDL.Service({
    'create' : IDL.Func([CreateUserRequest], [CreateUserResponse], []),
    'get_current_user' : IDL.Func(
        [GetCurrentUserRequest],
        [GetCurrentUserResponse],
        ['query'],
      ),
    'get_user' : IDL.Func([GetUserRequest], [GetUserResponse], ['query']),
    'get_users' : IDL.Func([GetUsersRequest], [GetUsersResponse], ['query']),
    'mark_as_online' : IDL.Func([MarkAsOnlineRequest], [], []),
    'metrics' : IDL.Func([], [Metrics], ['query']),
    'notify_balance' : IDL.Func([BalanceNotification], [], []),
    'search_users' : IDL.Func(
        [SearchUsersRequest],
        [SearchUsersResponse],
        ['query'],
      ),
    'transfer_cycles' : IDL.Func(
        [TransferCyclesRequest],
        [TransferCyclesResponse],
        [],
      ),
    'update_username' : IDL.Func(
        [UpdateUsernameRequest],
        [UpdateUsernameResponse],
        [],
      ),
    'upgrade' : IDL.Func([UpgradeRequest], [UpgradeResponse], []),
  });
};
export const init = ({ IDL }) => { return []; };
export default ({ IDL }) => {
  const ConfirmPhoneNumberRequest = IDL.Record({
    'confirmation_code' : IDL.Text,
  });
  const CanisterId = IDL.Principal;
  const ConfirmPhoneNumberResponse = IDL.Variant({
    'NotFound' : IDL.Null,
    'AlreadyClaimed' : IDL.Null,
    'Success' : IDL.Record({ 'canister_id' : CanisterId }),
    'ConfirmationCodeExpired' : IDL.Null,
    'ConfirmationCodeIncorrect' : IDL.Null,
  });
  const PhoneNumber = IDL.Record({
    'country_code' : IDL.Nat16,
    'number' : IDL.Nat64,
  });
  const CreateUserRequest = IDL.Record({
    'user_principal' : IDL.Principal,
    'phone_number' : PhoneNumber,
  });
  const CreateUserResponse = IDL.Variant({
    'UserLimitReached' : IDL.Null,
    'Success' : IDL.Record({ 'canister' : CanisterId }),
    'UserExists' : IDL.Null,
  });
  const UserId = CanisterId;
  const GetCurrentUserRequest = IDL.Record({
    'username' : IDL.Opt(IDL.Text),
    'user_id' : IDL.Opt(UserId),
  });
  const GetCurrentUserResponse = IDL.Variant({
    'Success' : IDL.Record({
      'id' : UserId,
      'username' : IDL.Text,
      'version' : IDL.Nat32,
      'account_balance' : IDL.Nat,
    }),
    'UserNotFound' : IDL.Null,
  });
  const GetUserRequest = IDL.Record({
    'username' : IDL.Opt(IDL.Text),
    'user_id' : IDL.Opt(UserId),
  });
  const UserSummary = IDL.Record({
    'id' : UserId,
    'username' : IDL.Text,
    'version' : IDL.Nat32,
    'seconds_since_last_online' : IDL.Nat32,
  });
  const GetUserResponse = IDL.Variant({
    'Success' : UserSummary,
    'UserNotFound' : IDL.Null,
  });
  const TimestampMillis = IDL.Nat64;
  const GetUsersRequest = IDL.Record({
    'users' : IDL.Vec(UserId),
    'updated_since' : IDL.Opt(TimestampMillis),
  });
  const GetUsersResponse = IDL.Variant({
    'Success' : IDL.Record({
      'timestamp' : TimestampMillis,
      'users' : IDL.Vec(UserSummary),
    }),
  });
  const MarkAsOnlineRequest = IDL.Record({});
  const Metrics = IDL.Record({
    'user_count' : IDL.Nat64,
    'cycles_balance' : IDL.Int64,
    'caller_id' : IDL.Principal,
    'bytes_used' : IDL.Nat64,
    'timestamp' : TimestampMillis,
    'online_user_count' : IDL.Nat64,
    'wasm_memory_used' : IDL.Nat64,
    'cycles_transferred' : IDL.Nat,
    'active_user_count' : IDL.Nat64,
  });
  const BalanceNotification = IDL.Record({ 'balance' : IDL.Nat });
  const RegisterPhoneNumberRequest = IDL.Record({ 'number' : PhoneNumber });
  const Milliseconds = IDL.Nat64;
  const RegisterPhoneNumberResponse = IDL.Variant({
    'AlreadyRegistered' : IDL.Null,
    'Success' : IDL.Null,
    'AlreadyRegisteredByOther' : IDL.Null,
    'AlreadyRegisteredButUnclaimed' : IDL.Record({
      'time_until_resend_code_permitted' : IDL.Opt(Milliseconds),
    }),
    'InvalidPhoneNumber' : IDL.Null,
  });
  const ResendCodeRequest = IDL.Record({});
  const ResendCodeResponse = IDL.Variant({
    'NotFound' : IDL.Null,
    'AlreadyClaimed' : IDL.Null,
    'Success' : IDL.Null,
    'CodeNotExpiredYet' : IDL.Record({
      'time_until_resend_code_permitted' : Milliseconds,
    }),
  });
  const SearchUsersRequest = IDL.Record({
    'max_results' : IDL.Nat8,
    'search_term' : IDL.Text,
  });
  const SearchUsersResponse = IDL.Variant({
    'Success' : IDL.Record({ 'users' : IDL.Vec(UserSummary) }),
  });
  const SetUsernameRequest = IDL.Record({ 'username' : IDL.Text });
  const SetUsernameResponse = IDL.Variant({
    'SuccessNoChange' : IDL.Null,
    'UsernameTaken' : IDL.Null,
    'UsernameTooShort' : IDL.Nat16,
    'UsernameInvalid' : IDL.Null,
    'UsernameTooLong' : IDL.Nat16,
    'Success' : IDL.Null,
    'UserNotFound' : IDL.Null,
  });
  const TransferCyclesRequest = IDL.Record({
    'recipient' : UserId,
    'sender' : UserId,
    'amount' : IDL.Nat,
  });
  const TransferCyclesResponse = IDL.Variant({
    'BalanceExceeded' : IDL.Null,
    'Success' : IDL.Record({ 'new_balance' : IDL.Nat }),
    'UserNotFound' : IDL.Null,
    'RecipientNotFound' : IDL.Null,
  });
  const UpgradeRequest = IDL.Record({
    'wasm' : IDL.Vec(IDL.Nat8),
    'version' : IDL.Text,
  });
  const UpgradeResponse = IDL.Variant({
    'Success' : IDL.Record({ 'canister_id' : CanisterId }),
    'Failure' : IDL.Null,
  });
  return IDL.Service({
    'confirm_phone_number' : IDL.Func(
        [ConfirmPhoneNumberRequest],
        [ConfirmPhoneNumberResponse],
        [],
      ),
    'create' : IDL.Func([CreateUserRequest], [CreateUserResponse], []),
    'get_current_user' : IDL.Func(
        [GetCurrentUserRequest],
        [GetCurrentUserResponse],
        ['query'],
      ),
    'get_user' : IDL.Func([GetUserRequest], [GetUserResponse], ['query']),
    'get_users' : IDL.Func([GetUsersRequest], [GetUsersResponse], ['query']),
    'mark_as_online' : IDL.Func([MarkAsOnlineRequest], [], []),
    'metrics' : IDL.Func([], [Metrics], ['query']),
    'notify_balance' : IDL.Func([BalanceNotification], [], []),
    'register_phone_number' : IDL.Func(
        [RegisterPhoneNumberRequest],
        [RegisterPhoneNumberResponse],
        [],
      ),
    'resend_code' : IDL.Func([ResendCodeRequest], [ResendCodeResponse], []),
    'search_users' : IDL.Func(
        [SearchUsersRequest],
        [SearchUsersResponse],
        ['query'],
      ),
    'set_username' : IDL.Func([SetUsernameRequest], [SetUsernameResponse], []),
    'transfer_cycles' : IDL.Func(
        [TransferCyclesRequest],
        [TransferCyclesResponse],
        [],
      ),
    'upgrade' : IDL.Func([UpgradeRequest], [UpgradeResponse], []),
  });
};
export const init = ({ IDL }) => { return []; };
