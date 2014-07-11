define(function(require, exports, module) {

"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var AdvancedmHighlightRules = function() {
	var internals = ["iAppend","iBase64","iBirth","iConsole","iContent","iDate","iDeath","iDecode","iDigest","iEmbed","iEncode","iEq","iEqFamily","iEqNode","iEqSibs","iEval","iExistContent","iExistMedia","iExistNode","iExists","iExistSimilar","iField","iForAncestry","iForIndex","iForNodes","iForPeers","iForQuery","iForSibs","iForSimilar","iForSubs","iForTax","iForTaxNodes","iFullBuild","iGet","iHex","iID","iIndex","iLang","iLangID","iLayout","iLayoutName","iLeft","iLength","iLink","iLinkRef","iLower","iMath","iMedia","iMid","iNull","iNumChildren","iNumGen","iNumGens","iNumPage","iNumPages","iNumSib","iPosition","iPreview","iRegex","iRembr","iRembrp","iReplace","iReset","iRight","iSegmentName","iSet","iSetCache","iShortTitle","iSig","iSuffix","iTax","iTeam","iTech","iTiming","iTitle","iTrim","iUnHex","iUpper","iUrlEncode","iUse"];

	var macro = {
		regex: /⌽(\w+)\(/,
		token : function (value) {
			this.nextState = "macro";
			if(value == 'comment') {
				this.nextState = "comment";
				return "comment.documentation";
			}
			var regex = /^w[A-Z]/;
			if(regex.test(value)) {
				this.nextState = "tag";
				return "meta.tag";
			}
			if (internals.indexOf(value) != -1) {
				this.nextState = "internal";
				return "function.buildin";
			}
			return "function";
		},
		push: "macro"
	},
	illegal = {
		token : "invalid.illegal",
		regex: /⌽\S*/,
		merge: false
	},
	mbrace = {
		regex : /⎡/,
		token: "variable.parameter",
		push: "mbrace"
	},
	mcomma = {
		regex: /,/,
		onMatch: function(value,state,stack) {
			var retval;
			switch(state) {
				case "comment": retval="comment.documentation"; break;
				case "internal": retval="function.buildin"; break;
				case "tag": retval="meta.tag"; break;
				default: retval="function";
			}
			return retval;
		},
		merge: false
	},
	mbracket = {
		regex: /\(/,
		push: "bracket",
		token: "variable"
	},
	parameter = {
		regex: /⍟\d/,
		token: "variable.language"
	},
	parameters = {
		regex: /⍟\(\w+\)/,
		token: "variable.language"
	};
	
	


	var defaultRules = [macro,illegal,parameter,parameters];
	var macroRules = [defaultRules,mcomma,mbrace,mbracket];

	this.$rules = {
		"start" : [
			defaultRules
		],
		"macro" : [
			macroRules,
			{
				token : "function",
				regex : /\)/,
				merge: false,
				next:	"pop"
			},
			{defaultToken: "variable"}
		],

		"comment" : [
			macroRules,
			{
				token : "comment.documentation",
				regex : /\)/,
				merge: false,
				next:	"pop"
			},
			{defaultToken: "comment.documentation"}
		],

		"internal" : [
			macroRules,
			{
				token : "function.buildin",
				regex : /\)/,
				merge: false,
				next: "pop"
			},
			{defaultToken: "variable"}
		],

		"tag" : [

			macroRules,
			{
				token : "meta.tag",
				regex : /\)/,
				merge: false,
				next: "pop"
			},
			{defaultToken: "variable"}
		],

		"bracket": [
			defaultRules,
			mbracket,
			{
				regex : /\)/,
				token: "variable",
				next: "pop"
			},
			{
				defaultToken: "variable"
			}
		],


		"mbrace": [
			defaultRules,
			mbrace,
			{
				regex : /⎤/,
				token: "variable.parameter",
				next: "pop",
			},
			{
				defaultToken: "variable.parameter"
			}

		]
	};
	this.normalizeRules();
};

oop.inherits(AdvancedmHighlightRules, TextHighlightRules);

exports.AdvancedmHighlightRules = AdvancedmHighlightRules;
});
