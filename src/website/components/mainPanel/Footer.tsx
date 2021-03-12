import React, { useEffect, useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import SendButtonIcon from "@material-ui/icons/Send";
import makeStyles from "@material-ui/styles/makeStyles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { Option } from "../../domain/model/common";
import * as chatFunctions from "../../domain/model/chats";
import sendMessage from "../../actions/chats/sendMessage";
import { getSelectedChat, getUserSummary } from "../../domain/stateFunctions";
import AttachFile from "../AttachFile";
import { RootState } from "../../reducers";
import SendCycles, { ISendCyclesRef } from "../SendCycles";
import MessageTextInput, { IMessageTextInputRef } from "../MessageTextInput";
import CurrentUserTypingHandler from "../../domain/CurrentUserTypingHandler";
import Smiley from "../../assets/icons/smiley.svg";
import Dollar from "../../assets/icons/dollar.svg";
import EmojiPicker from "../EmojiPicker"
import CloseButton from "../CloseButton";
import DraftMediaMessage from "../DraftMediaMessage";
import DraftFileMessage from "../DraftFileMessage";
import { DraftMessageContent } from "../../domain/model/messages";

export default React.memo(Footer);

const useStyles = makeStyles((theme: Theme) => ({
    footer: {
        display: "flex",
        backgroundColor: theme.colors.footer.backgroundColor,
        flexDirection: "column"
    },
    container: {
        color: "#9b9b9b",
        padding: "11px 16px 11px 10px",
        display: "flex",
        alignItems: "center",
    },
    buttons: {
        display: "flex",
        alignItems: "center"
    },
    button: {
        borderRadius: "50%",
        height: 32,
        width: 32,
        padding: 0,
        marginRight: 6,
        cursor: "pointer",
        "&:hover,:focus": {
            backgroundColor: theme.colors.icon.hover
        },
        "& svg": {
            verticalAlign: "middle",
            pointerEvents: "none",
            margin: 0,
            padding: 0,
            color: theme.colors.footer.iconColor
        }
    },
    sendButton: {
        outline: 0,
        height: 25,
        border: 0,
        margin: 0,
        padding: 0,
        cursor: "pointer",
        alignSelf: "center",
        backgroundColor: "transparent",
        marginLeft: 20,
        color: "#9b9b9b"
    }
}));

enum MessagePanelState {
    Closed,
    EmojiPicker,
    SendCycles,
    SendFile
}

function Footer() {
    const dispatch = useDispatch();
    const [messagePanelState, setMessagePanel] = useState(MessagePanelState.Closed);
    const [textBoxText, setTextBoxText] = useState("");
    const sendCyclesRef = useRef<ISendCyclesRef>(null);
    const textBoxRef = useRef<IMessageTextInputRef>(null);
    const chat = useSelector((state: RootState) => getSelectedChat(state.chatsState));
    // Hold draft (media) message
    const draftMessageContentRef = useRef<Option<DraftMessageContent>>(null);

    const them = useSelector((state: RootState) => chat != null && chatFunctions.isDirectChat(chat) 
        ? getUserSummary(chat.them, state.usersState.userDictionary)
        : null);

    if (chat === null) {
        return <div></div>;
    }

    useEffect(() => {
        if (messagePanelState !== MessagePanelState.Closed) {
            changeMessagePanel(MessagePanelState.Closed)
        }
    }, [chat.chatId]);

    function changeMessagePanel(state: MessagePanelState) {
        if (state !== MessagePanelState.SendFile && draftMessageContentRef.current) {
            if (draftMessageContentRef.current.kind === "media") {
                const blobUrl = draftMessageContentRef.current.blobUrl;
                setTimeout(() => {
                    URL.revokeObjectURL(blobUrl);
                }, 100);
            }

            draftMessageContentRef.current = null;
        }

        if (state === MessagePanelState.Closed) {
            textBoxRef.current!.onFocusBack();
        }

        setMessagePanel(state);
    }

    function onSendMessage() {
        let draftMessage: Option<DraftMessageContent> = null;

        switch (messagePanelState) {
            case MessagePanelState.SendCycles:
                if (sendCyclesRef.current) {
                    draftMessage = {
                        kind: "cycles",
                        amount: sendCyclesRef.current.getCycles(),
                        caption: textBoxText
                    };
                }
                break;
            case MessagePanelState.SendFile:
                if (draftMessageContentRef.current && 
                    (draftMessageContentRef.current.kind === "media" || draftMessageContentRef.current.kind === "file")) {
                    draftMessage = { ...draftMessageContentRef.current, caption: textBoxText };
                }
                break;
            default:
                if (textBoxText) {
                    draftMessage = { kind: "text", text: textBoxText };
                }
                break;
        }    

        if (draftMessage) {
            dispatch(sendMessage(chat!, draftMessage, null));
            changeMessagePanel(MessagePanelState.Closed);
            textBoxRef.current!.clearText();
        }
    }

    function onFileAttached(content: DraftMessageContent) {
        if (content.kind === "file") {
            dispatch(sendMessage(chat!, content, null));
            textBoxRef.current!.clearText();    
        } else {
            draftMessageContentRef.current = content;
            changeMessagePanel(MessagePanelState.SendFile);
        }
    }

    function onTextChanged(text: string) {
        setTextBoxText(text);

        if (chat && chatFunctions.isConfirmedChat(chat)) {
            CurrentUserTypingHandler.markTyping(chat.chatId);
        }
    }

    const classes = useStyles();

    let messagePanel = null;

    switch (messagePanelState) {
        case MessagePanelState.EmojiPicker:
            messagePanel = <EmojiPicker onEmojiSelected={textBoxRef.current!.insertEmoji} />;
            break;
        case MessagePanelState.SendCycles:
            if (chatFunctions.isDirectChat(chat)) {
                messagePanel = <SendCycles ref={sendCyclesRef} recipient={them!} />
            }
            break;
        case MessagePanelState.SendFile:
            if (draftMessageContentRef.current) {
                if (draftMessageContentRef.current.kind === "media") {
                    const draft = draftMessageContentRef.current;
                    messagePanel = <DraftMediaMessage
                        blobUrl={draft.blobUrl}
                        width={draft.width}
                        height={draft.height}
                        mimeType={draft.mimeType} />;
                } else if (draftMessageContentRef.current.kind === "file") {
                    const draft = draftMessageContentRef.current;
                    messagePanel = <DraftFileMessage
                        name={draft.name}
                        size={draft.data.length}
                        mimeType={draft.mimeType} />;
                }
            }
            break;
    }

    const closeButton = <CloseButton
        onClick={() => changeMessagePanel(MessagePanelState.Closed)}
        className={classes.button} />;

    return (
        <ClickAwayListener onClickAway={() => textBoxRef.current?.onFocusAway()}>
            <footer className={classes.footer}>
                {messagePanel}
                <div className={classes.container}>
                    <div className={classes.buttons}>
                        {messagePanelState !== MessagePanelState.EmojiPicker ?
                        <IconButton
                            onClick={_ => changeMessagePanel(MessagePanelState.EmojiPicker)}
                            className={classes.button}>
                            <Smiley />
                        </IconButton> : closeButton}
                        {(messagePanelState != MessagePanelState.SendFile) ?
                        <AttachFile
                            onFileSelected={onFileAttached}
                            className={classes.button} /> : closeButton}
                        {them && messagePanelState !== MessagePanelState.SendCycles ?
                        <IconButton
                            className={classes.button}
                            onClick={_ => changeMessagePanel(MessagePanelState.SendCycles)}>
                            <Dollar />
                        </IconButton> : (them ? closeButton : null)}
                    </div>
                    <MessageTextInput 
                        ref={textBoxRef}
                        placeholder={messagePanelState === MessagePanelState.Closed || messagePanelState === MessagePanelState.EmojiPicker ? "Type a message" : "Type a caption"}
                        onEnterPressed={onSendMessage}
                        onChange={onTextChanged}
                        />
                    <button onClick={onSendMessage} className={classes.sendButton}>
                        <SendButtonIcon />
                    </button>
                </div>
            </footer>
        </ClickAwayListener>
    );
}
