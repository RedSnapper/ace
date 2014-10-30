define(function(require, exports, module) {

"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BuilderHighlightRules = function() {
	var internals = ["iAppend","iBase64","iBirth","iConsole","iContent","iDate","iDeath","iDecode","iDigest","iEmbed","iEncode","iEq","iEqFamily","iEqNode","iEqSibs","iEval","iExistContent","iExistMedia","iExistNode","iExists","iExistSimilar","iField","iForAncestry","iForIndex","iForNodes","iForPeers","iForQuery","iForSibs","iForSimilar","iForSubs","iForTax","iForTaxNodes","iFullBuild","iGet","iHex","iID","iIndex","iLang","iLangID","iLayout","iLayoutName","iLeft","iLength","iLink","iLinkRef","iLower","iMath","iMedia","iMid","iNull","iNumChildren","iNumGen","iNumGens","iNumPage","iNumPages","iNumSib","iPosition","iPreview","iRegex","iRembr","iRembrp","iReplace","iReset","iRight","iSegmentName","iSet","iSetCache","iShortTitle","iSig","iSuffix","iTax","iTeam","iTech","iTiming","iTitle","iTrim","iUnHex","iUpper","iUrlEncode","iUse"];

	var macro = {
		regex: /@(\w+)\(/,
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
	brace = {
		regex: /{/,
		token: "support.type",
		push: "brace"
	},
	mbrace = {
		regex : /{/,
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
	};
	
	var literal = (function(){

		var inside = false;
		var open = function(){
			var obj = {};
			if(!inside){
				inside = true;
				obj = {
					regex : /{\|/,
					token: "comment",
					push: "literal"
				}
			}
			return obj;
		}
		var close = function(){
			var obj ={ 
				regex : /\|}/,
				token: "comment",
				next: "pop"
			}
			inside = false;
			return obj;
		}

		return {
			open: open,
			close: close
		}

	})();


	var defaultRules = [macro,literal.open()];
	var macroRules = [defaultRules,mcomma,mbrace,mbracket];

	this.$rules = {
		"start" : [
			defaultRules,brace
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

		"literal": [
			literal.open(),
			literal.close(),
			{
				defaultToken: "comment"
			}
		],

		"bracket": [
			defaultRules,
			mbracket,
			brace,
			{
				regex : /\)/,
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
				regex : /}/,
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
				regex : /}/,
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

oop.inherits(BuilderHighlightRules, TextHighlightRules);

exports.BuilderHighlightRules = BuilderHighlightRules;
});
