define(function(require, exports, module) {

"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BuilderHighlightRules = function() {
	var internals = ["iAppend","iBase64","iBirth","iConsole","iContent","iDate","iDeath","iDecode","iDigest","iEmbed","iEncode","iEq","iEqFamily","iEqNode","iEqSibs","iEval","iExistContent","iExistMedia","iExistNode","iExists","iExistSimilar","iField","iForAncestry","iForIndex","iForNodes","iForPeers","iForQuery","iForSibs","iForSimilar","iForSubs","iForTax","iForTaxNodes","iFullBuild","iGet","iHex","iID","iIndex","iLang","iLangID","iLayout","iLayoutName","iLeft","iLength","iLink","iLinkRef","iLower","iMath","iMedia","iMid","iNull","iNumChildren","iNumGen","iNumGens","iNumPage","iNumPages","iNumSib","iPosition","iPreview","iRegex","iRembr","iRembrp","iReplace","iReset","iRight","iSegmentName","iSet","iSetCache","iShortTitle","iSig","iSuffix","iTax","iTeam","iTech","iTiming","iTitle","iTrim","iUnHex","iUpper","iUrlEncode","iUse"];

	var macro = {
		regex: /(@\w+)(\()/,
		token : function (x) {

			var ret = "function";
			if (internals.indexOf(x.substr(1,x.length-1)) != -1) {
				ret =  "function.buildin";
			}
			return [ret,"paren.lparen"];
		},
		push: "params"
	};
	
	this.$rules = {
		"start" : [
			{
				regex: /@comment\(/,
				token: "comment.documentation",
				push: "comment"
			},
			macro,
			{
				token : "invalid",
				regex: "@",
				merge: false
			},
			{
				regex : "{\\|",
				token: "comment",
				push  : "literal"
			}
		],
		"params" : [
			{
				regex : "{\\|",
				token: "comment",
				push  : "literal"
			},
			{
				regex: /@comment\(/,
				token: "comment.documentation",
				push: "comment"
			},
			macro,
			{
				regex:",",
				token: "function",
				merge: false
			},
			{
				regex: "\\(",
				push: "params",
				token: "paren.lparen"
			},
			{
				token : "paren.rparen",
				regex : "\\)",
				merge: false,
				next:   "pop"
			},
			{
				token : "invalid",
				regex: "@",
				merge: false
			},
			{defaultToken: "variable.parameter"}
		],
		
		"literal": [
			{
				regex : "{\\|",
				token: "comment",
				push: "literal"
			},
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
		]
	};
	this.normalizeRules();
};

oop.inherits(BuilderHighlightRules, TextHighlightRules);

exports.BuilderHighlightRules = BuilderHighlightRules;
});
