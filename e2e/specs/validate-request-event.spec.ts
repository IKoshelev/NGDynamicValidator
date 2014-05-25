/// <reference path="../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../src/typings/angular-protractor/angular-protractor.d.ts" />
/// <reference path="../../src/typings/jasmine/jasmine.d.ts" />
describe('VALIDATE_REQUEST', function () {

    var hasClass = function (element: protractor.WebElement, className: string) {
        return element.getAttribute('class').then(function (classAtr) {
            return classAtr.split(' ').indexOf(className) !== -1;
        });
    };

    var ptor = protractor.getInstance();
  
    browser.get('index.html');

    ptor.waitForAngular();

    it(' should trigger synchronous validation on inputs with ng-dynamic-validator', function () {
        var ptor = protractor.getInstance();

        var exmplRootElem = ptor.findElement(protractor.By.id("validateRequestEventExample"));

        var inputA = exmplRootElem.findElement(protractor.By.model("passport"));
        var inputB = exmplRootElem.findElement(protractor.By.model("foreignPassport"));
        var inputC = exmplRootElem.findElement(protractor.By.model("driversLicense"));

        var errorLabel = exmplRootElem.findElement(protractor.By.id("errorLabel"));

        var btnSaveDraft = exmplRootElem.findElement(protractor.By.id("vreBtnSaveDraft"));
        var btnSaveFinal = exmplRootElem.findElement(protractor.By.id("vreBtnSaveFinal"));

        var errorAlert = exmplRootElem.findElement(protractor.By.id("error"));
        var messageAlert = exmplRootElem.findElement(protractor.By.id("message"));

        expect(errorLabel.isDisplayed()).toBe(false);
        expect(errorAlert.isDisplayed()).toBe(false);
        expect(messageAlert.isDisplayed()).toBe(false);
        expect(btnSaveFinal.isEnabled()).toBe(true);
        expect(btnSaveDraft.isEnabled()).toBe(true);
        expect(hasClass(inputA,"ng-valid")).toBe(true);
        expect(hasClass(inputB, "ng-valid")).toBe(true);
        expect(hasClass(inputC, "ng-valid")).toBe(true);


        btnSaveFinal.click();

        expect(errorLabel.isDisplayed()).toBe(true);
        expect(errorAlert.isDisplayed()).toBe(true);
        expect(errorAlert.getText()).toBe("Can't save - something is invalid");
        expect(messageAlert.isDisplayed()).toBe(false);
        expect(btnSaveFinal.isEnabled()).toBe(false);
        expect(btnSaveDraft.isEnabled()).toBe(true);
        expect(hasClass(inputA, "ng-valid")).toBe(false);
        expect(hasClass(inputB, "ng-valid")).toBe(false);
        expect(hasClass(inputC, "ng-valid")).toBe(false);

        inputB.sendKeys("12345");

        expect(errorLabel.isDisplayed()).toBe(true);
        expect(errorAlert.isDisplayed()).toBe(true);
        expect(errorAlert.getText()).toBe("Can't save - something is invalid");
        expect(messageAlert.isDisplayed()).toBe(false);
        expect(btnSaveFinal.isEnabled()).toBe(false);
        expect(btnSaveDraft.isEnabled()).toBe(false);
        expect(hasClass(inputA, "ng-valid")).toBe(false);
        expect(hasClass(inputB, "ng-valid")).toBe(false);
        expect(hasClass(inputC, "ng-valid")).toBe(false);

        inputB.clear();

        btnSaveDraft.click();

        expect(errorLabel.isDisplayed()).toBe(true);
        expect(errorAlert.isDisplayed()).toBe(false);
        expect(messageAlert.isDisplayed()).toBe(true);
        expect(messageAlert.getText()).toBe("Saved draft OK.");
        expect(btnSaveFinal.isEnabled()).toBe(false);
        expect(btnSaveDraft.isEnabled()).toBe(true);
        expect(hasClass(inputA, "ng-valid")).toBe(false);
        expect(hasClass(inputB, "ng-valid")).toBe(false);
        expect(hasClass(inputC, "ng-valid")).toBe(false);

	});
});