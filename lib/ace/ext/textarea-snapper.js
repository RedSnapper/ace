/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var event = require("../lib/event");
var UA = require("../lib/useragent");
var net = require("../lib/net");
var ace = require("../ace");
//var emmet = require('./emmet');

require("../theme/textmate");

module.exports = exports = ace;

/*
 * Returns the CSS property of element.
 *   1) If the CSS property is on the style object of the element, use it, OR
 *   2) Compute the CSS property
 *
 * If the property can't get computed, is 'auto' or 'intrinsic', the former
 * calculated property is used (this can happen in cases where the textarea
 * is hidden and has no dimension styles).
 */
var getCSSProperty = function(element, container, property) {
    var ret = element.style[property];

    if (!ret) {
        if (window.getComputedStyle) {
            ret = window.getComputedStyle(element, '').getPropertyValue(property);
        } else {
            ret = element.currentStyle[property];
        }
    }

    if (!ret || ret == 'auto' || ret == 'intrinsic') {
        ret = container.style[property];
    }
    return ret;
};

function applyStyles(elm, styles) {
    for (var style in styles) {
        elm.style[style] = styles[style];
    }
}

function setupContainer(element, getValue) {
    if (element.type != 'textarea') {
        throw new Error("Textarea required!");
    }

    var parentNode = element.parentNode;

    // This will hold the editor.
    var container = document.createElement('div');

    // To put Ace in the place of the textarea, we have to copy a few of the
    // textarea's style attributes to the div container.
    //
    // The problem is that the properties have to get computed (they might be
    // defined by a CSS file on the page - you can't access such rules that
    // apply to an element via elm.style). Computed properties are converted to
    // pixels although the dimension might be given as percentage. When the
    // window resizes, the dimensions defined by percentages changes, so the
    // properties have to get recomputed to get the new/true pixels.
    var resizeEvent = function() {
        var style = 'position:relative;';
        [
            'margin-top', 'margin-left', 'margin-right', 'margin-bottom'
        ].forEach(function(item) {
            style += item + ':' +
                        getCSSProperty(element, container, item) + ';';
        });

        // Calculating the width/height of the textarea is somewhat tricky. To
        // do it right, you have to include the paddings to the sides as well
        // (eg. width = width + padding-left, -right).  This works well, as
        // long as the width of the element is not set or given in pixels. In
        // this case and after the textarea is hidden, getCSSProperty(element,
        // container, 'width') will still return pixel value. If the element
        // has realtiv dimensions (e.g. width='95<percent>')
        // getCSSProperty(...) will return pixel values only as long as the
        // textarea is visible. After it is hidden getCSSProperty will return
        // the relative dimensions as they are set on the element (in the case
        // of width, 95<percent>).
        // Making the sum of pixel vaules (e.g. padding) and realtive values
        // (e.g. <percent>) is not possible. As such the padding styles are
        // ignored.

        // The complete width is the width of the textarea + the padding
        // to the left and right.
        var width = getCSSProperty(element, container, 'width') || (element.clientWidth + "px");
        var height = getCSSProperty(element, container, 'height')  || (element.clientHeight + "px");
        style += 'height:' + height + ';width:' + width + ';';

        // Set the display property to 'inline-block'.
        style += 'display:inline-block;';
        container.setAttribute('style', style);
    };
    event.addListener(window, 'resize', resizeEvent);

    // Call the resizeEvent once, so that the size of the container is
    // calculated.
    resizeEvent();

    // Insert the div container after the element.
    parentNode.insertBefore(container, element.nextSibling);

    // Override the forms onsubmit function. Set the innerHTML and value
    // of the textarea before submitting.
    while (parentNode !== document) {
        if (parentNode.tagName.toUpperCase() === 'FORM') {
            var oldSumit = parentNode.onsubmit;
            // Override the onsubmit function of the form.
            parentNode.onsubmit = function(evt) {
                element.value = getValue();
                // If there is a onsubmit function already, then call
                // it with the current context and pass the event.
                if (oldSumit) {
                    oldSumit.call(this, evt);
                }
            };
            break;
        }
        parentNode = parentNode.parentNode;
    }
    return container;
}

exports.transformTextarea = function(element, options) {
    var session;
    var container = setupContainer(element, function() {
        return session.getValue();
    });

    // Hide the element.
    element.style.display = 'none';
    container.style.background = 'white';

    //
    var editorDiv = document.createElement("div");
    applyStyles(editorDiv, {
        top: "30px",
        left: "0px",
        right: "0px",
        bottom: "0px",
        position: "absolute"
    });
    container.appendChild(editorDiv);

    var settingOpener = document.createElement("div");
    applyStyles(settingOpener, {
        position: "absolute",
        right: "0px",
        bottom: "0px",
        background: "red",
        cursor: "nw-resize",
        borderStyle: "solid",
        borderWidth: "9px 8px 10px 9px",
        width: "2px",
        borderColor: "lightblue gray gray lightblue",
        zIndex: 101
    });

    var settingDiv = document.createElement("div");
    var settingDivStyles = {
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        height: "29px",
        position: "absolute",
        zIndex: 100,
        color: "white",
        overflow: "auto",
        fontSize: "10px",
        "border-bottom-color": "#ccc"
    };

    settingDivStyles.backgroundColor = "#e8e8e8";

    applyStyles(settingDiv, settingDivStyles);

    container.appendChild(settingDiv);


    var defaults = Object.assign({},exports.defaultOptions);
    options = Object.assign(defaults,options);
    // Power up ace on the textarea:
    var editor = ace.edit(editorDiv);

    session = editor.getSession();

    session.setValue(element.value || element.innerHTML);
    editor.focus();

    // Add the settingPanel opener to the editor's div.
    container.appendChild(settingOpener);

    // Create the API.
    setupApi(editor, editorDiv, settingDiv, ace, options);

    // Create the setting's panel.
    setupSettingPanel(settingDiv, settingOpener, editor);

    var state = "";
    event.addListener(settingOpener, "mousemove", function(e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left, y = e.clientY - rect.top;
        if (x + y < (rect.width + rect.height)/2) {
            this.style.cursor = "pointer";
            state = "toggle";
        } else {
            state = "resize";
            this.style.cursor = "nw-resize";
        }
    });

    event.addListener(settingOpener, "mousedown", function(e) {
        if (state == "toggle") {
            editor.setDisplaySettings();
            return;
        }
        container.style.zIndex = 100000;
        var rect = container.getBoundingClientRect();
        var startX = rect.width  + rect.left - e.clientX;
        var startY = rect.height  + rect.top - e.clientY;
        event.capture(settingOpener, function(e) {
            container.style.width = e.clientX - rect.left + startX + "px";
            container.style.height = e.clientY - rect.top + startY + "px";
            editor.resize();
        }, function() {});
    });

    ace.config.loadModule("ace/ext/emmet", function() {
        editor.setOption('enableEmmet', editor.getOption('mode') !== "php");
    });

    return editor;
};

function setupApi(editor, editorDiv, settingDiv, ace, options) {
    var session = editor.getSession();
    var renderer = editor.renderer;

    function toBool(value) {
        return value === "true" || value == true;
    }

    editor.setDisplaySettings = function(display) {
        if (display == null)
            display = settingDiv.style.display == "none";
        if (display) {
            settingDiv.style.display = "block";
            settingDiv.hideButton.focus();
            editor.on("focus", function onFocus() {
                editor.removeListener("focus", onFocus);
                settingDiv.style.display = "none";
            });
        } else {
            editor.focus();
        }
    };

    editor.$setOption = editor.setOption;
    editor.$getOption = editor.getOption;
    editor.setOption = function(key, value) {

        switch (key) {
            case "gutter":
                renderer.setShowGutter(toBool(value));
                break;
            case "mode":
                editor.$setOption("mode", "ace/mode/" + value);
            break;
            case "theme":
                editor.$setOption("theme", "ace/theme/" + value);
            break;
            case "keybindings":
                switch (value) {
                    case "vim":
                        editor.setKeyboardHandler("ace/keyboard/vim");
                        break;
                    case "emacs":
                        editor.setKeyboardHandler("ace/keyboard/emacs");
                        break;
                    default:
                        editor.setKeyboardHandler(null);
                }
            break;

            case "wrap":
            case "fontSize":
                editor.$setOption(key, value);
                break;

            default:
                editor.$setOption(key, toBool(value));
        }
    };

    editor.getOption = function(key) {
        switch (key) {
            case "mode":
                return editor.$getOption("mode").substr("ace/mode/".length);
            break;

            case "theme":
                return editor.$getOption("theme").substr("ace/theme/".length);
            break;

            case "keybindings":
                var value = editor.getKeyboardHandler();
                switch (value && value.$id) {
                    case "ace/keyboard/vim":
                        return "vim";
                    case "ace/keyboard/emacs":
                        return "emacs";
                    default:
                        return "ace";
                }
            break;

            default:
                return editor.$getOption(key);
        }
    };

    editor.setOptions(options);
    return editor;
}

function setupSettingPanel(settingDiv, settingOpener, editor) {
    var BOOL = null;

    var desc = {
        mode:            "Mode:",
        wrap:            "Soft Wrap:",
        theme:           "Theme:",
        fontSize:        "Font Size:",
        showGutter:      "Display Gutter:",
        keybindings:     "Keyboard",
        showPrintMargin: "Show Print Margin:",
        useSoftTabs:     "Use Soft Tabs:",
        showInvisibles:  "Show Invisibles"
    };

    var optionValues = {
        mode: {
            text:       "Plain",
            builder:    "Builder",
            advanced:   "Advanced Macro",
            javascript: "JavaScript",
            xml:        "XML",
            html:       "HTML",
            css:        "CSS",
            scss:       "SCSS",
            php:        "PHP",
            json:       "json",
            svg:        "SVG",
            "apache_conf": "Apache",
            handlebars: "Handlebars"
        },
        theme: {
            builder:          "Builder",
            clouds:           "Clouds",
            clouds_midnight:  "Clouds Midnight",
            cobalt:           "Cobalt",
            crimson_editor:   "Crimson Editor",
            dawn:             "Dawn",
            gob:              "Green on Black",
            eclipse:          "Eclipse",
            idle_fingers:     "Idle Fingers",
            kr_theme:         "Kr Theme",
            merbivore:        "Merbivore",
            merbivore_soft:   "Merbivore Soft",
            mono_industrial:  "Mono Industrial",
            monokai:          "Monokai",
            pastel_on_dark:   "Pastel On Dark",
            solarized_dark:   "Solarized Dark",
            solarized_light:  "Solarized Light",
            textmate:         "Textmate",
            twilight:         "Twilight",
            vibrant_ink:      "Vibrant Ink"
        },
        showGutter: {"true": "#'s", "false": "No #'s"},
        fontSize: {
            "10px": "10px",
            "11px": "11px",
            "12px": "12px",
            "14px": "14px",
            "16px": "16px",
            "18px": "18px",
            "20px": "20px",
            "24px": "24px",
            "30px": "30px"
        },
        wrap: {
            off:    "Off",
            40:     "40",
            80:     "80",
            free:   "Free"
        },
        keybindings: {
            ace: "ace",
            vim: "vim",
            emacs: "emacs"
        },
        showPrintMargin:    BOOL,
        showInvisibles:     {"true": "Invisibles", "false": "No Invisibles"}
    };

    var table = [];
    table.push("<ul class='aceSettings' style='font-size:10px;line-height:10px;float:right;margin:0;padding-top: 7px;white-space: nowrap;padding-right:0;width:auto;list-style: none;'>");

    function renderOption(builder, option, obj, cValue) {

        if (!obj) {
            builder.push(
                "<input type='checkbox' title='", option, "' ",
                    cValue + "" == "true" ? "checked='true'" : "",
               "'></input>"
            );
            return;
        }
        var styles = "float:none;border: 1px solid #b1cde4;background-color:#F5F5F5;padding:2px;color: #464646;font-size:10px;width:auto;";
        builder.push("<select style='" + styles+"' title='" + option + "'>");
        for (var value in obj) {
            builder.push("<option value='" + value + "' ");

            if(typeof cValue === "boolean"){
                cValue = cValue.toString();
            }

            if (cValue == value) {
                builder.push(" selected ");
            }

            builder.push(">",
                obj[value],
                "</option>");
        }
        builder.push("</select>");
    }

    for (var option in exports.defaultOptions) {
        table.push("<li style='float:none;display: inline-block;width:auto;margin:0 0 0 10px;'>");
        renderOption(table, option, optionValues[option], editor.getOption(option));
        table.push("</li>");
    }
    table.push("</ul>");
    settingDiv.innerHTML = table.join("");
    settingDiv.setAttribute("class", "aceSettingCont");

    var onChange = function(e) {
        var select = e.currentTarget;
        editor.setOption(select.title, select.value);
    };
    var onClick = function(e) {
        var cb = e.currentTarget;
        editor.setOption(cb.title, cb.checked);
    };
    var selects = settingDiv.getElementsByTagName("select");
    for (var i = 0; i < selects.length; i++)
        selects[i].onchange = onChange;
    var cbs = settingDiv.getElementsByTagName("input");
    for (var i = 0; i < cbs.length; i++)
        cbs[i].onclick = onClick;

}

// Default startup options.
exports.defaultOptions = {
    mode:               "builder",
    theme:              "builder",
    wrap:               "off",
    fontSize:           "12px",
    showGutter:         "false",
    showInvisibles:     "false"
};

});
