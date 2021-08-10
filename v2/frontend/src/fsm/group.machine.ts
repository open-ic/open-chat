// creating a new group is complicated enough to have its own state machine
// The states are going to look something like:
// - group_form
// - editing_avatar
// - choosing_participants
// The other reason to have a dedicated machine is that we need to "remember" the state of the
// candidate group, while the user is selecting participants.
// We also need to track whether canister creation is complete etc. It can get quite fiddly probably.

// this is a job for tomorrow

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createMachine, MachineConfig, MachineOptions, assign, DoneInvokeEvent } from "xstate";
import { userSearchMachine } from "./userSearch.machine";
import type { UserSummary } from "../domain/user/user";
import type { ServiceContainer } from "../services/serviceContainer";
import type { CandidateGroupChat } from "../domain/chat/chat";
import { sendParent } from "xstate/lib/actions";

export interface GroupContext {
    serviceContainer: ServiceContainer;
    candidateGroup: CandidateGroupChat;
    error?: Error;
}

export const nullGroup = {
    name: "",
    description: "",
    historyVisible: false,
    isPublic: false,
    participants: [],
};

export type GroupEvents =
    | { type: "CANCEL_NEW_GROUP" }
    | { type: "COMPLETE" }
    | { type: "CHOOSE_PARTICIPANTS"; data: CandidateGroupChat }
    | { type: "CANCEL_CHOOSE_PARTICIPANTS" }
    | { type: "SKIP_CHOOSE_PARTICIPANTS" }
    | { type: "REMOVE_PARTICIPANT"; data: string }
    | { type: "done.invoke.userSearchMachine"; data: UserSummary }
    | { type: "error.platform.userSearchMachine"; data: Error }
    | { type: "done.invoke.createGroup"; data: string }
    | { type: "error.platform.createGroup"; data: Error };

const liveConfig: Partial<MachineOptions<GroupContext, GroupEvents>> = {
    services: {
        createGroup: (ctx, _) => {
            return ctx.serviceContainer.createGroupChat(ctx.candidateGroup);
        },
    },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const schema: MachineConfig<GroupContext, any, GroupEvents> = {
    id: "group_machine",
    type: "parallel",
    states: {
        canister_creation: {
            initial: "idle",
            states: {
                creating: {
                    // todo - for now simulate the creation of the canister
                    after: {
                        5000: "created",
                    },
                },
                created: {
                    type: "final",
                    // todo - we *probably* want to do something slightly different if the user
                    // updates a group after we have already created it
                    on: {
                        CHOOSE_PARTICIPANTS: {
                            target: "creating",
                            actions: assign((_, ev) => ({
                                candidateGroup: ev.data,
                            })),
                        },
                    },
                },
                idle: {
                    // kick off the creation of the group canister
                    on: {
                        CHOOSE_PARTICIPANTS: {
                            target: "creating",
                            actions: assign((_, ev) => ({
                                candidateGroup: ev.data,
                            })),
                        },
                    },
                },
            },
        },
        data_collection: {
            initial: "group_form",
            states: {
                done: { type: "final" },
                group_form: {
                    on: {
                        CANCEL_NEW_GROUP: "done",
                        CHOOSE_PARTICIPANTS: {
                            target: "choosing_participants",
                            actions: assign((_, ev) => ({
                                candidateGroup: ev.data,
                            })),
                        },
                    },
                },
                adding_participants: {
                    invoke: {
                        id: "createGroup",
                        src: "createGroup",
                        onDone: {
                            target: "done",
                            actions: sendParent((ctx, ev: DoneInvokeEvent<string>) => {
                                const now = BigInt(+new Date());
                                return {
                                    type: "GROUP_CHAT_CREATED",
                                    data: {
                                        kind: "group_chat",
                                        name: ctx.candidateGroup.name,
                                        description: ctx.candidateGroup.description,
                                        participants: ctx.candidateGroup.participants.map((p) => ({
                                            role: p.role,
                                            userId: p.user.userId,
                                        })),
                                        public: ctx.candidateGroup.isPublic,
                                        joined: now,
                                        minVisibleMessageIndex: 0,
                                        chatId: ev.data,
                                        latestReadByMe: 0,
                                        latestMessage: undefined,
                                        latestEventIndex: 0,
                                        lastUpdated: now,
                                    },
                                };
                            }),
                        },
                        onError: {
                            target: "unexpected_error",
                            actions: assign({
                                error: (_, { data }) => data,
                            }),
                        },
                    },
                },
                choosing_participants: {
                    on: {
                        CANCEL_CHOOSE_PARTICIPANTS: "group_form",
                        REMOVE_PARTICIPANT: {
                            actions: assign((ctx, ev) => ({
                                candidateGroup: {
                                    ...ctx.candidateGroup,
                                    participants: ctx.candidateGroup.participants.filter(
                                        (p) => p.user.userId !== ev.data
                                    ),
                                },
                            })),
                        },
                        "error.platform.userSearchMachine": "..unexpected_error",
                        COMPLETE: {
                            target: "adding_participants",
                        },
                    },
                    invoke: {
                        id: "userSearchMachine",
                        src: userSearchMachine,
                        data: (ctx, _) => {
                            return {
                                serviceContainer: ctx.serviceContainer,
                                searchTerm: "",
                                users: [],
                                error: undefined,
                            };
                        },
                        onDone: {
                            target: "choosing_participants",
                            actions: assign((ctx, ev: DoneInvokeEvent<UserSummary>) => {
                                return {
                                    candidateGroup: {
                                        ...ctx.candidateGroup,
                                        participants: [
                                            ...ctx.candidateGroup.participants,
                                            {
                                                role: "standard",
                                                user: ev.data,
                                            },
                                        ],
                                    },
                                };
                            }),
                        },
                        onError: {
                            internal: true,
                            target: "..unexpected_error",
                            actions: [
                                assign({
                                    error: (_, { data }) => data,
                                }),
                            ],
                        },
                    },
                },
                unexpected_error: {},
            },
        },
    },
};

export const groupMachine = createMachine<GroupContext, GroupEvents>(schema, liveConfig);
export type GroupMachine = typeof groupMachine;
