'use strict';

describe('Validators Service', function () {

    beforeEach(module('NGDynamicValidator'));

    it('should exist', inject(["validators", function (validatorsSrv) {
        
        expect(_(validatorsSrv).isObject()).toBe(true);

    }]));

    it('should have required validator', inject(["validators", function (validatorsSrv) {

        expect(_(validatorsSrv.required).isFunction()).toBe(true);
        expect(_(validatorsSrv.required(true)).isFunction()).toBe(true);

        var result;

        var requiredTrue = validatorsSrv.required(true);
        result = requiredTrue("");
        expect(result.modifiedValue).toBe("");
        expect(result.isValid).toBe(false);

        var requiredFalse = validatorsSrv.required(false);
        result = requiredFalse("");
        expect(result.modifiedValue).toBe("");
        expect(result.isValid).toBe(true);

    }]));

    it('should have minLength validator', inject(["validators", function (validatorsSrv) {

        expect(_(validatorsSrv.minLength).isFunction()).toBe(true);
        expect(_(validatorsSrv.minLength(3)).isFunction()).toBe(true);

        var validator = validatorsSrv.minLength(3);

        var result;
        
        result = validator("12");
        expect(result.modifiedValue).toBeUndefined();
        expect(result.isValid).toBe(false);

        result = validator("123");
        expect(result.modifiedValue).toBe("123");
        expect(result.isValid).toBe(true);

    }]));

    it('should have maxLength validator', inject(["validators", function (validatorsSrv) {

        expect(_(validatorsSrv.maxLength).isFunction()).toBe(true);
        expect(_(validatorsSrv.maxLength(3)).isFunction()).toBe(true);

        var validator = validatorsSrv.maxLength(3);

        var result;

        result = validator("1234");
        expect(result.modifiedValue).toBeUndefined();
        expect(result.isValid).toBe(false);

        result = validator("123");
        expect(result.modifiedValue).toBe("123");
        expect(result.isValid).toBe(true);

    }]));

    it('should have pattern validator', inject(["validators", function (validatorsSrv) {

        expect(_(validatorsSrv.pattern).isFunction()).toBe(true);
        expect(_(validatorsSrv.pattern()).isFunction(/^\d*$/)).toBe(true);

        var validatorFromPattern = validatorsSrv.pattern(/^\d+$/);
        var validatorFromString = validatorsSrv.pattern("^\\d+$");

        var result;

        result = validatorFromPattern("77");
        expect(result.modifiedValue).toBe("77");
        expect(result.isValid).toBe(true);

        result = validatorFromPattern("ab");
        expect(result.modifiedValue).toBeUndefined();
        expect(result.isValid).toBe(false);

        result = validatorFromString("77");
        expect(result.modifiedValue).toBe("77");
        expect(result.isValid).toBe(true);

        result = validatorFromString("ab");
        expect(result.modifiedValue).toBeUndefined();
        expect(result.isValid).toBe(false);

    }]));

});

describe('Validators Service', function () {

    var provider;

    beforeEach(function () {
        var TestModule = angular.module('TestModule', function () { });
        TestModule.config(function (validatorsProvider) {
            provider = validatorsProvider;
        });

        module('NGDynamicValidator', 'TestModule');

        inject(function () { });
    });

    describe('Provider', function () {

        it('should exist', function () {
            expect(provider).toBeDefined();
        });

        it('should have working getValueFromValueProvider function', function () {

            expect(provider.getValueFromValueProvider).toBeDefined();

            var getValFn = provider.getValueFromValueProvider;

            //from primitive value
            expect(getValFn(3)).toBe(3);

            //from function
            expect(getValFn(function () { return 3; })).toBe(3);

            //from ref object
            expect(getValFn({ value: 3 })).toBe(3);

            //from object
            var object = {};
            expect(getValFn(object)).toBe(object);
        });

        it('should have extendible "validators" property', inject(['validators', function (validators) {

            expect(provider.validators).toBe(validators);

            //not really needed, just for usage spec
            provider.validators.equilityValidator = function (valueProvider) {
                return function equility(value) {
                    var valueFromProvider = provider.getValueFromValueProvider(valueProvider);
                    var isValid = (valueFromProvider === value);
                    return {
                        isValid:isValid,
                        modifiedValue: isValid ? value : undefined
                    }
                }
            }

            var validatorFn = provider.validators.equilityValidator(3);
            expect(validatorFn.name).toBe("equility");
            expect(validatorFn(3).isValid).toBe(true);
            expect(validatorFn(2).isValid).toBe(false);

        }]));

    });
});

//var validators;

//beforeEach(inject([function () {

//}]));

//describe('ng-dynamic-validator directive', function () {

//    var $scope;
//    var $element;
//    var otherElement;

//    beforeEach(module('NGDynamicValidator'));
//    beforeEach(inject(function($compile,$rootScope){
//        $scope = $rootScope;
//        otherElement = angular.element("<input/>");
//        $element = angular.element('<form name="form"><input type="text" name="surname" ng-model="surname" ' 
//                                    + 'ng-dynamic-validator="{default:minLength(2), blur:maxLength(4)}">'
//                                    + '</div>');
//        $compile($element)($rootScope);
//        $rootScope.$digest();
//    }));

//    it('should validate default and blur', inject(function () {

//        expect($scope.form.$valid).toBe(true);

//        $element.focus();
//        expect($element.hasClass(":focus")).toBe(true);
        
//        //$element.
//    }));

//});