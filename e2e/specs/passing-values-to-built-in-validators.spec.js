/// <reference path="../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../src/typings/angular-protractor/angular-protractor.d.ts" />
/// <reference path="../../src/typings/jasmine/jasmine.d.ts" />
'use strict';
describe('Built-in validators', function () {
    var hasClass = function (element, className) {
        return element.getAttribute('class').then(function (classAtr) {
            return classAtr.split(' ').indexOf(className) !== -1;
        });
    };

    var ptor = protractor.getInstance();

    browser.get('index.html');

    ptor.waitForAngular();

    it('should accept a primitive value', function () {
        var ptor = protractor.getInstance();
        var rootElemOfExample = ptor.findElement(protractor.By.id("passingValuesToBuiltInValidatorsExmpl"));
        var inputA = rootElemOfExample.findElement(protractor.By.name("inputA"));
        var inputB = rootElemOfExample.findElement(protractor.By.name("inputB"));

        expect(hasClass(inputA, "ng-valid")).toBe(true);

        inputA.sendKeys("12");

        expect(hasClass(inputA, "ng-valid")).toBe(false);

        inputA.sendKeys("3");

        expect(hasClass(inputA, "ng-valid")).toBe(true);

        expect(hasClass(inputB, "ng-valid")).toBe(true);

        inputB.sendKeys("12");

        expect(hasClass(inputB, "ng-valid")).toBe(false);

        inputB.sendKeys("3");

        expect(hasClass(inputB, "ng-valid")).toBe(true);
    });

    it('should accept a value object (i.e. {value:3})', function () {
        var ptor = protractor.getInstance();
        var rootElemOfExample = ptor.findElement(protractor.By.id("passingValuesToBuiltInValidatorsExmpl"));
        var inputC = rootElemOfExample.findElement(protractor.By.name("inputC"));
        var buttonIncr = rootElemOfExample.findElement(protractor.By.id("buttonIncr"));
        var buttonDecr = rootElemOfExample.findElement(protractor.By.id("buttonDecr"));

        expect(hasClass(inputC, "ng-valid")).toBe(true);

        inputC.sendKeys("12");

        expect(hasClass(inputC, "ng-valid")).toBe(false);

        inputC.sendKeys("3");

        expect(hasClass(inputC, "ng-valid")).toBe(true);

        buttonIncr.click();

        expect(hasClass(inputC, "ng-valid")).toBe(false);

        buttonDecr.click();

        expect(hasClass(inputC, "ng-valid")).toBe(true);
    });

    it('should accept a provider function', function () {
        var ptor = protractor.getInstance();
        var rootElemOfExample = ptor.findElement(protractor.By.id("passingValuesToBuiltInValidatorsExmpl"));
        var inputD = rootElemOfExample.findElement(protractor.By.name("inputD"));
        var buttonIncr = rootElemOfExample.findElement(protractor.By.id("buttonIncr"));
        var buttonDecr = rootElemOfExample.findElement(protractor.By.id("buttonDecr"));

        expect(hasClass(inputD, "ng-valid")).toBe(true);

        inputD.sendKeys("12");

        expect(hasClass(inputD, "ng-valid")).toBe(false);

        inputD.sendKeys("3");

        expect(hasClass(inputD, "ng-valid")).toBe(true);

        buttonIncr.click();

        expect(hasClass(inputD, "ng-valid")).toBe(false);

        buttonDecr.click();

        expect(hasClass(inputD, "ng-valid")).toBe(true);
    });
});
//# sourceMappingURL=passing-values-to-built-in-validators.spec.js.map
