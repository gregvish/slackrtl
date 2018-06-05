// ==UserScript==
// @name         Slack RTL
// @namespace    http://blah
// @version      0.1
// @description  Support RTL/Hebrew in slack.com
// @author
// @match        https://*.slack.com/messages/*
// @grant        GPL
// ==/UserScript==
/* jshint -W097 */
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

function fix_all_emojis(element)
{
    var iterator = document.evaluate('//*[@class="emoji emoji-sizer"]', element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    var emoji_elemnt = iterator.iterateNext();
    while (emoji_elemnt) {
        emoji_elemnt.style.setProperty("direction", "ltr");
        emoji_elemnt = iterator.iterateNext();
    }
}

function do_mod()
{
    var targets = document.getElementsByClassName("c-message__body");

    for (var j = 0; j < targets.length; j++) {
        var element = targets[j];

        if (should_message_be_rtl(element)) {
            element.parentNode.style.setProperty("direction", "rtl");
            fix_all_emojis(element);
        }
    }
}

var observer = new MutationObserver(function(mutations) {
    do_mod();
});

window.setTimeout(function() {
    observer.observe(document.getElementsByClassName("c-virtual_list__scroll_container")[0], { childList: true, subtree: true });
    window.console.log("Observer installed");
    do_mod();
}, 3000);

document.getElementById("msg_input").addEventListener("keyup", function(event) {
    var target = event.target;
    if (should_input_be_rtl(target)) {
        target.style.setProperty("direction", "rtl");
        target.style.setProperty("text-align", "right");
        fix_all_emojis(target);
    } else {
        target.style.setProperty("direction", "ltr");
        target.style.setProperty("text-align", "left");
    }
});
