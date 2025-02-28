// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ProposalsBotExecuteGenericNervousSystemFunction } from "./ProposalsBotExecuteGenericNervousSystemFunction";
import type { ProposalsBotMintSnsTokens } from "./ProposalsBotMintSnsTokens";
import type { ProposalsBotTransferSnsTreasuryFunds } from "./ProposalsBotTransferSnsTreasuryFunds";
import type { ProposalsBotUpgradeSnsControlledCanister } from "./ProposalsBotUpgradeSnsControlledCanister";

export type ProposalsBotProposalToSubmitAction = "Motion" | { "TransferSnsTreasuryFunds": ProposalsBotTransferSnsTreasuryFunds } | { "MintSnsTokens": ProposalsBotMintSnsTokens } | "UpgradeSnsToNextVersion" | "AdvanceSnsTargetVersion" | { "UpgradeSnsControlledCanister": ProposalsBotUpgradeSnsControlledCanister } | { "ExecuteGenericNervousSystemFunction": ProposalsBotExecuteGenericNervousSystemFunction };
