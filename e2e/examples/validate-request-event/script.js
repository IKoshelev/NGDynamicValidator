/// <reference path="../../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../../src/Interfaces.ts" />
/// <reference path="../demoapp.ts" />
demoApp.controller("ValidateRequestEventCtrl", [
    "$scope", "validationEventNames",
    function ($scope, eventNames) {
        $scope.passport;
        $scope.foreignPassport;
        $scope.driversLicense;

        $scope.idDocumentRequired = function idDocumentRequired(value, validationInfo) {
            return $scope.passport || $scope.foreignPassport || $scope.driversLicense;
        };

        $scope.saveDraft = function () {
            $scope.message = "";
            $scope.error = "";

            //Parameters are:
            //Angular event name - "VALIDATE_REQUEST"
            //Event types that need to be validated
            //ValidateTogetherGroups, that need to be validated
            $scope.$broadcast(eventNames.validateRequest, ["default", "blur", "$beforeSaveDraft"], ["vre"]);

            if ($scope.form.$invalidEventsSummary.default || $scope.form.$invalidEventsSummary.blur || $scope.form.$invalidEventsSummary.$beforeSaveDraft) {
                $scope.error = "Can't save draft - something is invalid";
            } else {
                $scope.message = "Saved draft OK.";
            }
        };

        $scope.saveFinal = function () {
            $scope.message = "";
            $scope.error = "";

            //Notice, that ValidateTogetherGroups names are not passed - in this case, all inputs, whose scopes get the event, will participate
            $scope.$broadcast(eventNames.validateRequest, ["default", "blur", "$beforeSaveFinal"]);

            if ($scope.form.$invalid) {
                $scope.error = "Can't save - something is invalid";
            } else {
                $scope.message = "Saved OK.";
            }
        };
    }]);
//# sourceMappingURL=script.js.map
