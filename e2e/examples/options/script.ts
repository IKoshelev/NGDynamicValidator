/// <reference path="../../../src/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../src/typings/underscore/underscore.d.ts" />
/// <reference path="../../../src/typings/angularjs/angular.d.ts" />
/// <reference path="../../../src/typings/jquery/jquery.d.ts" />
/// <reference path="../../../src/Interfaces.ts" />
/// <reference path="../demoapp.ts" />

(<ng.IModule>demoApp).controller("OptionsCtrl", ["$scope","$rootScope" ,"validators", "validationEventNames" , "validateTogetherGroupsBehaviours", "excludedNonValidsBehaviours",
	function ($scope: any, $rootScope: ng.IRootScopeService, validators: IValidatorsService, validatorEventNames: IEventNames ,validateTogetherBeh: IValidateTogetherGroupsBehaviour, excludedNonValidsBeh:IExcludedNonValidsBehaviours) {

		function max2AOccurence(value: string) {						
			if (value) {
				var matches = value.match(/a/g);
				var matchesCount = matches ? matches.length : 0;
			}
			return !value || matchesCount < 3;
		};

		$scope.optionsObj = {
			//Config options
			_validateTogetherGroups: ["options-group"],
			_validateRequestGroups: ["options"],
			_excludedNonValids: excludedNonValidsBeh.validate,					//"validate" - default
            _validateTogetherGroupsBehaviour: validateTogetherBeh.afterFirst,	//"afterFirst" - default

			//Validators
			default: max2AOccurence,											
			blur: [validators.minLength(3)],
			$beforeSend: validators.maxLength(5)
		};

		//attach custom validator function to scope to expose it for inline options construction
		$scope.aValidator = max2AOccurence;


		$scope.requestValidate = function () {
			//Parameters are: 
			//"VALIDATE_REQUEST" - identifier of all requests for validation
			//["$beforeSend"] - string or array of strings with event names to validate
			//["options"] - request groups that must respond to this events. If nothing or an empty array is sent - all NGDynamic validatos will react
			$rootScope.$broadcast(validatorEventNames.validateRequest, ["$beforeSend"], ["options"]);
		};
}]);




