define('ace/mode/builder', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/tokenizer', 'ace/mode/builder_highlight_rules', 'ace/range'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var BuilderHighlightRules = require("./builder_highlight_rules").BuilderHighlightRules;
var Range = require("../range").Range;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new BuilderHighlightRules().getRules());
};
oop.inherits(Mode, TextMode);

(function() {
    
    this.getNextLineIndent = function(state, line, tab) {
        return this.$getIndent(line);
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});

define('ace/mode/builder_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/lang', 'ace/mode/text_highlight_rules'], function(require, exports, module) {


var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

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
	var broken = "invalid";	//FAIL	uses the class of 'invalid'
	this.$rules = {
		"start": [ //start is always 'text'.
			{
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
				token : function (x) { 
					var rv=text; 
					if (nest.length!=0) { 
						rv=nest[0];
					} return rv;
				},
				regex: "\\|"
			},{
				token : function (x) { var rv=text; if (nest.length!=0) { rv=nest[0];} return rv;},
				regex: "[^{|}@(,)]+"
			},{
				token : function (x) { 
					var rv="meta"; if (nest.length!=0 && nest[0]==comment) { rv = comment; }
					return rv;
				},
				regex : "{\\|",
				next  : "meta"
			},{
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

oop.inherits(BuilderHighlightRules, TextHighlightRules);

exports.BuilderHighlightRules = BuilderHighlightRules;
});
