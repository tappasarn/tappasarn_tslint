"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new DisallowedInTestsWalker(sourceFile, this.getOptions()));
    };
    Rule.DEFAULT_FAILURE_STRING = "This method invocation is not allowed to be used on test files";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var DisallowedInTestsWalker = /** @class */ (function (_super) {
    __extends(DisallowedInTestsWalker, _super);
    function DisallowedInTestsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DisallowedInTestsWalker.prototype.visitCallExpression = function (node) {
        var fileName = node && node.getSourceFile().fileName || "";
        var isTestFile = new RegExp("\\b" + ".test" + "\\b").test(fileName);
        var functionName = node && node.expression && node.expression.getText() || "";
        var verifiedCustomOptions = this.verifyAndGetCustomOptions(functionName);
        if (isTestFile && verifiedCustomOptions.length > 0) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), verifiedCustomOptions[0].message || Rule.DEFAULT_FAILURE_STRING));
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    DisallowedInTestsWalker.prototype.verifyAndGetCustomOptions = function (functionName) {
        var customOptionSetInTslintJson = this.getOptions();
        var verifiedCustomOptions = customOptionSetInTslintJson.filter(function (option) { return option && option.name === functionName; });
        return verifiedCustomOptions;
    };
    return DisallowedInTestsWalker;
}(Lint.RuleWalker));
