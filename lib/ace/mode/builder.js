define(function(require, exports, module) {
"use strict";

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
    this.$id = "ace/mode/builder";
    this.getNextLineIndent = function(state, line, tab) {
        return this.$getIndent(line);
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});

