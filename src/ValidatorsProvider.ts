/// <reference path="typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="typings/underscore/underscore.d.ts" />
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="interfaces.ts" />

var valdiatorModule = angular.module("NGDynamicValidator", []);

valdiatorModule.provider("validators", [function () {

    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

    var that: IValidatorsProvider = this;

    that.getValueFromValueProvider = function (valuePrivider) {

        if (!_.isObject(valuePrivider)) {
            return valuePrivider;
        }

        if (_.isFunction(valuePrivider)) {
            return valuePrivider();
        }

        if (_(valuePrivider).has("value")) {
            return valuePrivider.value;
        }

        return valuePrivider;
    }

    that.validators = {
        required: function (valuePrivider) {
            return function reequired(value) {
                var isRequired = that.getValueFromValueProvider(valuePrivider);
                var isValid = !isRequired || value;
                return <IValidationResult>{
                    isValid: !!isValid,
                    modifiedValue: value 
                }
            }
        },
        minLength: <IValidatorFnProvider> function (valuePrivider) {
            return function minLength(value) {
                var minLengthValue = that.getValueFromValueProvider(valuePrivider);
                var isValid = !value || value.length >= minLengthValue;
                return <IValidationResult>{
                    isValid: isValid,
                    modifiedValue: isValid ? value : undefined
                }
		    }
        },
        maxLength: <IValidatorFnProvider> function (valuePrivider) {
            return function maxLength(value) {
                var maxLengthValue = that.getValueFromValueProvider(valuePrivider);
                var isValid = !value || value.length <= maxLengthValue;
                return <IValidationResult>{
                    isValid: isValid,
                    modifiedValue: isValid ? value : undefined
                }
	        }
        },
        pattern: <IValidatorFnProvider> function (valuePrivider) {
            return function pattern(value) {
                var pattern = that.getValueFromValueProvider(valuePrivider);
                if (_(pattern).isString()) pattern = new RegExp(pattern);
                var isValid = (<RegExp>pattern).test(value);
                return <IValidationResult>{
                    isValid: isValid,
                    modifiedValue: isValid ? value : undefined
                }
		    }
        }
    };

    that.$get = [function () {
        return this.validators;
    }];

}]);
