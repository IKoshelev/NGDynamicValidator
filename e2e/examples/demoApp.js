/// <reference path="../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../src/typings/jquery/jquery.d.ts" />
var demoApp = angular.module("DemoApp", ["NGDynamicValidator"]);

demoApp.controller("ExamplesController", [
    "$scope", function ($scope) {
        $scope.examples = [
            {
                name: "Validator initalization",
                scriptUrl: "examples/options/script.js",
                examplleUrl: "examples/options/example.html",
                descriptionUrl: "examples/eoptions/description.html",
                specUrl: "specs/options.spec.js",
                plunkerUrl: " "
            },
            {
                name: "Triggering validation for different event combinations with angular events",
                scriptUrl: "examples/validate-request-event/script.js",
                examplleUrl: "examples/validate-request-event/example.html",
                descriptionUrl: "examples/validate-request-event/description.html",
                specUrl: "specs/validate-request-event.spec.js",
                plunkerUrl: " "
            },
            {
                name: "'ValidateTogetherGroups'",
                scriptUrl: "examples/validate-together-groups/script.js",
                examplleUrl: "examples/validate-together-groups/example.html",
                descriptionUrl: "examples/validate-together-groups/description.html",
                specUrl: "specs/validate-together-groups.spec.js",
                plunkerUrl: " "
            },
            {
                name: "'Excluded non-valids behaviour'",
                scriptUrl: "",
                examplleUrl: "examples/excluded-non-valids-behaviour/example.html",
                descriptionUrl: "examples/excluded-non-valids-behaviour/description.html",
                specUrl: "specs/excluded-non-valids-behaviour.spec.js",
                plunkerUrl: " "
            },
            {
                name: "Passing values to built in valitor functions",
                scriptUrl: "examples/passing-values-to-built-in-validators/script.js",
                examplleUrl: "examples/passing-values-to-built-in-validators/example.html",
                descriptionUrl: "examples/passing-values-to-built-in-validators/description.html",
                specUrl: "specs/passing-values-to-built-in-validators.spec.js",
                plunkerUrl: " "
            },
            {
                name: "Adding custom validator function to validators service",
                scriptUrl: "examples/extend-validators-service/script.js",
                examplleUrl: "examples/extend-validators-service/example.html",
                descriptionUrl: "examples/extend-validators-service/description.html",
                specUrl: "specs/extend-validators-service.spec.js",
                plunkerUrl: " "
            },
            {
                name: "Controlling NGDynamicValidator from another directive",
                scriptUrl: "examples/directive-controller/script.js",
                examplleUrl: "examples/directive-controller/example.html",
                descriptionUrl: "examples/directive-controller/description.html",
                specUrl: "specs/directive-controller.spec.js",
                plunkerUrl: " "
            }
        ];
    }]);
//# sourceMappingURL=demoApp.js.map
