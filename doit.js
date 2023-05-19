// ==UserScript==
// @name         Slack RTL (Hebrew)
// @namespace    http://slackrtl
// @version      0.2
// @description  Support Hebrew on slack.com
// @author       gregvish
// @match        https://app.slack.com/client/*
// ==/UserScript==
'use strict';

function should_input_be_rtl(element)
{
    if (typeof element.innerText != "string") {
        return false;
    }
    return null !== element.innerText.match(/^[\s\d"']*[א-ת]+/);
}

function should_message_be_rtl(element)
{
    if (typeof element.innerText != "string") {
        return false;
    }
    return null !== element.innerText.match(/^[\s\d"']*[א-ת]+/);
}

function do_messages_modification()
{
    var i;
    var target;
    var elems = document.getElementsByClassName("p-rich_text_section");

    for (i=0; i < elems.length; i++) {
        target = elems[i];

        if (should_message_be_rtl(target)) {
            target.style.setProperty("direction", "rtl");
            target.style.setProperty("text-align", "right");
        }
    }
}

function editor_onkeyup(event)
{
    var target = event.target;

    if (should_input_be_rtl(target)) {
        target.style.setProperty("direction", "rtl");
        target.style.setProperty("text-align", "right");

    } else {
        target.style.setProperty("direction", "ltr");
        target.style.setProperty("text-align", "left");
    }
}

function setup_editor_modification()
{
    var i;
    var elems = document.getElementsByClassName("ql-editor")

    for (i=0; i < elems.length; i++) {
        elems[i].onkeyup = editor_onkeyup;
    }
}

var observer = new MutationObserver(function(mutations) {
    do_messages_modification();
    setup_editor_modification();
});

window.setTimeout(
    function() {
        observer.observe(document.body, {childList: true, subtree: true});
    },
    1000
);

