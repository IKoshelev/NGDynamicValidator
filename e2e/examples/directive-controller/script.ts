/// <reference path="../../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../../src/Interfaces.ts" />
/// <reference path="../../../src/NGDynamicValidator.ts" />
/// <reference path="../demoapp.ts" />

interface IControllerDemoScope extends ng.IScope {


    getCurrentExcludedNonValidsBeh: () => string;
    setCurrentExcludedNonValidsBeh: (newVal: string) => void;


    addToValidateTogetherGroup: () => void;
    removeFromValidateTogetherGroup: () => void;
    isPartOfVTGroup: () => boolean;


    addToRequestGroup: () => void;
    removeFromRequestGroup: () => void;
    isPartOfRequestGroup: () => void;

    addMinLengthValidator: () => void;
    removeMinLengthValidator: () => void;
    hasMinLengthValidator: () => boolean;
}

demoApp.directive('ngNewScope', [function () {
    return { scope: true};
}]);

demoApp.controller('directiveControllerExmplCtrl', ['$scope', function ($scope) {
    
    //Add / remove from validateTogetherGroups
    $scope.vtgTestValues = {};
    $scope.vtgTestValues.a = null;
    $scope.vtgTestValues.b = null;
    $scope.aMustEqualB = function aEualsB() {
        return $scope.vtgTestValues.a == $scope.vtgTestValues.b;
    };

    //Add / remove from requestGroup
    $scope.requestValidation = function () {
        $scope.$broadcast('VALIDATE_REQUEST',['$testRequest'],['dcerg']);
    };

}]);

demoApp.directive("controllerDemoDirective", ['validators', function (validators: IValidatorsService) {
    var directive: ng.IDirective = {
        restrict: "A",
        require: "ngDynamicValidator",
        link: function ($scope: IControllerDemoScope, $elem, $attrs, $dynamicValidatorCtrl: NGDynamicValidatorCtrl) {

            //Change options
            $scope.getCurrentExcludedNonValidsBeh = () => {
                return $dynamicValidatorCtrl.getOptionsProp("_excludedNonValids");
            };

            $scope.setCurrentExcludedNonValidsBeh = (newVal: string) => {
                $dynamicValidatorCtrl.setOptionsProp("_excludedNonValids", newVal);
            };


            //Add / remove from validateTogetherGroups
            $scope.addToValidateTogetherGroup = () => {
                $dynamicValidatorCtrl.addToValidateTogetherGroup("dce");
            };

            $scope.removeFromValidateTogetherGroup = () => {
                $dynamicValidatorCtrl.removeFromValidateTogetherGroup("dce");
            };

            $scope.isPartOfVTGroup = ():boolean => {
                return _($dynamicValidatorCtrl.getOptionsProp("_validateTogetherGroups")).contains('dce');
            }

            //Add / remove from requestGroup
            $scope.addToRequestGroup = (): void => {
                $dynamicValidatorCtrl.addRequestGroup('dcerg');
            }

            $scope.removeFromRequestGroup = (): void => {
                $dynamicValidatorCtrl.removeRequestGroup('dcerg');
            }

            $scope.isPartOfRequestGroup = (): boolean => {
                return _($dynamicValidatorCtrl.getOptionsProp("_validateRequestGroups")).contains('dcerg');
            };

            //Add / remove validators
            $scope.addMinLengthValidator = (): void => {
                $dynamicValidatorCtrl.addValidator('default', validators.minLength(5));
            };

            $scope.removeMinLengthValidator = (): void => {
                $dynamicValidatorCtrl.removeValidatorByName('default', 'minLength');
            };

            $scope.hasMinLengthValidator = (): boolean => {
                return _($dynamicValidatorCtrl.getOptionsProp('validators').default)
                    .any((validatorCtrl: IValidatorFnCtrl) => {
                        return validatorCtrl.name == 'minLength';
                });
            }; 
        }
    };

    return directive;
}]);




