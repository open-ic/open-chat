import type { Identity } from "@dfinity/agent";
import idlFactory, { GroupIndexService } from "./candid/idl";
import type { CandidateGroupChat, CreateGroupChatResponse } from "../../domain/chat/chat";
import { CandidService } from "../candidService";
import { createResponse } from "./mappers";
import type { IGroupIndexClient } from "./groupIndex.client.interface";

export class GroupIndexClient extends CandidService implements IGroupIndexClient {
    private groupIndexService: GroupIndexService;

    constructor(identity: Identity) {
        super(identity);
        this.groupIndexService = this.createServiceClient<GroupIndexService>(
            idlFactory,
            "user_index_canister_id" // todo - where does this come from - probably an env var
        );
    }

    createGroup(candidate: CandidateGroupChat): Promise<CreateGroupChatResponse> {
        // todo - this doesn't look like it reflects what we want for v2 yet
        return this.handleResponse(
            this.groupIndexService.create({
                is_public: candidate.isPublic,
                name: candidate.name,
            }),
            createResponse
        );
    }
}
