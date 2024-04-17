import { IdentityClient } from "./identity/identity.client";
import type { Identity, SignIdentity } from "@dfinity/agent";
import { DelegationIdentity } from "@dfinity/identity";
import {
    buildDelegationIdentity,
    type CheckAuthPrincipalResponse,
    type MigrateLegacyPrincipalResponse,
    toDer,
} from "openchat-shared";

export class IdentityAgent {
    private _identityClient: IdentityClient;

    constructor(identity: Identity, identityCanister: string, icUrl: string) {
        this._identityClient = IdentityClient.create(identity, identityCanister, icUrl);
    }

    checkAuthPrincipal(): Promise<CheckAuthPrincipalResponse> {
        return this._identityClient.checkAuthPrincipal();
    }

    migrateLegacyPrincipal(): Promise<MigrateLegacyPrincipalResponse> {
        return this._identityClient.migrateLegacyPrincipal();
    }

    async createOpenChatIdentity(
        sessionKey: SignIdentity,
    ): Promise<DelegationIdentity | undefined> {
        const sessionKeyDer = toDer(sessionKey);
        const createIdentityResponse = await this._identityClient.createIdentity(sessionKeyDer);

        return createIdentityResponse.kind === "success"
            ? this.getDelegation(
                  createIdentityResponse.userKey,
                  sessionKey,
                  sessionKeyDer,
                  createIdentityResponse.expiration,
              )
            : undefined;
    }

    async getOpenChatIdentity(sessionKey: SignIdentity): Promise<DelegationIdentity | undefined> {
        const sessionKeyDer = toDer(sessionKey);
        const prepareDelegationResponse =
            await this._identityClient.prepareDelegation(sessionKeyDer);

        return prepareDelegationResponse.kind === "success"
            ? this.getDelegation(
                  prepareDelegationResponse.userKey,
                  sessionKey,
                  sessionKeyDer,
                  prepareDelegationResponse.expiration,
              )
            : undefined;
    }

    private async getDelegation(
        userKey: Uint8Array,
        sessionKey: SignIdentity,
        sessionKeyDer: Uint8Array,
        expiration: bigint,
    ): Promise<DelegationIdentity | undefined> {
        const getDelegationResponse = await this._identityClient.getDelegation(
            sessionKeyDer,
            expiration,
        );

        if (getDelegationResponse.kind !== "success") {
            return undefined;
        }

        return buildDelegationIdentity(
            userKey,
            sessionKey,
            getDelegationResponse.delegation,
            getDelegationResponse.signature,
        );
    }
}
