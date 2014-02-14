__ace_shadowed__.define('ace/mode/builder', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/tokenizer', 'ace/mode/builder_highlight_rules', 'ace/range'], function(require, exports, module) {


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

__ace_shadowed__.define('ace/mode/builder_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/lang', 'ace/mode/text_highlight_rules'], function(require, exports, module) {
//

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BuilderHighlightRules = function() {
	var internals = ['iAppend','iBase64','iBirth','iConsole','iContent','iDate','iDeath','iDecode','iDigest','iEmbed','iEncode','iEq','iEqFamily','iEqNode','iEqSibs','iEval','iExistContent','iExistMedia','iExistNode','iExists','iExistSimilar','iField','iForAncestry','iForIndex','iForNodes','iForPeers','iForQuery','iForSibs','iForSimilar','iForSubs','iForTax','iForTaxNodes','iFullBuild','iGet','iHex','iID','iIndex','iLang','iLangID','iLayout','iLayoutName','iLeft','iLength','iLink','iLinkRef','iLower','iMath','iMedia','iMid','iNull','iNumChildren','iNumGen','iNumGens','iNumPage','iNumPages','iNumSib','iPosition','iPreview','iRegex','iRembr','iRembrp','iReplace','iReset','iRight','iSegmentName','iSet','iSetCache','iShortTitle','iSig','iSuffix','iTax','iTeam','iTech','iTiming','iTitle','iTrim','iUnHex','iUpper','iUrlEncode','iUse'];
	var nest =[];
	var text = "string";		//TEXT   uses the class 'string'
	var literal = "comment";   //comment()  uses the class 'comment'
	var comment = "comment.documentation";   //comment()  uses the class 'comment'
	var internal = "function.buildin";   //INT.MACRO  uses the class 'keyword'
	var macro = "function";	 //MACRO  uses the class 'function'
	var mparm = "variable";			 //MPARM  uses the class 'variable'
	var mbrace = "variable.parameter";  //MBRACE  uses the class 'variable parameter'
	var bracket = "support";	//BRACKET  uses the class 'support'
	var brace = "support.type";		 //MBRACE  uses the class 'variable parameter'
	var broken = "invalid.illegal";			 //FAIL	uses the class of 'illegal'
	/* If we are not in a macro then nest is empty. */
	this.$rules = {
		"start": [ //start is always 'text'.
			{
				token : function (x) {
					var rv=text;
					if (nest.length!==0) {
						rv=nest[0];
					}
					return rv;
				},
				regex: "[^{|}@(,)]+",
				merge: true
			},{
			//'@foo(' Entering into a macro, and push macroparm onto stack.
				regex: "@\\w+(?=\\()",
				token : function (x) {
					var rv=macro;
					if (internals.indexOf(x.substr(1,x.length-1)) != -1) {
						rv=internal;
					} else {
						if (x.substr(1,x.length-1) == 'comment') {
							rv=comment;
						}
					}
					nest.unshift(rv);
					return rv;
				},
				merge: false
			},{
			// '(' Open bracket. Acts as a visible brace.
				token : function (x) {
					var rv=bracket;
					if (nest.length!==0) {
						switch (nest[0]) {
							case comment: {
								rv=comment;
								nest.unshift(comment);
							} break;
							case internal: {
								rv=internal;
								nest.unshift(mparm);
							} break;
							case macro: {
								rv=macro;
								nest.unshift(mparm);
							} break;
							default:  {
								nest.unshift(bracket);
							} break;
						}
					} else {
						nest.unshift(bracket);
					}
					return rv;
				},
				regex: "\\(",
				merge:true
			},{
			// ')' close macro/bracket.
				token : function (x) {
					var rv=bracket;
					if (nest.length!==0) {
						switch (nest[0]) {
							case comment: {
								rv=comment;
								nest.shift();
								nest.shift();
							} break;
							case mparm: {
								nest.shift();
								rv=nest[0];
								nest.shift();
							} break;
							case bracket: {
								rv=bracket;
								nest.shift();
							} break;
							default:  {
								rv = broken;
							} break;
						}
					} else {
						rv = broken;
					}
					return rv;
				},
				regex: "\\)",
				merge:false
			},{
				regex: "{(?!\\|)",
				token : function (x) {
					var rv=brace;
					if (nest.length > 0 ) {
						switch (nest[0]) {
							case mparm: {
								nest.unshift(mbrace);
								rv=mbrace;
							} break;
							default:  {
								nest.unshift(brace);
							} break;
						}
					} else {
						nest.unshift(brace);
					}
					return rv;
				},
				merge: false
			},{
			//'}' Close brace. Need to drop from stack if it is onstack.
				token : function (x) {
					var rv=brace;
					if (nest.length > 0) {
						switch (nest[0]) {
							case mbrace: {
								rv=mbrace;
								nest.shift();
							} break; //in a brace
							case brace: {
								nest.shift();
							} break;
							default: {
								rv=broken;
							} break; //mparm remains the same.
						}
					} else {
						rv=broken;
					}
					return rv;
				},
				regex: "\\}"
			},{
			// ',' commas should be macro if we are currently doing macroparms.
				token : function (x) {
					var rv=text;
					if (nest.length > 0) {
						rv=nest[0];
						if (nest[0]==mparm) {
							rv=nest[1];
						}
					}
					return rv;
				},
				regex: ",",
				merge:false
			},{
			//Solitary Pipe char. This is doing the same as normal text.
				token : function (x) {
					var rv=text;
					if (nest.length!==0) {
						rv=nest[0];
					} return rv;
				},
				regex: "\\|",
				merge: true

			},{
			//Literals are self contained.
				regex : "{\\|",
				token : function (x) {
					var rv=literal;
					if (nest.length!==0 && nest[0]==comment) { rv = comment; }
					return rv;
				},
				next  : "meta"
			},{
			//'@' At-signs that are not literals or macros are invalid.
				token : function (x) {
					nest.unshift(broken);
					return nest[0];
				},
				regex: "@",
				merge: false
			}
	],
	"meta" : [
			{
				token : function (x) {
					var rv=literal;
					if (nest.length!==0 && nest[0]==comment) {rv=comment;}
					return rv;
				},
				regex : "\\|}",
				next : "start"
			},{
				token : function (x) {
					var rv=literal;
					if (nest.length!==0 && nest[0]==comment) {rv=comment;}
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
