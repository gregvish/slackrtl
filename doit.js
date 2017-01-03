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
    if (typeof element.value != "string") {
        return false;
    }
    return null !== element.value.match(/^[\s\d"']*[א-ת]+/);
}

function should_message_be_rtl(element)
{
    if (typeof element.innerText != "string") {
        return false;
    }
    return null !== element.innerText.match(/\n[\s\d"']*[א-ת]+/);
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

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var added = mutation.addedNodes[i];
            var targets = [];

            if (added.nodeName == 'TS-MESSAGE') {
                targets = [added];
            } else if (typeof added.getElementsByTagName == "function") {
                targets = added.getElementsByTagName("TS-MESSAGE");
            }

            for (var j = 0; j < targets.length; j++) {
                var element = targets[j];
                if (should_message_be_rtl(element)) {
                    element.style.setProperty("direction", "rtl");
                    fix_all_emojis(element);
                }
            }
        }
    });
});
observer.observe(document.getElementById("msgs_div"), { childList: true, subtree: true });

document.getElementById("msg_input").addEventListener("keyup", function(event) {
    var target = event.target;
    if (should_input_be_rtl(target)) {
        target.style.setProperty("direction", "rtl");
        fix_all_emojis(target);
    } else {
        target.style.setProperty("direction", "ltr");
    }
});
