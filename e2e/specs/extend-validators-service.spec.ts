/// <reference path="../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../src/typings/angular-protractor/angular-protractor.d.ts" />
/// <reference path="../../src/typings/jasmine/jasmine.d.ts" />

'use strict';


describe('ValidatorsProvider', function () {

    var hasClass = function (element: protractor.WebElement, className: string) {
        return element.getAttribute('class').then(function (classAtr) {
            return classAtr.split(' ').indexOf(className) !== -1;
        });
    };

    var ptor = protractor.getInstance();

    browser.get('index.html');

    ptor.waitForAngular();

    it('should allow extension of application-wide available validators through "validators" property', function () {
        var ptor = protractor.getInstance();
        var input = ptor.findElement(protractor.By.name("extendValidatorsService"));

        expect(hasClass(input,"ng-valid")).toBe(true);

        input.sendKeys("1");
   
        expect(hasClass(input, "ng-valid")).toBe(false);

        input.clear();

        expect(hasClass(input, "ng-valid")).toBe(true);

        input.sendKeys("5");

        expect(hasClass(input, "ng-valid")).toBe(true);
    });
});