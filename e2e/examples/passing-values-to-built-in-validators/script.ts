/// <reference path="../../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../../src/Interfaces.ts" />
/// <reference path="../demoapp.ts" />

demoApp.controller("PassingValuesToBuiltInValidatorsCtrl", ["$scope",function ($scope) {
    $scope.value = 3;

    $scope.valueObj = { value: 3 };

    $scope.$watch("valueObj.value", () => {
        $scope.$broadcast("VALIDATE_REQUEST",["default"]);
    });

    //Alternative way to implement valueObj without $watch, but still triggering validation on change:
    //$scope.valueObj = {
    //    _value: 3,
    //    get value() {
    //        return this._value;
    //    },
    //    set value(newVal) {
    //        this._value = newVal;
    //        $scope.$broadcast("VALIDATE_REQUEST", ["default"]);
    //    }
    //};

    $scope.valueProviderFn = function () {
        return $scope.valueObj.value;
    }
}]);