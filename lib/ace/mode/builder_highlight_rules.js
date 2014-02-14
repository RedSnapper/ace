define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");

var BuilderHighlightRules = function() {
	var internals = ['iAppend','iBase64','iBirth','iConsole','iContent','iDate','iDeath','iDecode','iDigest','iEmbed','iEncode','iEq','iEqFamily','iEqNode','iEqSibs','iEval','iExistContent','iExistMedia','iExistNode','iExists','iExistSimilar','iField','iForAncestry','iForIndex','iForNodes','iForPeers','iForQuery','iForSibs','iForSimilar','iForSubs','iForTax','iForTaxNodes','iFullBuild','iGet','iHex','iID','iIndex','iLang','iLangID','iLayout','iLayoutName','iLeft','iLength','iLink','iLinkRef','iLower','iMath','iMedia','iMid','iNull','iNumChildren','iNumGen','iNumGens','iNumPage','iNumPages','iNumSib','iPosition','iPreview','iRegex','iRembr','iRembrp','iReplace','iReset','iRight','iSegmentName','iSet','iSetCache','iShortTitle','iSig','iSuffix','iTax','iTeam','iTech','iTiming','iTitle','iTrim','iUnHex','iUpper','iUrlEncode','iUse'];
	var nest =[];
	var comment = "comment";   //comment()  uses the class 'comment'
	var internal = "keyword";  //INT.MACRO  uses the class 'keyword'
	var macro = "function";	//MACRO  uses the class 'function'
	var text = "string";	//TEXT   uses the class 'string'
	var bracket = "support";   //BRACKET  uses the class 'support'
	var mparm = "variable";	//MPARM  uses the class 'variable'
	var mbrace = "constant";   //MBRACE  uses the class 'variable parameter'
	var broken = "illegal";	//FAIL	uses the class of 'illegal'
	/* If we are not in a macro then nest is empty. */
	this.$rules = {
		"start": [ //start is always 'text'.
			{
			//'{' Entering into a brace.
				token : function (x) {
					var rv=text;
					if (nest.length!=0) {
						switch (nest[0]) {
							case broken: {
								nest.length = 0; rv=text;
							} break;
							default:  {
								nest.unshift(mbrace);
								rv=mbrace;
							} break;
						}
					}
					return rv;
				}
				,
				regex: "{(?!\\|)"
			},{
			//'}' Close brace. Need to drop from stack if it is onstack.
				token : function (x) {
					var rv=text;
					if (nest.length!=0) {
						switch (nest[0]) {
							case mbrace: {
								rv=mbrace;
								nest.shift();
							} break; //in a brace
							case bracket: { //@bold({(4}) currently breaks in builder.
								nest.unshift(broken);
								rv=nest[0];
							} break;
							case broken: {
								nest.length = 0; rv=text;
							} break;
							default: {} break; //mparm remains the same.
						}
					}
					return rv;
				},
				regex: "\\}"
			},{
			//'@foo(' Entering into a macro, and push macroparm onto stack.
				token : function (x) {
					var rv=macro;
					if (internals.indexOf(x.substr(1,x.length-2)) != -1) {
						rv=internal;
					} else {
						if (x.substr(1,x.length-2) == 'comment') {
							rv=comment;
						}
					}
					nest.unshift(rv);
					if (rv != comment) {
						nest.unshift(mparm);
					}
					return rv;
				},
				regex: "\@\\w+\\("
			},{
			// ',' commas should be macro if we are currently doing macroparms.
				token : function (x) {
					var rv=text;
					if (nest.length!=0) {
						rv=nest[0];
						if (nest[0]==mparm) {
							rv=nest[1];
						}
					}
					return rv;
				},
				regex: ","
			},{
			// ')' close macro/bracket.
				token : function (x) {
					var rv=text;
					if (nest.length!=0) {
						switch (nest[0]) {
							case mbrace: { //@bold(({4)) currently breaks in builder.
								nest.unshift(broken);
								rv = broken;
							} break; //in a brace
							case bracket: {
								nest.shift();
								if (nest.length!=0) {
									rv=nest[0];
								} else {
									rv=text;
								}
							} break;
							case broken: {
								nest.length = 0;
								rv=text;
							} break;
							case comment: {
								nest.shift();
								rv=comment;
							} break;
							case mparm: {
								nest.shift();
								rv=macro;
								if (nest.length!=0) {
									if(nest[0] == internal || nest[0] == macro) {
										rv = nest[0];
										nest.shift();
									}
								}
							} break;
							default: {} break; //stays the same.
						}
					}
					return rv;
				},
				regex: "\\)"
			},{
			// '(' Open bracket. Acts as a visible brace.
				token : function (x) {
					var rv=text;
					if (nest.length!=0) {
						switch (nest[0]) {
							case broken: {
								rv=broken;
							} break;
							default:  {
								rv=nest[0];
								nest.unshift(bracket);
							} break;
						}
					}
					return rv;
				},
				regex: "\\("
			},{
			//Solitary Pipe char. This is doing the same as normal text.
				token : function (x) {
					var rv=text;
					if (nest.length!=0) {
						rv=nest[0];
					} return rv;
				},
			//nbsp etc. invisibles.
				token : "invisible",
				regex: "[\\u2000-\\u200B\\u00A0\\u180E\\u202F\\u205F\\u3000\\uFEFF]"
			},{
			//Any non-builder strings. Colour is top of the nest.
				token : function (x) { var rv=text; if (nest.length!=0) { rv=nest[0];} return rv;},
				regex: "[^{|}@(,)]+"
			},{
			//Literals are self contained.
				token : function (x) {
					var rv="meta"; if (nest.length!=0 && nest[0]==comment) { rv = comment; }
					return rv;
				},
				regex : "{\\|",
				next  : "meta"
			},{
			//'@' At-signs that are not literals or macros are invalid.
				token : function (x) {
					nest.unshift(broken);
					return nest[0];
				},
				regex: "@"
			}
	],
	"meta" : [
			{
				token : function (x) {
					var rv="meta"; if (nest.length!=0 && nest[0]==comment) {rv=comment;}
					return rv;
				},
				regex : "\\|}",
				next : "start"
			},{
				token : function (x) {
					var rv="meta"; if (nest.length!=0 && nest[0]==comment) {rv=comment;}
					return rv;
				},
				merge : true,
				regex : "(?:[^|]|\\|(?!}))+"
			}
		]
	};
};

oop.inherits(BuilderHighlightRules);

exports.BuilderHighlightRules = BuilderHighlightRules;
});
