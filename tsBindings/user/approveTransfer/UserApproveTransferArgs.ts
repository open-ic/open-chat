// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AccountICRC1 } from "../../shared/AccountICRC1";
import type { PinNumberWrapper } from "../../shared/PinNumberWrapper";
import type { TSBytes } from "../../shared/TSBytes";

export type UserApproveTransferArgs = { spender: AccountICRC1, ledger_canister_id: TSBytes, amount: bigint, expires_in?: bigint | undefined, pin?: PinNumberWrapper | undefined, };
