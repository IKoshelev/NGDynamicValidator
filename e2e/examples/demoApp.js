/// <reference path="../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../src/typings/jquery/jquery.d.ts" />

var demoApp = angular.module("DemoApp", ["NGDynamicValidator", "ui.bootstrap"]);

demoApp.directive('ngBindCode', [
    '$parse', '$http', function ($parse, $http) {
        var directive = {
            link: function ($scope, $elem, $attr) {
                var url = $parse($attr['ngBindCode'])($scope);

                var isJs = url.slice(-2) == 'js';

                $http.get(url).success(function (content) {
                    content.trim();

                    while (content.substr(0, 3) == "///") {
                        content = content.slice(content.indexOf('/>') + 2).trim();
                    }

                    if (!isJs) {
                        content = _.escape(content);
                    }

                    var div = document.createElement('div');
                    div.innerHTML = '<pre ng-non-bindable ><code data-language="' + (isJs ? 'javascript' : 'html') + '">' + content + '</code></pre>';

                    //Rainbow.color(div, () => {
                    $elem.append(div);
                    //});
                }).error(function (error) {
                    console.log("couldn't load " + url);
                });
            }
        };

        return directive;
    }]);

demoApp.controller("ExamplesController", [
    "$scope", function ($scope) {
        //Codes can't have more then 2 'a' letters
        $scope.aValidator = function max2AOccurence(value) {
            if (value) {
                var matches = value.match(/a/g);
                var matchesCount = matches ? matches.length : 0;
            }
            return !value || matchesCount < 3;
        };

        $scope.requestValidate = function () {
            $scope.$broadcast('VALIDATE_REQUEST', ["$beforeSend"]);
        };

        $scope.examples = [
            {
                name: "Validator initalization",
                scriptUrl: "examples/options/script.js",
                exampleUrl: "examples/options/example.html",
                descriptionUrl: "examples/options/description.html",
                specUrl: "specs/options.spec.js",
                plunkerUrl: ""
            },
            {
                name: "Triggering validation for different event combinations with angular events",
                scriptUrl: "examples/validate-request-event/script.js",
                exampleUrl: "examples/validate-request-event/example.html",
                descriptionUrl: "examples/validate-request-event/description.html",
                specUrl: "specs/validate-request-event.spec.js",
                plunkerUrl: ""
            },
            {
                name: "'ValidateTogetherGroups'",
                scriptUrl: "examples/validate-together-groups/script.js",
                exampleUrl: "examples/validate-together-groups/example.html",
                descriptionUrl: "examples/validate-together-groups/description.html",
                specUrl: "specs/validate-together-groups.spec.js",
                plunkerUrl: ""
            },
            {
                name: "'Excluded non-valids behaviour'",
                scriptUrl: "",
                exampleUrl: "examples/excluded-non-valids-behaviour/example.html",
                descriptionUrl: "examples/excluded-non-valids-behaviour/description.html",
                specUrl: "specs/excluded-non-valids-behaviour.spec.js",
                plunkerUrl: ""
            },
            {
                name: "Built in validator functions and passing values to them",
                scriptUrl: "examples/passing-values-to-built-in-validators/script.js",
                exampleUrl: "examples/passing-values-to-built-in-validators/example.html",
                descriptionUrl: "examples/passing-values-to-built-in-validators/description.html",
                specUrl: "specs/passing-values-to-built-in-validators.spec.js",
                plunkerUrl: ""
            },
            {
                name: "Adding custom validator function to validators service",
                scriptUrl: "examples/extend-validators-service/script.js",
                exampleUrl: "examples/extend-validators-service/example.html",
                descriptionUrl: "examples/extend-validators-service/description.html",
                specUrl: "specs/extend-validators-service.spec.js",
                plunkerUrl: ""
            },
            {
                name: "Controlling NGDynamicValidator from another directive",
                scriptUrl: "examples/directive-controller/script.js",
                exampleUrl: "examples/directive-controller/example.html",
                descriptionUrl: "examples/directive-controller/description.html",
                specUrl: "specs/directive-controller.spec.js",
                plunkerUrl: ""
            }
        ];

        _($scope.examples).each(function (example) {
            example.tabs = [];
            if (example.exampleUrl)
                example.tabs.push({ name: 'Markup', url: example.exampleUrl });
            if (example.scriptUrl)
                example.tabs.push({ name: 'JavaScript', url: example.scriptUrl });
            if (example.specUrl)
                example.tabs.push({ name: 'Spec', url: example.specUrl });
        });
    }]);
//# sourceMappingURL=demoApp.js.map
