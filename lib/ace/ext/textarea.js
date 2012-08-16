/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Kevin Dangoor (kdangoor@mozilla.com)
 *      Julian Viereck <julian.viereck@gmail.com>
 *      Harutyun Amirjanyan [harutyun@c9.io]
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var event = require("../lib/event");
var UA = require("../lib/useragent");
var net = require("../lib/net");
var ace = require("../ace");

require("ace/theme/textmate");

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
        throw "Textarea required!";
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

    //Only add the extra height once for the options
    var once=true;

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
         
         //Only add the extra height once for the options
        if(once){height = parseInt(parseInt(height)+30);}
        var once=false;
        style += 'height:' + parseInt(height) + 'px ;width:' + width + ';';


        // Set the display property to 'inline-block'.
        style += 'display:inline-block;';
        container.setAttribute('style', style);
        container.setAttribute('class', 'aceContainer');
    };
    event.addListener(window, 'resize', resizeEvent);

    // Call the resizeEvent once, so that the size of the container is
    // calculated.
    resizeEvent();

    // Insert the div container after the element.
    if (element.nextSibling) {
        parentNode.insertBefore(container, element.nextSibling);
    } else {
        parentNode.appendChild(container);
    }

    // Override the forms onsubmit function. Set the innerHTML and value
    // of the textarea before submitting.
    while (parentNode !== document) {
        if (parentNode.tagName.toUpperCase() === 'FORM') {
            var oldSumit = parentNode.onsubmit;
            // Override the onsubmit function of the form.
            parentNode.onsubmit = function(evt) {
                element.innerHTML = getValue();
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

exports.transformTextarea = function(element, loader) {
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
        border: "1px solid #ddd"
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
        top: "0px",
        left: "0px",
        right: "0px",
        bottom: "0px",
        height: "29px"
        position: "absolute",
        padding: "5px",
        zIndex: 100,
        color: "white",
        fontSize: "10px",
        border: "1px solid #ddd",
        "border-bottom-color": "#ccc"
    };
    if (!UA.isOldIE) {
        settingDivStyles.backgroundColor = "#e8e8e8";
    } else {
        settingDivStyles.backgroundColor = "#e8e8e8";
    }

    applyStyles(settingDiv, settingDivStyles);
    container.appendChild(settingDiv);

    // Power up ace on the textarea:
    var options = {};
    var options = this.options || exports.options;

    var editor = ace.edit(editorDiv);
    session = editor.getSession();

    session.setValue(element.value || element.innerHTML);
    editor.focus();

    // Add the settingPanel opener to the editor's div.
    editorDiv.appendChild(settingOpener);

    // Create the API.
    setupApi(editor, editorDiv, settingDiv, ace, options, loader);

    // Create the setting's panel.
    setupSettingPanel(settingDiv, settingOpener, editor, options, container);
    
    var state = "";
    event.addListener(settingOpener, "mousemove", function(e) {
        //var rect = this.getBoundingClientRect();
        //var x = e.clientX - rect.left, y = e.clientY - rect.top;
        // if (x + y < (rect.width + rect.height)/2) {
        //     this.style.cursor = "pointer";
        //     state = "toggle";
        // } else {
            // state = "resize";
        this.style.cursor = "nw-resize";
        // }
    });
    
    event.addListener(settingOpener, "mousedown", function(e) {
        // if (state == "toggle") {
        //     editor.setDisplaySettings();
        //     return;
        // }
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

    return editor;
};

function load(url, module, callback) {
    net.loadScript(url, function() {
        require([module], callback);
    });
}

function setupApi(editor, editorDiv, settingDiv, ace, options, loader) {
    var session = editor.getSession();
    var renderer = editor.renderer;
    loader = loader || load;

    function toBool(value) {
        return value == "true";
    }

    editor.setDisplaySettings = function(display) {
        if (display == null)
            display = settingDiv.style.display == "none";
        settingDiv.style.display = display ? "block" : "none";
    };
    
    editor.setOption = function(key, value) {
        //if (options[key] == value) return;

        switch (key) {
            case "gutter":
                renderer.setShowGutter(toBool(value));
            break;

            case "mode":
                if (value != "text") {
                    // Load the required mode file. Files get loaded only once.
                    loader("mode-" + value + ".js", "ace/mode/" + value, function() {
                        var aceMode = require("../mode/" + value).Mode;
                        session.setMode(new aceMode());
                    });
                } else {
                    session.setMode(new (require("../mode/text").Mode));
                }
            break;

            case "theme":
                if (value != "textmate") {
                    // Load the required theme file. Files get loaded only once.
                    loader("theme-" + value + ".js", "ace/theme/" + value, function() {
                        editor.setTheme("ace/theme/" + value);
                    });
                } else {
                    editor.setTheme("ace/theme/textmate");
                }
            break;

            case "fontSize":
                editorDiv.style.fontSize = value;
            break;

            case "softWrap":
                switch (value) {
                    case "off":
                        session.setUseWrapMode(false);
                        renderer.setPrintMarginColumn(80);
                    break;
                    case "40":
                        session.setUseWrapMode(true);
                        session.setWrapLimitRange(40, 40);
                        renderer.setPrintMarginColumn(40);
                    break;
                    case "80":
                        session.setUseWrapMode(true);
                        session.setWrapLimitRange(80, 80);
                        renderer.setPrintMarginColumn(80);
                    break;
                    case "free":
                        session.setUseWrapMode(true);
                        session.setWrapLimitRange(null, null);
                        renderer.setPrintMarginColumn(80);
                    break;
                }
            break;

            case "useSoftTabs":
                session.setUseSoftTabs(toBool(value));
            break;

            case "showPrintMargin":
                renderer.setShowPrintMargin(toBool(value));
            break;

            case "showInvisibles":
                editor.setShowInvisibles(toBool(value));
            break;
        }

        options[key] = value;
    };

    editor.getOption = function(key) {
        return options[key];
    };

    editor.getOptions = function() {
        return options;
    };

    for (var option in options) {
        ret.setOption(option, options[option]);
    }

    return editor;
}

function setupSettingPanel(settingDiv, settingOpener, editor, options) {
    var BOOL = {
        "true":  true,
        "false": false
    };

    var desc = {
        mode:            "Mode:",
        gutter:          "Display Gutter:",
        theme:           "Theme:",
        fontSize:        "Font Size:",
        softWrap:        "Soft Wrap:",
        showPrintMargin: "Show Print Margin:",
        useSoftTabs:     "Use Soft Tabs:",
        showInvisibles:  "Show Invisibles"
    };

    var optionValues = {
        mode: {
            text:       "Plain",
            javascript: "JavaScript",
            xml:        "XML",
            html:       "HTML",
            css:        "CSS",
            builder:    "Builder"/*,
            scss:       "SCSS",
            python:     "Python",
            php:        "PHP",
            java:       "Java",
            ruby:       "Ruby",
            c_cpp:      "C/C++",
            coffee:     "CoffeeScript",
            json:       "json",
            perl:       "Perl",
            clojure:    "Clojure",
            ocaml:      "OCaml",
            csharp:     "C#",
            haxe:       "haXe",
            svg:        "SVG",
            textile:    "Textile",
            groovy:     "Groovy",
            liquid:     "Liquid",
            Scala:      "Scala"*/
        },
        theme: {
            clouds:           "Clouds",
            clouds_midnight:  "Clouds Dk",
            cobalt:           "Cobalt",
            crimson_editor:   "Crimson",
            dawn:             "Dawn",
            eclipse:          "Eclipse",
            idle_fingers:     "Idle Fingers",
            kr_theme:         "Kr Theme",
            merbivore:        "Merbivore",
            merbivore_soft:   "Merbivore sft",
            mono_industrial:  "Mono",
            monokai:          "Monokai",
            pastel_on_dark:   "Pastel On Dk",
            solarized_dark:   "Solarized Dk",
            solarized_light:  "Solarized Lt",
            textmate:         "Textmate",
            twilight:         "Twilight",
            vibrant_ink:      "Vibrant Ink"
        },
        gutter: {"true": "#'s", "false": "No #'s"},
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
        softWrap: {
             off:    "No Wrap",
            free:   "Soft Wrap"
        },
        showPrintMargin:    BOOL,
        useSoftTabs:        {"true": "Spaces", "false": "Tabs"},
        showInvisibles:     {"true": "Invisibles", "false": "No Invisibles"}
    };

    var table = [];
    //table.push("<table><tr><th>Setting</th><th>Value</th></tr>");
    table.push("<ul class='aceSettings'>");

    function renderOption(builder, option, obj, cValue) {
        builder.push("<select title='" + option + "'>");
        for (var value in obj) {
            builder.push("<option value='" + value + "' ");

            if (cValue == value) {
                builder.push(" selected ");
            }

            builder.push(">",
                obj[value],
                "</option>");
        }
        builder.push("</select>");
    }

    for (var option in options) {
        if( option!=="showPrintMargin") {
            table.push("<li>");
            renderOption(table, option, optionValues[option], options[option]);
            table.push("</li>");
        }
    }
    table.push("</ul>");
    settingDiv.innerHTML = table.join("");
    settingDiv.setAttribute("class", "aceSettingCont");

    var selects = settingDiv.getElementsByTagName("select");
    for (var i = 0; i < selects.length; i++) {
        var onChange = (function() {
            var select = selects[i];
            return function() {
                var option = select.title;
                var value  = select.value;
                editor.setOption(option, value);
            };
        })();
        selects[i].onchange = onChange;
    }

    // var button = document.createElement("input");
    // button.type = "button";
    // button.value = "Hide";
    // event.addListener(button, "click", function() {
    //     editor.setDisplaySettings(false);
    // });
    // settingDiv.appendChild(button);
}

// Default startup options.
exports.options = {
    mode:               "text",
    theme:              "textmate",
    gutter:             "false",
    fontSize:           "12px",
    softWrap:           "off",
    showPrintMargin:    "false",
    useSoftTabs:        "true",
    showInvisibles:     "true"
};

});
