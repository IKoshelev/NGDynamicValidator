/// <reference path="../../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../../src/Interfaces.ts" />
/// <reference path="../../../src/NGDynamicValidator.ts" />
/// <reference path="../demoapp.ts" />

demoApp.directive('ngNewScope', [function () {
        return { scope: true };
    }]);

demoApp.controller('directiveControllerExmplCtrl', [
    '$scope', function ($scope) {
        //Add / remove from validateTogetherGroups
        $scope.vtgTestValues = {};
        $scope.vtgTestValues.a = null;
        $scope.vtgTestValues.b = null;
        $scope.aMustEqualB = function aEualsB() {
            return $scope.vtgTestValues.a == $scope.vtgTestValues.b;
        };

        //Add / remove from requestGroup
        $scope.requestValidation = function () {
            $scope.$broadcast('VALIDATE_REQUEST', ['$testRequest'], ['dcerg']);
        };
    }]);

demoApp.directive("controllerDemoDirective", [
    'validators', function (validators) {
        var directive = {
            restrict: "A",
            require: "ngDynamicValidator",
            link: function ($scope, $elem, $attrs, $dynamicValidatorCtrl) {
                //Change options
                $scope.getCurrentExcludedNonValidsBeh = function () {
                    return $dynamicValidatorCtrl.getOptionsProp("_excludedNonValids");
                };

                $scope.setCurrentExcludedNonValidsBeh = function (newVal) {
                    $dynamicValidatorCtrl.setOptionsProp("_excludedNonValids", newVal);
                };

                //Add / remove from validateTogetherGroups
                $scope.addToValidateTogetherGroup = function () {
                    $dynamicValidatorCtrl.addToValidateTogetherGroup("dce");
                };

                $scope.removeFromValidateTogetherGroup = function () {
                    $dynamicValidatorCtrl.removeFromValidateTogetherGroup("dce");
                };

                $scope.isPartOfVTGroup = function () {
                    return _($dynamicValidatorCtrl.getOptionsProp("_validateTogetherGroups")).contains('dce');
                };

                //Add / remove from requestGroup
                $scope.addToRequestGroup = function () {
                    $dynamicValidatorCtrl.addRequestGroup('dcerg');
                };

                $scope.removeFromRequestGroup = function () {
                    $dynamicValidatorCtrl.removeRequestGroup('dcerg');
                };

                $scope.isPartOfRequestGroup = function () {
                    return _($dynamicValidatorCtrl.getOptionsProp("_validateRequestGroups")).contains('dcerg');
                };

                //Add / remove validators
                $scope.addMinLengthValidator = function () {
                    $dynamicValidatorCtrl.addValidator('default', validators.minLength(5));
                };

                $scope.removeMinLengthValidator = function () {
                    $dynamicValidatorCtrl.removeValidatorByName('default', 'minLength');
                };

                $scope.hasMinLengthValidator = function () {
                    return _($dynamicValidatorCtrl.getOptionsProp('validators').default).any(function (validatorCtrl) {
                        return validatorCtrl.name == 'minLength';
                    });
                };
            }
        };

        return directive;
    }]);
//# sourceMappingURL=script.js.map
