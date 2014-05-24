/// <reference path="../../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../../src/Interfaces.ts" />
/// <reference path="../demoapp.ts" />

demoApp.controller("ValidateTogetherGroupsCtrl",
    ["$scope",
        function ($scope) {

            $scope.componentA;
            $scope.componentB;

            $scope.componentsNotQeual = function componentsNotQeual() {
                return !$scope.componentA
                    || !$scope.componentB
                    || $scope.componentA != $scope.componentB;
            };
        }]);

demoApp.controller("ValidateTogetherBehaviourCtrl",
    ["$scope", "$rootScope", "validationEventNames",
        function ($scope, $rootScope: ng.IRootScopeService, eventNames:IEventNames) {

            $scope.loggingMaxLength = function (maxLengthVal, componentName) {
                var counterName = componentName + 'ValidationCounter';
                $scope[counterName] = 0;
                return function maxLength(value) {
                    $scope[counterName] += 1;
                    return !value || value.length <= maxLengthVal;
                };
            };

            $scope.triggerValidationOfVtgValidateTogetherBehaviourGroup = function () {
                $rootScope.$broadcast(eventNames.validateRequest, ["default"], []);
            };
 }]);




