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
exports.Mode = Mode;
});

__ace_shadowed__.define('ace/mode/builder_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/lang', 'ace/mode/text_highlight_rules'], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BuilderHighlightRules = function() {
	var nest =[];
	var macro = "keyword";		//MACRO  uses the class 'keyword'
	var text = "string";		//TEXT   uses the class 'string'
	var bracket = "support"; 	//BRACKET  uses the class 'support'
	var mparm = "variable";		//MPARM  uses the class 'variable'
	var mbrace = "constant";	//MBRACE  uses the class 'variable parameter'
	this.$rules = {
		"start": [ //start is always 'text'.
		/*
		Comments. Brackets are treated like (visible) braces when used in macros. 
		So for instance, @wH3(@wa(class,foo),select (A,B)) is 2 parms.
		*/
			{
			//'{' Entering into a brace. If top = mparm, add, else treat as text.
				token : function (x) { var rv=text; if (nest.length!=0) { if (nest[0]!=text) { nest.unshift(mbrace);} rv=nest[0]; } return rv;},
				regex: "{(?!\\|)"
			},{ 
			//'}' Close brace. Need to drop from stack if it is onstack.
				token : function (x) { var rv=text; if (nest.length!=0) {rv=nest[0]; if (nest[0]==mbrace) {nest.shift();}} return rv;},
				regex: "\\}"
			},{ 
			//'@foo(' Entering into a macro, and push macroparm onto stack.
				token : function (x) { nest.unshift(mparm); return macro; },
				regex: "\@\\w+\\("
			},{
			// ',' commas should be macro if we are currently doing macroparms.
				token : function (x) { var rv=text; if (nest.length!=0) {rv=nest[0]; if (nest[0]==mparm) { rv=macro; }} return rv;},
				regex: ","
			},{
			// ')' close macro/bracket.
				token : function (x) { var rv=text; if (nest.length!=0) {rv=nest[0]; switch (nest[0]) { 
					case mparm: {rv=macro; nest.shift(); } break;
					case bracket: { nest.shift(); rv=nest[0];} break;
					default: rv=nest[0]; break;
				} } return rv;},
				regex: "\\)"
			},{ 
			// '(' Open bracket. Acts as a visible brace.
				token : function (x) { var rv=text; if (nest.length!=0) { rv=nest[0]; if (nest[0]!=text) {nest.unshift(bracket);}} return rv;},
				regex: "\\("
			},{ 
			//Solitary Pipe char. This is doing the same as normal text.
				token : function (x) { var rv=text; if (nest.length!=0) { rv=nest[0];} return rv;},
				regex: "\\|"
			},{
			//Any non-builder strings. Colour is top of the nest.
				token : function (x) { var rv=text; if (nest.length!=0) { rv=nest[0];} return rv;},
				regex: "[^{|}@(,)]+"
			},{
			//Literals are self contained.
				token : ["comment", "comment.doc", "comment"],
				regex: "({\\|)((?:[^|]|\\|(?!}))*)(\\|})"
			},{
			//'@' At-signs that are not literals or macros are invalid.
				token : "invalid",
				regex: "@"
			}
		]
	};
};

oop.inherits(BuilderHighlightRules, TextHighlightRules);

exports.BuilderHighlightRules = BuilderHighlightRules;
});