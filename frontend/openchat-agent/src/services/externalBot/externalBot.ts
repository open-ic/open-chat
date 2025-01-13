import { type BotCommandResponse, type BotDefinitionResponse } from "openchat-shared";
import { Value, AssertError } from "@sinclair/typebox/value";
import { Type, type Static } from "@sinclair/typebox";
import { MessageContent, SlashCommandSchema } from "../../typebox";
import { externalBotDefinition, messageContent } from "../common/chatMappersV2";
import { mapOptional } from "../../utils/mapping";

type ApiBotDefinition = Static<typeof ApiBotDefinition>;
const ApiBotDefinition = Type.Object({
    description: Type.String(),
    commands: Type.Array(SlashCommandSchema),
});

const ApiBotSuccess = Type.Object({
    message: Type.Optional(
        Type.Object({
            id: Type.String(),
            content: MessageContent,
            finalised: Type.Optional(Type.Boolean()),
        }),
    ),
});
type ApiBotSuccess = Static<typeof ApiBotSuccess>;

const ApiBotBadRequest = Type.Union([
    Type.Literal("AccessTokenNotFound"),
    Type.Literal("AccessTokenInvalid"),
    Type.Literal("AccessTokenExpired"),
    Type.Literal("CommandNotFound"),
    Type.Literal("ArgsInvalid"),
]);
type ApiBotBadRequest = Static<typeof ApiBotBadRequest>;

const ApiBotInternalError = Type.Any();
type ApiBotInternalError = Static<typeof ApiBotInternalError>;

const ApiBotResponse = Type.Union([
    Type.Object({
        Success: ApiBotSuccess,
    }),
    Type.Object({
        BadRequest: ApiBotBadRequest,
    }),
    Type.Object({
        InternalError: ApiBotInternalError,
    }),
]);
type ApiBotResponse = Static<typeof ApiBotResponse>;

export function getBotDefinition(endpoint: string): Promise<BotDefinitionResponse> {
    return fetch(`${endpoint}`)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                const msg = `Failed to load external bot schema: ${res.status}, ${
                    res.statusText
                }, ${JSON.stringify(endpoint)}`;
                return {
                    kind: "bot_definition_failure",
                    error: msg,
                };
            }
        })
        .then(validateSchema);
}

function validateSchema(json: unknown): BotDefinitionResponse {
    try {
        const value = Value.Parse(ApiBotDefinition, json);
        return externalBotDefinition(value);
    } catch (err) {
        return {
            kind: "bot_definition_failure",
            error: formatError(err),
        };
    }
}

function formatError(err: unknown) {
    if (err instanceof AssertError) {
        return `${err.message}: ${err.error?.path}`;
    }
    return err;
}

function validateBotResponse(json: unknown): BotCommandResponse {
    try {
        console.log("Bot command response json", json);
        const value = Value.Parse(ApiBotResponse, json);
        return externalBotResponse(value);
    } catch (err) {
        return {
            kind: "internal_error",
            error: formatError(err),
        };
    }
}

function externalBotResponse(value: ApiBotResponse): BotCommandResponse {
    if ("Success" in value) {
        return {
            kind: "success",
            message: mapOptional(value.Success.message, ({ id, content, finalised }) => {
                return {
                    messageId: BigInt(id),
                    messageContent: messageContent(content, ""),
                    finalised: finalised ?? false,
                };
            }),
        };
    } else if ("BadRequest" in value) {
        return {
            kind: "bad_request",
            reason: value.BadRequest,
        };
    } else if ("InternalError" in value) {
        return {
            kind: "internal_error",
            error: value.InternalError,
        };
    }
    return {
        kind: "internal_error",
        error: "unknown",
    };
}

export function callBotCommandEndpoint(
    endpoint: string,
    token: string,
): Promise<BotCommandResponse> {
    const headers = new Headers();
    headers.append("Content-type", "text/plain");
    return fetch(`${endpoint}/execute_command`, {
        method: "POST",
        headers: headers,
        body: token,
    })
        .then(async (res) => {
            if (res.ok) {
                return { Success: await res.json() };
            } else if (res.status === 400) {
                return { BadRequest: await res.text() };
            } else {
                return { InternalError: await res.text() };
            }
        })
        .then(validateBotResponse)
        .catch((err) => {
            console.log("Bot command failed: ", err);
            return { kind: "internal_error", error: err };
        });
}
