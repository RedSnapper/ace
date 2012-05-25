/*
https://github.com/RedSnapper/ace/blob/master/build/textarea/src/mode-builder.js
*/
__ace_shadowed__.define('ace/mode/builder', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/tokenizer', 'ace/mode/builder_highlight_rules', 'ace/range'], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var BuilderHighlightRules = require("./builder_highlight_rules").BuilderHighlightRules;
var Range = require("../range").Range;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new BuilderHighlightRules().getRules());
};
oop.inherits(Mode, TextMode);

//(function() {}).call(Mode.prototype);

exports.Mode = Mode;

});

__ace_shadowed__.define('ace/mode/builder_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/lang', 'ace/mode/text_highlight_rules'], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BuilderHighlightRules = function() {
	var nest =[];
	this.$rules = {
		"start": [ //start is always 'variable'.
			{
				token : function (x) { nest.unshift("language"); return "language"; },
				regex: "{(?!\|)"
			},{
				token : function (x) { nest.unshift("function"); return "constant"; },
				regex: "@\w+\("
			},{
				token : function (x) { var rv="variable"; if (nest.length!=0 && nest[0]==="function") rv="constant"; return rv;},
				regex: ","
			},{
				token : function (x) { var rv="variable"; if (nest.length!=0) { rv=nest[0];} return rv;},
				regex: "\(|\|"
			},{
				token : function (x) { var rv="variable"; if (nest.length!=0 && nest[0]==="function") {rv="constant"; nest.shift();} return rv;},
				regex: "\)"
			},{
				token : function (x) { var rv="variable"; if (nest.length!=0) {rv=nest.shift();} return rv;},
				regex: "\}"
			},{
				token : ["language", "comment", "language"],
				regex: "({\|)((?:[^|]|\|(?!}))*)(\|})"
			},{
				token : function (x) { var rv="variable"; if (nest.length!=0) { rv=nest[0];} return rv;},
				regex: "[^{|}@(,)]+"
			}
		]
	};
};

oop.inherits(BuilderHighlightRules, TextHighlightRules);

exports.BuilderHighlightRules = BuilderHighlightRules;
});