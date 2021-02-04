import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Option } from "../model/common";
import * as chatFunctions from "../model/chats";
import sendMessage from "../actions/chats/sendMessage";
import { startedLocally as typingMessageStarted, stoppedLocally as typingMessageStopped } from "../actions/chats/typingMessage";
import { getSelectedChat } from "../utils/stateFunctions";
import SendButtonIcon from "../assets/icons/sendButton.svg";
import AttachFile from "./AttachFile";
import { RootState } from "../reducers";
import EmojiPicker from "./EmojiPicker";
import { buildEmojiSpan, containsEmoji } from "../model/messages";

export default React.memo(MainFooter);

function MainFooter() {
    const dispatch = useDispatch();
    const chat = useSelector((state: RootState) => getSelectedChat(state.chatsState));

    if (chat === null) {
        return <div></div>;
    }

    const isTextBoxEmptyRef = useRef(true);

    // After each render, set the isTextBoxEmptyRef value by checking the text box
    useEffect(() => {
        isTextBoxEmptyRef.current = isTextBoxEmpty();
    });

    useEffect(() => {
        window.addEventListener("click", onWindowClick, false);
    
        return () => window.removeEventListener("click", onWindowClick);
      }, []);    

    function handleBeforeInput(e: any) {
        // Markup the text so it will appear correctly in the textbox
        const text = markupNewTextForTextBox(e.data);

        // If the text hasn't been marked-up then go ahead with the text input event
        if (text == e.data)
            return;

        // Otherwise cancel it and manually insert the mark-up 
        e.preventDefault();
        document.execCommand("insertHTML", false, text);
    }

    function handleInput(e: any) {
        if (e.target.innerHTML.trim() =="<br>") {
            e.target.innerHTML = "";
        }

        const isTextBoxEmptyLatest = isTextBoxEmpty();

        if (chat && chatFunctions.isConfirmedChat(chat)) {
            if (isTextBoxEmptyLatest != isTextBoxEmptyRef.current) {
                if (isTextBoxEmptyLatest) {
                    dispatch(typingMessageStopped(chat.chatId));
                } else {
                    dispatch(typingMessageStarted(chat.chatId));
                }
            }
        }
        isTextBoxEmptyRef.current = isTextBoxEmptyLatest;
    }

    function handleSendMessage() {
        const textbox = document.getElementById("textbox")!;
        const text = textbox.textContent;

        if (text) {
            dispatch(sendMessage(chat!, { kind: "text", text: text }));
        }

        textbox.innerHTML = "";
        textbox.focus();
        isTextBoxEmptyRef.current = true;
    }

    function handleKeyPress(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSendMessage();
            e.preventDefault();
        }
    }

    // The saved textbox range selection - used to restore the selection when inserting emojis
    // from the picker
    let savedRange: Option<Range>;

    function insertEmojiAtCaret(text: string) {
        // Focus on the message box and re-apply any saved range selection
        restoreSelection();

        // Markup the text so it will appear correctly in the textbox and manually insert it
        document.execCommand("insertHTML", false, buildEmojiSpan(text));

        // Save the new selection range
        saveSelection();
    }

    function saveSelection() {
        // Save the textbox range selection so it can be restored when the textbox next gets focus
        savedRange = window.getSelection()?.getRangeAt(0) ?? null;
    }

    function onWindowClick(e: MouseEvent) {
        // Clear the textbox range selection if the user clicks outside of the main footer or its 
        // descendants - the emoji picker is a descandant of the main footer so clicking on it does 
        // not clear the textbox selection
        if (!(e.target instanceof Element) || !e.target.matches(".enter-message, .enter-message *")) {
            clearSelection();
        } 
    }

    function restoreSelection() {
        // Set the focus on to the textbox
        const textBox = document.getElementById("textbox")!;
        textBox.focus();

        // Set the window selection to the last saved range. If there is no existing 
        // saved range then initialise one at the end of the text box.
        if (!savedRange) {
            savedRange = new Range();
            savedRange.selectNodeContents(textBox);
            savedRange.collapse(false);
        }

        const selection = window.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(savedRange);
    }

    function clearSelection() {
        savedRange = null;
    }

    function pastePlainText(e: React.ClipboardEvent<HTMLDivElement>) {
        // Cancel the paste event
        e.preventDefault();

        // Get plain text representation of clipboard
        var text = e.clipboardData.getData('text/plain');

        // Markup the text so it will appear correctly in the textbox
        text = markupNewTextForTextBox(text);
        
        // Manually insert marked-up text
        document.execCommand("insertHTML", false, text);
    }
    
    function markupNewTextForTextBox(text: string): string {
        // If the selection is inside an "emoji span" then ensure that any initial non-emoji characters 
        // are inside their own "plain span" to split them out
        const insideEmojiSpan = isSelectionInsideEmojiSpan();

        let foundEmoji = false;
        let textForPlainSpan = "";
        let markup = "";
        for (const c of text) {
            const isEmoji = containsEmoji(c);

            if (insideEmojiSpan && !foundEmoji && isEmoji && textForPlainSpan.length > 0) {
                markup = buildPlainSpan(textForPlainSpan);
            }

            foundEmoji = foundEmoji || isEmoji;

            if (insideEmojiSpan && !foundEmoji) {
                textForPlainSpan += c;
            } else if (isEmoji) {
                markup += buildEmojiSpan(c);
            } else {
                markup += c;
            }
        }      
        
        if (insideEmojiSpan && !foundEmoji && textForPlainSpan.length > 0) {
            markup = buildPlainSpan(textForPlainSpan);
        }

        return markup;
    }

    function isSelectionInsideEmojiSpan(): boolean {
        const range = window.getSelection()?.getRangeAt(0);
        if (!range) {
            return false;
        }

        const parent = range.commonAncestorContainer as Element;
        const grandParent = parent.parentElement as Element;

        return (parent.nodeName == "SPAN" && parent.classList.contains("emoji")) 
            || (parent.nodeName == "#text" && (grandParent.nodeName == "SPAN" && grandParent.classList.contains("emoji")));
    }

    function buildPlainSpan(text: string): string {
        return `<span>${text}</span>`;
    }

    function isTextBoxEmpty() : boolean {
        const textbox = document.getElementById("textbox");
        return (textbox?.textContent?.length ?? 0) === 0;
    }

    return (
        <footer className="enter-message">
            <div className="buttons">
                <EmojiPicker 
                    onEmojiSelected={insertEmojiAtCaret} 
                    onHidePicker={restoreSelection} />
                <AttachFile chat={chat} />
            </div>
            <div className="message-input-container">
                <div 
                    id="textbox" 
                    className="message-input" 
                    placeholder="Type a message"
                    onBeforeInput={handleBeforeInput}
                    onInput={handleInput}
                    onPaste={pastePlainText}
                    onKeyDown={handleKeyPress}
                    onBlur={saveSelection}
                    contentEditable={true} 
                    spellCheck="true"></div>
            </div>
            <button onClick={handleSendMessage} className="send">
                <SendButtonIcon />
            </button>
        </footer>
    );
}
