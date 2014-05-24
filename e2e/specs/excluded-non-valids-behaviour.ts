/// <reference path="../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../src/typings/angular-protractor/angular-protractor.d.ts" />
/// <reference path="../../src/typings/jasmine/jasmine.d.ts" />

'use strict';

describe('Excluded non-valids', function () {

    var hasClass = function (element: protractor.WebElement, className: string) {
        return element.getAttribute('class').then(function (classAtr) {
            return classAtr.split(' ').indexOf(className) !== -1;
        });
    };

    var ptor = protractor.getInstance();
  
    browser.get('index.html');

    ptor.waitForAngular();

    it('should follow the default behaviour of _excludedNonValids="validate"', function () {
        var ptor = protractor.getInstance();
        var rootElemOfExample = ptor.findElement(protractor.By.id("excludedNonValidsBehaviour"));
        var inputA = rootElemOfExample.findElement(protractor.By.name("inputA"));
        var inputB = rootElemOfExample.findElement(protractor.By.name("inputB"));
        var inputC = rootElemOfExample.findElement(protractor.By.name("inputC"));



        expect(hasClass(inputA, "ng-valid")).toBe(true);

        inputA.sendKeys("12345678");

        inputB.click();
        expect(hasClass(inputA, "ng-valid")).toBe(false);

        inputA.sendKeys(protractor.Key.BACK_SPACE);
        expect(hasClass(inputA, "ng-valid")).toBe(false);

        inputA.sendKeys(protractor.Key.BACK_SPACE, protractor.Key.BACK_SPACE);
        expect(hasClass(inputA, "ng-valid")).toBe(true);

    });

    it('should follow behaviour of _excludedNonValids:"setValid"', function () {

        var ptor = protractor.getInstance();
        var rootElemOfExample = ptor.findElement(protractor.By.id("excludedNonValidsBehaviour"));
        var inputA = rootElemOfExample.findElement(protractor.By.name("inputA"));
        var inputB = rootElemOfExample.findElement(protractor.By.name("inputB"));
        var inputC = rootElemOfExample.findElement(protractor.By.name("inputC"));

        expect(hasClass(inputB, "ng-valid")).toBe(true);

        inputB.sendKeys("12345678");
        inputA.click();

        expect(hasClass(inputB, "ng-valid")).toBe(false);
        inputB.sendKeys(protractor.Key.BACK_SPACE);
        expect(hasClass(inputB, "ng-valid")).toBe(true);

        inputC.click();
        expect(hasClass(inputB, "ng-valid")).toBe(false);

    });

    it('should follow behaviour of _excludedNonValids:"doNothing"', function () {

        var ptor = protractor.getInstance();
        var rootElemOfExample = ptor.findElement(protractor.By.id("excludedNonValidsBehaviour"));
        var inputA = rootElemOfExample.findElement(protractor.By.name("inputA"));
        var inputB = rootElemOfExample.findElement(protractor.By.name("inputB"));
        var inputC = rootElemOfExample.findElement(protractor.By.name("inputC"));

        expect(hasClass(inputC, "ng-valid")).toBe(true);
        inputC.sendKeys("12345678")

        inputB.click();
        expect(hasClass(inputC, "ng-valid")).toBe(false);

        inputC.sendKeys(protractor.Key.BACK_SPACE);
        expect(hasClass(inputC, "ng-valid")).toBe(false);

        inputC.sendKeys(protractor.Key.BACK_SPACE, protractor.Key.BACK_SPACE, protractor.Key.BACK_SPACE);
        expect(hasClass(inputC, "ng-valid")).toBe(false);

        inputB.click();
        expect(hasClass(inputC, "ng-valid")).toBe(true);
        
	});

});