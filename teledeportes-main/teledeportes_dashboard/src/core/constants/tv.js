// Remote-control (D-pad) key mapping — TSS vite/02 §"Constants live in core/constants".
//
// Smart-TV browsers are inconsistent: webOS and Tizen emit standard `key`
// values for the arrow cluster but vendor `keyCode`s for BACK, and older
// firmwares send only `keyCode`. Both are mapped so one handler covers
// desktop keyboards, Android TV, webOS, Tizen and generic HbbTV sticks.

export const DIRECTION_BY_KEY = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    Up: 'up',            // legacy IE/HbbTV names
    Down: 'down',
    Left: 'left',
    Right: 'right',
};

export const DIRECTION_BY_KEYCODE = {
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right',
};

// OK / Select on the remote.
export const ENTER_KEYS = ['Enter', 'NumpadEnter', 'Accept'];
export const ENTER_KEYCODES = [13, 32, 29443];   // 29443 = Tizen OK on some models

// BACK / RETURN. 461 = LG webOS, 10009 = Samsung Tizen, 8 = Backspace.
export const BACK_KEYS = ['Escape', 'GoBack', 'BrowserBack', 'Backspace'];
export const BACK_KEYCODES = [8, 27, 461, 10009];

// Elements that already act on Enter by themselves — synthesising a click on
// these would fire the handler twice.
export const NATIVELY_ACTIVATABLE = ['a', 'button', 'input', 'select', 'textarea'];

// Typing surfaces: the D-pad handler must stay out of the way inside them.
export const TEXT_ENTRY = ['input', 'textarea', 'select'];

// While one of these is open, BACK means "close it" (the overlay handles
// Escape itself) — never "leave the screen".
export const OVERLAY_SELECTOR = '.modal, dialog[open], [role="dialog"], [data-tv-overlay]';

// User agents that are TVs — focus navigation starts enabled on these instead
// of waiting for the first arrow press.
export const TV_UA_PATTERN = /smart-?tv|smarttv|webos|tizen|hbbtv|netcast|viera|aquos|googletv|android\s?tv|crkey|bravia|philipstv|dtv/i;
