import { writable } from "svelte/store";
import { Database as EmojiDatabase } from "emoji-picker-element";

let emojiDb = new EmojiDatabase();
let showQuickReactionCount = 3;
let defaultReactions = ["yes", "tears_of_joy", "pray"];

function loadQuickReactions() {
    return emojiDb
        .getTopFavoriteEmoji(showQuickReactionCount)
        .then((fav) => {
            if (fav.length < showQuickReactionCount) {
                // If we have less emoji than we want to show, expand with
                // a default selection of emoji.
                return Promise.all(
                    defaultReactions.map((em) => emojiDb.getEmojiByShortcode(em)),
                )
                    .then((def) => def.filter((v) => v != null))
                    .then((def) => fav.concat(def).slice(0, showQuickReactionCount));
            }

            return fav;
        })
        .catch((e) => {
            console.log(e);
            return [];
        });
}

function initQuickReactions() {
    const { subscribe, update } = writable(loadQuickReactions());

    return {
        subscribe,

        // Increment favourites
        incrementFavourite: (unicode: string): void => {
            emojiDb.incrementFavoriteEmojiCount(unicode);
        },

        // Reload favourite reactions
        reload: (): void => {
            update(_ => loadQuickReactions());
        }
    };
}

export const quickReactions = initQuickReactions();
