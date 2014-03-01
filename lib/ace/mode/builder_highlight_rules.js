define(function(require, exports, module) {

"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BuilderHighlightRules = function() {
	var internals = ["iAppend","iBase64","iBirth","iConsole","iContent","iDate","iDeath","iDecode","iDigest","iEmbed","iEncode","iEq","iEqFamily","iEqNode","iEqSibs","iEval","iExistContent","iExistMedia","iExistNode","iExists","iExistSimilar","iField","iForAncestry","iForIndex","iForNodes","iForPeers","iForQuery","iForSibs","iForSimilar","iForSubs","iForTax","iForTaxNodes","iFullBuild","iGet","iHex","iID","iIndex","iLang","iLangID","iLayout","iLayoutName","iLeft","iLength","iLink","iLinkRef","iLower","iMath","iMedia","iMid","iNull","iNumChildren","iNumGen","iNumGens","iNumPage","iNumPages","iNumSib","iPosition","iPreview","iRegex","iRembr","iRembrp","iReplace","iReset","iRight","iSegmentName","iSet","iSetCache","iShortTitle","iSig","iSuffix","iTax","iTeam","iTech","iTiming","iTitle","iTrim","iUnHex","iUpper","iUrlEncode","iUse"];

	var macro = {
		regex: /(@\w+)\(/,
		token : function (x) {

			var ret = "function";
			if (internals.indexOf(x.substr(1,x.length-1)) != -1) {
				ret =  "function.buildin";
			}
			return ret;
		},
		push: "params"
	},

	literal = {
		regex : "{\\|",
		token: "comment",
		push  : "literal"
	},

	illegal = {
		token : "invalid.illegal",
		regex: "@",
		merge: false
	},

	comment ={
		regex: /@comment\(/,
		token: "comment.documentation",
		push: "comment"
	},

	brace = {
		regex: /{/,
		token: "support.type",
		push: "brace"
	};

	var defaultRules = [comment,macro,illegal,literal,brace];
	
	this.$rules = {
		"start" : [
			defaultRules
		],
		"params" : [
			defaultRules,
			{
				regex:",",
				token: "function",
				merge: false
			},
			{
				regex: "\\(",
				push: "bracket",
				token: "variable"
			},
			{
				token : "function",
				regex : "\\)",
				merge: false,
				next:   "pop"
			},
			{defaultToken: "variable"}
		],
		
		"literal": [
			literal,
			{
				regex : "\\|}",
				token: "comment",
				next: "pop"
			},
			{
				defaultToken: "comment"
			}
		],
		
		"comment": [
			{
				regex : "\\(",
				token: "comment.documentation",
				push: "comment"
			},
			{
				regex : "\\)",
				token: "comment.documentation",
				next: "pop"
			},
			{defaultToken: "comment.documentation"}
		],

		"bracket": [
			defaultRules,
			{
				regex : "\\)",
				token: "variable",
				next: "pop"
			},
			{
				defaultToken: "variable"
			}
		],

		"brace": [
			defaultRules,
			{
				regex : "}",
				token: "support.type",
				next: "pop"
			},{
				defaultToken: "support.type"
			}
		]
	};
	this.normalizeRules();
};

oop.inherits(BuilderHighlightRules, TextHighlightRules);

exports.BuilderHighlightRules = BuilderHighlightRules;
});
