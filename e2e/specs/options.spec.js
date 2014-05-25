/// <reference path="../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../src/typings/angular-protractor/angular-protractor.d.ts" />
/// <reference path="../../src/typings/jasmine/jasmine.d.ts" />
describe('Options', function () {
    var hasClass = function (element, className) {
        return element.getAttribute('class').then(function (classAtr) {
            return classAtr.split(' ').indexOf(className) !== -1;
        });
    };

    var ptor = protractor.getInstance();

    browser.get('index.html');

    ptor.waitForAngular();

    it('can be passed as object', function () {
        var ptor = protractor.getInstance();
        var input = ptor.findElement(protractor.By.name("optionsExampleA"));

        expect(hasClass(input, "ng-valid")).toBe(true);

        input.sendKeys("aa");

        expect(hasClass(input, "ng-valid")).toBe(true);

        input.sendKeys("a");

        expect(hasClass(input, "ng-valid")).toBe(false);

        input.sendKeys(protractor.Key.BACK_SPACE, "b");

        expect(hasClass(input, "ng-valid")).toBe(true);

        input.clear();

        expect(hasClass(input, "ng-valid")).toBe(true);
    });

    it('can be passed as json literal', function () {
        var ptor = protractor.getInstance();
        var input = ptor.findElement(protractor.By.name("optionsExampleB"));

        expect(hasClass(input, "ng-valid")).toBe(true);

        input.sendKeys("aa");

        expect(hasClass(input, "ng-valid")).toBe(true);

        input.sendKeys("a");

        expect(hasClass(input, "ng-valid")).toBe(false);

        input.clear();
    });
});
//# sourceMappingURL=options.spec.js.map
