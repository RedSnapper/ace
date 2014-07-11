define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var CssBehaviour = require("./behaviour/css").CssBehaviour;
var AdvancedmHighlightRules = require("./advancedm_highlight_rules.js").AdvancedmHighlightRules;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = AdvancedmHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CssBehaviour();
};
oop.inherits(Mode, TextMode);

(function() {
    this.$id = "ace/mode/advancedm";
    this.getNextLineIndent = function(state, line, tab) {
        return this.$getIndent(line);
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});

