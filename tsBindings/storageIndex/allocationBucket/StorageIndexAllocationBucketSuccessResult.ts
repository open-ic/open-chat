// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { StorageIndexProjectedAllowance } from "../StorageIndexProjectedAllowance";
import type { TSPrincipal } from "../../shared/TSPrincipal";

export type StorageIndexAllocationBucketSuccessResult = { canister_id: TSPrincipal, file_id: bigint, chunk_size: number, byte_limit: bigint, bytes_used: bigint, bytes_used_after_upload: bigint, projected_allowance: StorageIndexProjectedAllowance, };
