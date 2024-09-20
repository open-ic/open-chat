import type { Theme } from "../types";
import { hexPercent } from "../utils";

const textBox = "rgba(226,226,226,0.4)";
const txt = "#242834";
const txt70 = hexPercent(txt, 70);
const txt50 = hexPercent(txt, 50);
const txt60 = hexPercent(txt, 60);
const txtDark = "#242834";
const white = "#ffffff";
const accent = "#e53b78";

export function getTheme(base: Theme): Theme {
    base.primary = "#459cd1";
    base.author = "2yfsq-kaaaa-aaaaf-aaa4q-cai";
    base.name = "white";
    base.label = "White";
    base.accent = accent;
    base.bg = white;
    base.burst = false;
    base.logo = false;
    base.txt = txt;
    base.code = {
        bg: "rgba(255,255,255,0.9)",
        txt: txt,
    };
    base["txt-light"] = txt70;
    base.bd = "#ededed";
    base.disabledTxt = txt50;
    base.placeholder = txt50;
    base.progress.bd = "rgba(0,0,0,0.2)";
    base.collapsible.closed.header.txt = txt70;
    base.timeline.txt = txt70;
    base.time.txt = txt60;
    base.time.icon = "rgba(0,0,0,0.3)";
    base.time.bg = "rgba(0,0,0,0.1)";
    base.time.me.txt = white;
    base.time.me.icon = white;
    base.time.me.bg = "rgba(255,255,255,0.2)";
    base.input.bg = textBox;
    base.entry.bg = "rgba(226,226,226,0.3)";
    base.entry.input.bg = white;
    base.button.bg = base.primary;
    // base.entry.input.sh = "inset 0px 2px 4px rgba(138, 138, 138, 0.5)";
    base.panel.bg = "transparent";
    base.panel.left.bg = "transparent";
    base.panel.nav.bg = white;
    base.panel.right.bg = "transparent";
    base.panel.right.modal = white;
    base.unread.mute = "#dddddd";
    base.unread["mute-solid"] = "#dddddd";
    base.unread["mute-txt"] = "#999999";
    base.chatSearch.bg = textBox;
    base.chatSummary["bg-selected"] = "rgba(226,226,226,0.5)";
    base.menu.txt = txt70;
    base.menu["disabled-txt"] = hexPercent(txtDark, 50);
    base.menu.separator = base.bd;
    base.menu.bd = "#efefef";
    base.button["disabled-txt"] = txt50;
    base.modal.filter = "blur(5px)";
    base.modal.bg = white;
    base.modal.bd = "var(--bw) solid var(--bd)";
    base.modal.sh = base.menu.sh;
    base.modalPage.bg = "rgba(255, 255, 255, 0.5)";
    base.modalPage.txt = txt;
    base.currentChat.msg.bg = "#efefef";
    base.currentChat.msg.muted = txt50;
    base.currentChat.msg.txt = txt70;
    base.currentChat.msg.inert = "rgba(226,226,226,0.8)";
    base.currentChat.msg.separator = "rgba(0,0,0,0.1)";
    base.currentChat.msg.me.bd = "#efefef";
    base.currentChat.msg.me.bg = base.primary;
    base.currentChat.date.bg = "#efefef";
    base.currentChat.date.bd = "var(--bw) solid rgba(0,0,0,0.05)";
    base.icon.txt = txt60;
    base.icon.inverted.txt = txt60;
    base.icon.selected = base.primary;
    base.recommended.bg = white;
    base.markdown.fg.color = txt;
    base.markdown.fg.bright = txt;
    base.markdown.fg.muted = txt70;
    base.daily.header = white;
    base.daily.accent = base.accent;
    base.daily.accentText = txt;
    base.daily.background = white;
    base.daily.backgroundAccent = white;
    base.daily.border = base.bd;
    base.daily.mainAreaBg = white;
    base.daily.mainAreaBgAccent = base.accent;
    base.daily.mainAreaText = txt;
    base.daily.supportiveText = "#4e5670";
    base.vote.maybe.color = "#ddd";
    base.audio.outer = base.primary;
    base.audio.me.outer = base.accent;
    base.audio.inner = base.accent;
    base.audio.me.inner = base.input.accent;
    base.audio.note = base.currentChat.msg.txt;
    base.audio.me.note = base.currentChat.msg.me.txt;

    return base;
}
