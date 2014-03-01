define(function(require, exports, module) {

"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BuilderHighlightRules = function() {
	var internals = ["iAppend","iBase64","iBirth","iConsole","iContent","iDate","iDeath","iDecode","iDigest","iEmbed","iEncode","iEq","iEqFamily","iEqNode","iEqSibs","iEval","iExistContent","iExistMedia","iExistNode","iExists","iExistSimilar","iField","iForAncestry","iForIndex","iForNodes","iForPeers","iForQuery","iForSibs","iForSimilar","iForSubs","iForTax","iForTaxNodes","iFullBuild","iGet","iHex","iID","iIndex","iLang","iLangID","iLayout","iLayoutName","iLeft","iLength","iLink","iLinkRef","iLower","iMath","iMedia","iMid","iNull","iNumChildren","iNumGen","iNumGens","iNumPage","iNumPages","iNumSib","iPosition","iPreview","iRegex","iRembr","iRembrp","iReplace","iReset","iRight","iSegmentName","iSet","iSetCache","iShortTitle","iSig","iSuffix","iTax","iTeam","iTech","iTiming","iTitle","iTrim","iUnHex","iUpper","iUrlEncode","iUse"];


	var macro = {
		regex: /(@\w+)\(/,
		token : function (value) {

			var regex = /^@w[A-Z]/;

			// Test for HTML macros

			if(regex.test(value)){
				this.nextState = "tag";
				return "meta.tag";
			}

			//Test for internals

			if (internals.indexOf(value.substr(1,value.length-1)) != -1) {
				this.nextState = "internal";
				return "function.buildin";
			}

			this.nextState = "macro";
			
			return "function";
		},
		push: "macro"
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
	},

	mbrace = {
		regex : "{",
		token: "variale.parameter",
		push: "mbrace"
	},
	comma = {
		regex:",",
		token: "function",
		merge: false
	},
	mbracket = {
		regex: "\\(",
		push: "bracket",
		token: "variable"
	};

	var defaultRules = [comment,macro,illegal,literal];
	var macroRules = [defaultRules,comma,mbrace,mbracket];
	
	this.$rules = {
		"start" : [
			defaultRules,brace
		],
		"macro" : [
			
			macroRules,
			{
				token : "function",
				regex : "\\)",
				merge: false,
				next:   "pop"
			},
			{defaultToken: "variable"}
		],

		"internal" : [
			
			macroRules,
			{
				token : "function.buildin",
				regex : "\\)",
				merge: false,
				next:   "pop"
			},
			{defaultToken: "variable"}
		],

		"tag" : [
			
			macroRules,
			{
				token : "meta.tag",
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
			brace,
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
			brace,
			{
				regex : "}",
				token: "support.type",
				next: "pop"
			},{
				defaultToken: "support.type"
			}
		],

		"mbrace": [
			defaultRules,
			mbrace,
			{
				regex : "}",
				token: "variale.parameter",
				next: "pop",
			},
			{
				defaultToken: "variale.parameter"
			}
			
		]
	};
	this.normalizeRules();
};

oop.inherits(BuilderHighlightRules, TextHighlightRules);

exports.BuilderHighlightRules = BuilderHighlightRules;
});
