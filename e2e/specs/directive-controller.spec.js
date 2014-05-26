/// <reference path="../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../src/typings/angular-protractor/angular-protractor.d.ts" />
/// <reference path="../../src/typings/jasmine/jasmine.d.ts" />
'use strict';
describe('Directive controller', function () {
    var hasClass = function (element, className) {
        return element.getAttribute('class').then(function (classAtr) {
            return classAtr.split(' ').indexOf(className) !== -1;
        });
    };

    var ptor = protractor.getInstance();

    browser.get('index.html');

    ptor.waitForAngular();

    it('should allow to change options', function () {
        var ptor = protractor.getInstance();
        var rootElem = ptor.findElement(protractor.By.id("directiveControllerExmlp"));
        var label = rootElem.findElement(protractor.By.tagName("label"));
        var setBehValidateBtn = rootElem.findElement(protractor.By.id("switchBehToValidateBtn"));
        var setBehSetValidBtn = rootElem.findElement(protractor.By.id("switchBehToSetValidBtn"));
        var input = rootElem.findElement(protractor.By.name("controllerExampleA"));

        input.sendKeys("1234567");

        //trigger blur
        label.click();

        expect(hasClass(input, "ng-valid")).toBe(false);

        input.sendKeys(protractor.Key.BACK_SPACE);

        expect(hasClass(input, "ng-valid")).toBe(false);

        input.sendKeys(protractor.Key.BACK_SPACE);

        expect(hasClass(input, "ng-valid")).toBe(true);

        setBehSetValidBtn.click();

        input.sendKeys("6789");

        //trigger blur
        label.click();

        expect(hasClass(input, "ng-valid")).toBe(false);

        input.sendKeys(protractor.Key.BACK_SPACE);

        expect(hasClass(input, "ng-valid")).toBe(true);

        //trigger blur
        label.click();

        expect(hasClass(input, "ng-valid")).toBe(false);
    });

    it('should allow to add \ remove input to validateTogetherGroups', function () {
        var ptor = protractor.getInstance();
        var rootElem = ptor.findElement(protractor.By.id("directiveControllerExmlp"));
        var addBtn = rootElem.findElement(protractor.By.id("addToVTGBtn"));
        var removeBtn = rootElem.findElement(protractor.By.id("removeFromVTGBtn"));
        var inputA = rootElem.findElement(protractor.By.name("controllerExampleBValA"));
        var inputB = rootElem.findElement(protractor.By.name("controllerExampleBValB"));

        inputA.sendKeys("123");
        inputB.sendKeys("123");

        expect(hasClass(inputA, "ng-valid")).toBe(false);
        expect(hasClass(inputB, "ng-valid")).toBe(false);

        addBtn.click();

        inputA.clear();
        inputB.clear();

        expect(hasClass(inputA, "ng-valid")).toBe(true);
        expect(hasClass(inputB, "ng-valid")).toBe(true);

        inputA.sendKeys("123");
        inputB.sendKeys("123");

        expect(hasClass(inputA, "ng-valid")).toBe(true);
        expect(hasClass(inputB, "ng-valid")).toBe(true);
    });

    it('should allow to add \ remove input to requesetGroups', function () {
        var ptor = protractor.getInstance();
        var rootElem = ptor.findElement(protractor.By.id("directiveControllerExmlp"));
        var addBtn = rootElem.findElement(protractor.By.id("addToRGBtn"));
        var removeBtn = rootElem.findElement(protractor.By.id("removeFromRGBtn"));
        var requestBtn = rootElem.findElement(protractor.By.id("requestGroupValidationBtn"));
        var input = rootElem.findElement(protractor.By.name("controllerExampleC"));

        input.sendKeys("1234567");

        expect(hasClass(input, "ng-valid")).toBe(true);

        requestBtn.click();

        expect(hasClass(input, "ng-valid")).toBe(true);

        addBtn.click();
        requestBtn.click();

        expect(hasClass(input, "ng-valid")).toBe(false);

        removeBtn.click();
        input.clear();

        expect(hasClass(input, "ng-valid")).toBe(true);

        input.sendKeys("1234567");

        expect(hasClass(input, "ng-valid")).toBe(true);

        requestBtn.click();

        expect(hasClass(input, "ng-valid")).toBe(true);
    });

    it('should allow to add \ remove validators', function () {
        var ptor = protractor.getInstance();
        var rootElem = ptor.findElement(protractor.By.id("directiveControllerExmlp"));
        var addBtn = rootElem.findElement(protractor.By.id("addValidatorBtn"));
        var removeBtn = rootElem.findElement(protractor.By.id("removeValidatorBtn"));
        var input = rootElem.findElement(protractor.By.name("controllerExampleD"));

        input.sendKeys("123");

        expect(hasClass(input, "ng-valid")).toBe(true);

        addBtn.click();

        input.sendKeys("4");

        expect(hasClass(input, "ng-valid")).toBe(false);

        input.sendKeys("5");

        expect(hasClass(input, "ng-valid")).toBe(true);

        removeBtn.click();

        input.sendKeys(protractor.Key.BACK_SPACE);

        expect(hasClass(input, "ng-valid")).toBe(true);
    });
});
//# sourceMappingURL=directive-controller.spec.js.map
