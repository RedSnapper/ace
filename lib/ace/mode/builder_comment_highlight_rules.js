define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BuilderCommentHighlightRules = function() {
	this.$rules = {
		"start": [
            {
                token : "comment.doc",
                merge : true,
                regex : "([^|])+"
            },{
                token : "comment.doc",
                merge : true,
                regex : "(\\|(?!\\}))*"
            }
        ]
    };
};

oop.inherits(BuilderCommentHighlightRules, TextHighlightRules);

BuilderCommentHighlightRules.getStartRule = function(start) {
    return {
        token : "macrotext", // doc comment
        merge : true,
        regex : "{\\|",
        next  : start
    };
};

BuilderCommentHighlightRules.getEndRule = function (start) {
    return {
        token : "macrotext", // closing comment
        merge : true,
        regex : "\\|}",
        next  : start
    };
};

exports.BuilderCommentHighlightRules = BuilderCommentHighlightRules;
});
