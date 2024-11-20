/**
 * Validating whether the bot's command schema is valid is not the same as validating that a command built from the schema is valid.
 * e.g. the command schema will not have
 */
// This can be expanded as necessary to include things like ChatParam (e.g. for a /goto bot)
export type SlashCommandParamType = UserParam | BooleanParam | StringParam | NumberParam;

export type CommandParam = {
    name: string;
    description?: string;
    placeholder?: string;
    required: boolean;
    errorMessage?: string;
};

export type UserParam = {
    kind: "user";
};

export type BooleanParam = {
    kind: "boolean";
};

export type StringParam = {
    kind: "string";
    minLength: number;
    maxLength: number;
    choices: SlashCommandOptionChoice<string>[];
};

export type NumberParam = {
    kind: "number";
    minValue: number;
    maxValue: number;
    choices: SlashCommandOptionChoice<number>[];
};

export type SlashCommandOptionChoice<T> = {
    kind: "option";
    name: string;
    value: T;
};

export type SlashCommandParam = CommandParam & SlashCommandParamType;

export type SlashCommandSchema = {
    name: string;
    description?: string;
    params: SlashCommandParam[];
};

export type SlashCommandInstance = {
    name: string;
    params: SlashCommandParamInstance[];
};

export type Bot = ExternalBot | InternalBot;

export type ExternalBot = {
    kind: "external_bot";
    name: string;
    icon: string;
    id: string;
    endpoint: string;
    description?: string;
    commands: SlashCommandSchema[];
};

export type InternalBot = {
    kind: "internal_bot";
    name: string;
    description?: string;
    commands: SlashCommandSchema[];
};

export type BotCommandInstance = ExternalBotCommandInstance | InternalBotCommandInstance;

export type ExternalBotCommandInstance = {
    kind: "external_bot";
    id: string;
    endpoint: string;
    command: SlashCommandInstance;
};

export type InternalBotCommandInstance = {
    kind: "internal_bot";
    command: SlashCommandInstance;
};

// Not sure about this just yet, but I feel like it's probably a thing

export type FlattenedCommand = SlashCommandSchema &
    (
        | {
              kind: "external_bot";
              botName: string;
              botIcon: string;
              botId: string;
              botEndpoint: string;
              botDescription?: string;
          }
        | {
              kind: "internal_bot";
              botName: string;
              botDescription?: string;
          }
    );

export type CommandParamInstance = {
    name: string;
};

export type UserParamInstance = {
    kind: "user";
    userId?: string;
};

export type BooleanParamInstance = {
    kind: "boolean";
    value?: boolean;
};

export type StringParamInstance = {
    kind: "string";
    value?: string;
};

export type NumberParamInstance = {
    kind: "number";
    value?: number;
};

export type SlashCommandParamTypeInstance =
    | UserParamInstance
    | BooleanParamInstance
    | StringParamInstance
    | NumberParamInstance;

export type SlashCommandParamInstance = CommandParamInstance & SlashCommandParamTypeInstance;

export function createParamInstancesFromSchema(
    params: SlashCommandParam[],
): SlashCommandParamInstance[] {
    return params.map((p) => {
        switch (p.kind) {
            case "user":
                return { kind: "user", name: p.name };
            case "boolean":
                return { kind: "boolean", name: p.name, value: false };
            case "number":
                return { kind: "number", name: p.name, value: Number.MIN_VALUE };
            case "string":
                return { kind: "string", name: p.name, value: "" };
        }
    });
}

export function paramInstanceIsValid(
    schema: SlashCommandParam,
    instance: SlashCommandParamInstance,
): boolean {
    if (schema.kind === "user" && instance.kind === "user") {
        return !schema.required || instance.userId !== undefined;
    } else if (schema.kind === "boolean" && instance.kind === "boolean") {
        return !schema.required || instance.value !== undefined;
    } else if (schema.kind === "string" && instance.kind === "string") {
        return (
            !schema.required ||
            (instance.value !== undefined &&
                instance.value.length > schema.minLength &&
                instance.value.length < schema.maxLength)
        );
    } else if (schema.kind === "number" && instance.kind === "number") {
        return (
            !schema.required ||
            (instance.value !== undefined &&
                instance.value !== Number.MIN_VALUE &&
                instance.value > schema.minValue &&
                instance.value < schema.maxValue)
        );
    }

    return false;
}
