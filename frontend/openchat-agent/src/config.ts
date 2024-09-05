import { AuthProvider, type GroupInvite } from "openchat-shared";
import type { Logger } from "openchat-shared";

export type AgentConfig = {
    authPrincipal: string;
    authProvider: AuthProvider | undefined;
    icUrl: string;
    iiDerivationOrigin?: string;
    openStorageIndexCanister: string;
    groupIndexCanister: string;
    notificationsCanister: string;
    onlineCanister: string;
    userIndexCanister: string;
    translationsCanister: string;
    registryCanister: string;
    identityCanister: string;
    internetIdentityUrl: string;
    nfidUrl: string;
    userGeekApiKey: string;
    enableMultiCrypto?: boolean;
    blobUrlPattern: string;
    proposalBotCanister: string;
    marketMakerCanister: string;
    signInWithEmailCanister: string;
    signInWithEthereumCanister: string;
    signInWithSolanaCanister: string;
    groupInvite?: GroupInvite;
    logger: Logger;
};
