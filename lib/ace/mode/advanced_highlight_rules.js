define(function(require, exports, module) {

"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;


var AdvancedHighlightRules = function() {
	var internals = ["iAppend","iBase64","iBirth","iBuildMeta","iConsole",
	"iContent","iDate","iDeath","iDecode","iDigest","iEmbed","iEncode","iEq",
	"iEqFamily","iEqNode","iEqSibs","iEval","iExistContent","iExistMedia",
	"iExistNode","iExists","iExistSimilar","iExpr","iField","iFile",
	"iForAncestry","iForIndex","iForNodes","iForPeers","iForQuery","iForSibs",
	"iForSimilar","iForSubs","iForTax","iForTaxNodes","iFullBuild","iGet",
	"iHex","iID","iIndex","iKV","iLang","iLangID","iLayout","iLayoutName",
	"iLeft","iLength","iLink","iLinkRef","iList","iLower","iMath","iMedia",
	"iMid","Internal","iNull","iNumChildren","iNumGen","iNumGens","iNumPage",
	"iNumPages","iNumSib","iPosition","iPreview","iRegex","iRembr","iRembrp",
	"iReplace","iReset","iRight","iSegmentName","iSet","iSetCache",
	"iShortTitle","iSig","iSize","iSuffix","iTax","iTeam","iTech","iTiming",
	"iTitle","iTrim","iTW","iUnHex","iUpper","iUrlEncode","iUse"];


	const brace_i = /⎡/;
	const brace_o = /⎤/;
	const literal_i = /⎣/;
	const literal_o = /⎦/;
	const literal_c = /[^⎦⌽]+|⌽(?!comment\()?/m;
	const comment_c = /[^()]+/m;
	const bracket_i = /\(/;
	const bracket_o = /\)/;
	const mt_tag = /^w[A-Z0-9]/;
	const mt_xml = /^w[a-z0-9]/;
	const inject = /⍟\^*([0-9]+|\([0-9]+\+?\)|[ijknK]([./+-][0-9]+)?|\([ijknK]([./+-][0-9]+)?\)|\(p([s]|[0-9]+)?\))/;

	var comment_count = 0;
	var literal_count = 0;
	

	var macro = {
		regex: /⌽(\w+)\(/,
		push: "macro",
		token: function (value) {
			if(value == "comment") {
				this.push = "comment";
				this.nextState = "comment";
				comment_count++;
				var result = "comment.documentation";
				if (comment_count == 1) {
					result = "storage";
				}
				return result;
			} else {
				this.nextState = "macro";
				var tag = mt_tag;
				if(tag.test(value)) {
					this.nextState = "tag";
					return "meta.tag";
				}
				var xml = mt_xml;
				if(xml.test(value)) {
						this.nextState = "xml";
					return "meta.selector";
				}
				if (internals.indexOf(value) != -1) {
					this.nextState = "internal";
					return "function.buildin";
				}
				return "function";
			}
		},
	},
	brace = {
		regex: brace_i,
		token: "support.type",
		push: "brace"
	},
	mbrace = {
		regex : brace_i,
		token: "variable.parameter",
		push: "mbrace"
	},
	mcomma = {
		regex: /,/,
		onMatch: function(value,state,stack) {
			var retval;
			switch(state) {
				case "internal": retval="function.buildin"; break;
				case "tag": retval="meta.tag"; break;
				default: retval="function";
			}
			return retval;
		},
		merge: false
	},
	mbracket = {
		regex: bracket_i,
		push: "bracket",
		token: "variable"
	},
	injection = {
		regex : inject,  //%i or %(j.4) 
		token: "constant"
	},
	literal = {
		regex: literal_i,
		push: "literal",
		next: "literal",
		token: function (value) {
			literal_count++;
			var result = "support.function";
			if (literal_count == 1) {
				result = "support.class";
			}
			return result;
 		}
	};

	var defaultRules = [macro,literal,brace,injection];
	var macroRules = [defaultRules,mcomma,mbrace,mbracket];

// The token state machine operates on whatever is defined in this.$rules. 
// The highlighter always begins at the start state, and progresses down the 
// list, looking for a matching regex. When one is found, the resulting text 
// is wrapped within a <span class="ace_<token>"> tag, where <token> is 
// defined as the token property. Note that all tokens are preceded by 
// the ace_ prefix when they're rendered on the page.

// The syntax highlighting state machine stays in the start state, 
// until you define a next state for it to advance to

	this.$rules = {
		"start" : [
			defaultRules
		],
		"macro" : [
			macroRules,
			{
				token : "function",
				regex : bracket_o,
				merge: false,
				next:	"pop"
			},
			{defaultToken: "variable"}
		],
		
		"internal" : [
			macroRules,
			{
				token : "function.buildin",
				regex : bracket_o,
				merge: false,
				next: "pop"
			},
			{defaultToken: "variable"}
		],

		"tag" : [
			macroRules,
			{
				token : "meta.tag",
				regex : bracket_o,
				merge: true,
				next: "pop"
			},
			{defaultToken: "variable"}
		],
		
		"xml" : [
			macroRules,
			{
				token : "meta.selector",
				regex : bracket_o,
				merge: true,
				next: "pop"
			},
			{defaultToken: "variable"}
		],

		"bracket": [
			defaultRules,
			mbracket,
			brace,
			{
				regex : bracket_o,
				token: "variable",
				next: "pop"
			},
			{
				defaultToken: "variable"
			}
		],
		
		"brace": [
			defaultRules,
			brace,
			{
				regex : brace_o,
				token: "support.type",
				next: "pop"
			},{
				defaultToken: "support.type"
			}
		],

		
		"comment": [
			{
					regex: bracket_i,
					token: function (value) {
						comment_count++;
						return "comment.documentation";
					},
					push: "comment"
			},
			{
				regex: bracket_o,
				next: "pop",
				token: function (value) {
					if (comment_count > 0) {
						comment_count--;
					}
					var result = "comment.documentation";
					if (comment_count == 0) {
						result = "storage";
					}
						return result;
				}
			},
			{
					regex: comment_c,
					token: "comment.documentation"
			},
			{
				defaultToken: "comment.documentation"
			}
		],
		
		"literal": [
				{
					regex: literal_i,
					token: function (value) {
						literal_count++;
						return "support.function";
					},
					push: "literal",
				},			
			{
					regex: literal_o,
					token: function (value) {
						if (literal_count > 0) {
							literal_count--;
						}
						var result = "support.function";
						if (literal_count == 0) {
						result = "support.class";
						}
						return result;
					},
					next: "pop"
			},
			{
				regex: /⌽comment\(/,
				push: "comment",
				nextState: "comment",
				token: function (value) {
					comment_count++;
					var result = "comment.documentation";
					if (comment_count == 1) {
						result = "storage";
					}
					return result;
				}
			},
			{
					regex: literal_c,
					token: "support.function",
			},
			{
				defaultToken: "support.function"
			}
		],
	};
	this.normalizeRules();
};

oop.inherits(AdvancedHighlightRules, TextHighlightRules);

exports.AdvancedHighlightRules = AdvancedHighlightRules;
});
