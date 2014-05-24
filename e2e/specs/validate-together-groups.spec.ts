/// <reference path="../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../src/typings/angular-protractor/angular-protractor.d.ts" />
/// <reference path="../../src/typings/jasmine/jasmine.d.ts" />

'use strict';

describe('Validate together groups ', function () {

    var hasClass = function (element: protractor.WebElement, className: string) {
        return element.getAttribute('class').then(function (classAtr) {
            return classAtr.split(' ').indexOf(className) !== -1;
        });
    };

    var ptor = protractor.getInstance();
  
    browser.get('index.html');

    ptor.waitForAngular();

    it('should validate together, and view changes should have been propogated to the model by validation time', function () {
        var ptor = protractor.getInstance();
        var inputA = ptor.findElement(protractor.By.name("validateTogetherExampleA"));
        var inputB = ptor.findElement(protractor.By.name("validateTogetherExampleB"));

        expect(hasClass(inputA, "ng-valid")).toBe(true);
        expect(hasClass(inputB, "ng-valid")).toBe(true);

        inputA.sendKeys("aa");

        expect(hasClass(inputA, "ng-valid")).toBe(true);
        expect(hasClass(inputB, "ng-valid")).toBe(true);

        inputB.sendKeys("aa");

        expect(hasClass(inputA, "ng-valid")).toBe(false);
        expect(hasClass(inputB, "ng-valid")).toBe(false);

        inputA.sendKeys(protractor.Key.BACK_SPACE);

        expect(hasClass(inputA, "ng-valid")).toBe(true);
        expect(hasClass(inputB, "ng-valid")).toBe(true);

    });

    it('should react to _validateTogetherGroupsBehaviour option', function () {
        var ptor = protractor.getInstance();
        var inputC = ptor.findElement(protractor.By.name("validateTogetherExampleC"));
        var inputD = ptor.findElement(protractor.By.name("validateTogetherExampleD"));
        var inputE = ptor.findElement(protractor.By.name("validateTogetherExampleE"));

        var coutnerC = ptor.findElement(protractor.By.binding("componentCValidationCounter"));
        var coutnerD = ptor.findElement(protractor.By.binding("componentDValidationCounter"));
        var coutnerE = ptor.findElement(protractor.By.binding("componentEValidationCounter"));

        var validateGroupsButton = ptor.findElement(protractor.By.id("btnVtgTriggerValidation"));

        expect(hasClass(inputC, "ng-valid")).toBe(true);
        expect(hasClass(inputD, "ng-valid")).toBe(true);
        expect(hasClass(inputE, "ng-valid")).toBe(true);

        expect(coutnerC.getText()).toEqual("0");
        expect(coutnerD.getText()).toEqual("0");
        expect(coutnerE.getText()).toEqual("0");

        validateGroupsButton.click();

        expect(coutnerC.getText()).toEqual("1");
        expect(coutnerD.getText()).toEqual("7");
        expect(coutnerE.getText()).toEqual("1");

        inputC.sendKeys("a");

        expect(coutnerC.getText()).toEqual("3");
        expect(coutnerD.getText()).toEqual("8");
        expect(coutnerE.getText()).toEqual("1");

        inputD.sendKeys("a");

        expect(coutnerC.getText()).toEqual("4");
        expect(coutnerD.getText()).toEqual("10");
        expect(coutnerE.getText()).toEqual("1");

        inputE.sendKeys("a");

        expect(coutnerC.getText()).toEqual("5");
        expect(coutnerD.getText()).toEqual("11");
        expect(coutnerE.getText()).toEqual("2");

    });

});