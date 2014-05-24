/// <reference path="../../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../../src/Interfaces.ts" />
/// <reference path="../demoapp.ts" />
demoApp.config([
    "validatorsProvider", function (validatorsProvider) {
        validatorsProvider.validators.equals = function (valueProvider) {
            return function equility(value) {
                var valueFromProvider = validatorsProvider.getValueFromValueProvider(valueProvider);
                var isValid = !value || (valueFromProvider == value);
                return {
                    isValid: isValid,
                    modifiedValue: isValid ? value : undefined
                };
            };
        };
    }]);
//# sourceMappingURL=script.js.map
