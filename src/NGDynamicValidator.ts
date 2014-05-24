/// <reference path="typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="typings/underscore/underscore.d.ts" />
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="ValidatorsProvider.ts" />
/// <reference path="interfaces.ts" />

class NGDynamicValidatorCtrl {

    //Describes behaviours of validators that were invalid during previous validation
    //when a new validation occurs, that does not include them
    //Example: 
    //User pushes "send" button, "$beforeSend" validation is requested and one of the fields becomes invalid.
    //User focuses the field and starts input to correct it, that would normally trigger the "default" validator, but not "$beforeSend".
    //With "setValid" option you can reset validity of all such validators, since they will be validated again with next "send" button push.
    //With "validate" option you can make the validator trigger on each validation, even when it would not ordinarily, thus leaving the field invalid untill the user actually corrects it. 
    public static excludedNonValidsBehaviours: IExcludedNonValidsBehaviours = {
        validate: "validate",
        doNothing: "doNothing",
        setValid: "setValid"
    };

    public static validateTogetherGroupsBehaviours: IValidateTogetherGroupsBehaviour = {
        onlyTrigger: "onlyTrigger",
        afterFirst: "afterFirst",
        afterEach: "afterEach"
    };

    public static validationEventNames: IEventNames = {
        validateRequest: "VALIDATE_REQUEST"
    };

    private static reservedEventNames = ["default"];
	private static reservedConfigPropertyNamesWithDirectAccess = ["_excludedNonValids", "_validateTogetherGroupsBehaviour"];
	private static reservedConfigPropertyNamesWithoutDirectAccess = ["_validateRequestGroups", "_validateTogetherGroups"];
    private static reservedConfigPropertyNames = _(NGDynamicValidatorCtrl.reservedConfigPropertyNamesWithDirectAccess)
                                                    .union(NGDynamicValidatorCtrl.reservedConfigPropertyNamesWithoutDirectAccess);

    private static blankValidationTrigger: IValidationTrigger = {
        isJSEvent: false,
        isAngularEvent: false,
        isDefaultEvent: false,
        eventNames: [],
        requestGroupNames: [],
        isValidatingTogether: false,
    };

    private static defaultValidationTrigger: IValidationTrigger = Object.freeze({
        isJSEvent: false,
        isAngularEvent: false,
        isDefaultEvent: true,
        eventNames: Object.freeze(["default"]),
        requestGroupNames: Object.freeze([]),
        isValidatingTogether: false
    });

    private static defaultOptions: IDynamicValidatorOptions = {
        excludedNonValids: NGDynamicValidatorCtrl.excludedNonValidsBehaviours.validate,
        validateRequestGroups: <string[]>[],
        validateTogetherGroups: <string[]>[],
        validateTogetherGroupsBehaviour: NGDynamicValidatorCtrl.validateTogetherGroupsBehaviours.afterFirst,
        validators: {},
        jsEvents: <string[]>[],
        angularEvents: <string[]>[],
        currentValidationTrigger: NGDynamicValidatorCtrl.defaultValidationTrigger,
        ngModel: null,
        ngForm: null
    };

    private static validateTogetherGroupsReigstry = {
        //Circular group membership infinit loop prevention
        _groupsAlreadyValidatedDuringThisTrigger: []
    };

    private static addMemberToValidateTogetherGroup(member: IValidateTogetherGroupMember) {

        //if first member of that group
        if (!NGDynamicValidatorCtrl.validateTogetherGroupsReigstry[member.name]) {
            NGDynamicValidatorCtrl.validateTogetherGroupsReigstry[member.name] = [];
        }

        NGDynamicValidatorCtrl.validateTogetherGroupsReigstry[member.name].push(member);
    }

    //Will cascade:
    //Validation group with inputs(a, b, c) will trigger group (c,d,e), which will trigger (e,f,g))
    //Also, keeps track to precent endless loops from validation like (a,b,c) => (c,d,a) => (a,b,c)...
    private static triggerValidateTogetherGroup(groupName: string, originalTrigger: IValidationTrigger) {
        console.log("Validation group trigger for " + groupName);
        if (_(NGDynamicValidatorCtrl.validateTogetherGroupsReigstry._groupsAlreadyValidatedDuringThisTrigger)
            .contains(groupName)) return;

        NGDynamicValidatorCtrl.validateTogetherGroupsReigstry._groupsAlreadyValidatedDuringThisTrigger.push(groupName);

        var groupMembers = <IValidateTogetherGroupMember[]>NGDynamicValidatorCtrl.validateTogetherGroupsReigstry[groupName];

        var newTrigger = <IValidationTrigger>angular.extend({}, originalTrigger);
        newTrigger.isValidatingTogether = true;
        Object.freeze(newTrigger);

        _(groupMembers).each((groupMember) => {
            //don't valdiate
            if (groupMember.options.validateTogetherGroupsBehaviour == NGDynamicValidatorCtrl.validateTogetherGroupsBehaviours.onlyTrigger
                || groupMember.options.validateTogetherGroupsBehaviour == NGDynamicValidatorCtrl.validateTogetherGroupsBehaviours.afterFirst && groupMember.hasValidatedDuringThisEvent) {
                return;
            }

            var oldTrigger = groupMember.options.currentValidationTrigger;
            groupMember.options.currentValidationTrigger = newTrigger;
            groupMember.options.ngModel.$setViewValue(groupMember.options.ngModel.$viewValue);
            groupMember.options.currentValidationTrigger = oldTrigger;

            groupMember.hasValidatedDuringThisEvent = true;
        });

        NGDynamicValidatorCtrl.validateTogetherGroupsReigstry._groupsAlreadyValidatedDuringThisTrigger =
        _(NGDynamicValidatorCtrl.validateTogetherGroupsReigstry._groupsAlreadyValidatedDuringThisTrigger).without(groupName);

        //Not a mistake, can be normal timeout;
        setTimeout(() => {
            _(groupMembers).each((groupMember) => { groupMember.hasValidatedDuringThisEvent = false; });
        });
    }

    private options: IDynamicValidatorOptions;

    private copyConfigPropertiesFromReceivedOptions(receivedOptions) {
        _(NGDynamicValidatorCtrl.reservedConfigPropertyNames).each((key) => {
            var optKey = key.slice(1);//remove initial slash
            this.options[optKey] = receivedOptions[key] || this.options[optKey];
        });
	}

	private addJSEventHandler(eventName: string) {

		if (_(this.options.jsEvents).contains(eventName)) {
			//Event already wired up
			return;
		}

		this.options.jsEvents.push(eventName);

		this.$elem.on(eventName, (event) => {
			this.$scope.$apply(() => {
				var trigger: IValidationTrigger = angular.copy(NGDynamicValidatorCtrl.blankValidationTrigger);
				trigger.eventNames = Object.freeze([eventName]);
				trigger.requestGroupNames = Object.freeze([]);
				trigger.isJSEvent = true;
				Object.freeze(trigger);

				this.universalEventHandler(trigger);
			});
		});
	}

	private addAngularEventHandler(eventName: string) {
		if (!this.options.angularEvents[eventName]) {
			this.options.angularEvents.push(eventName);
		}
	}

    private angularValidationRequestHandler = (angularEvent: ng.IAngularEvent, eventNames: any, requestGroupNames: any) => {

		var normalizedEventNames: string[] = angular.isArray(eventNames)
			? eventNames
			: (<string>(eventNames || "")).split(" ");

		var normalizedRequestGroupNames: string[] = angular.isArray(requestGroupNames)
			? requestGroupNames
			: (<string>(requestGroupNames || "")).split(" ");

		//If no request groups were specified or this DynamicValidator belong to any of the requested groups - validate;
		if (!requestGroupNames
			|| requestGroupNames.length == 0
			|| _(normalizedRequestGroupNames).intersection(this.options.validateRequestGroups).length > 0) {

			var trigger: IValidationTrigger = angular.copy(NGDynamicValidatorCtrl.blankValidationTrigger);
			trigger.eventNames = Object.freeze(normalizedEventNames);
			trigger.requestGroupNames = Object.freeze(normalizedRequestGroupNames);
			trigger.isAngularEvent = true;
			Object.freeze(trigger);

			this.universalEventHandler(trigger);
		}
	}

    private universalEventHandler(trigger: IValidationTrigger): void {

		console.log("universal handler enter");

		//save previous state and switch it to requested events
		this.options.currentValidationTrigger = trigger;

		this.options.ngModel.$setViewValue(this.options.ngModel.$viewValue);

		this.options.currentValidationTrigger = NGDynamicValidatorCtrl.defaultValidationTrigger;

		_(this.options.validateTogetherGroups).each((groupName) => {
			NGDynamicValidatorCtrl.triggerValidateTogetherGroup(groupName, trigger);
		});
		console.log("universal handler exit");
	}

	private dynamicValidationFormatter(value) {
		console.log(JSON.stringify(this.options.currentValidationTrigger));

		var validatedValueBuffer = value;

		//Each key / value of this object will be used to ngModelCtrl.$setValidity(key,value);
		//Each key is the name of the validator function (as in function name(value){...},
		//each value is its result for current input value
		//If several functions will have the same name, the resulting key in validationSummary
		//will only be true if all of them return true
		var validationSummary = {};

		//Object shared between each IValidationInfo passed to validators, in case they need to communicate
		var communicationBag = {};

		var processValidator = (validator: IValidatorFnCtrl, included: boolean) => {

			var validationResult: any;

			if (included ||
				(!validator.currentState && this.options.excludedNonValids == NGDynamicValidatorCtrl.excludedNonValidsBehaviours.validate)) {
				//validate
				var validationInfo: IValidationInfo = {
					trigger: this.options.currentValidationTrigger,
					isIncludedInTrigger: included,
					currentState: validator.currentState,
					communicationBag: communicationBag
				}

                        validationResult = validator.validatorFn(value, validationInfo);

			} else if (!validator.currentState
				&& this.options.excludedNonValids == NGDynamicValidatorCtrl.excludedNonValidsBehaviours.setValid) {
				//set valid
				validationResult = true;
			} else {
				//the "do notghing" behaviour
				validationResult = validator.currentState;
			}

			//Validation result can be either bool or IValidationResult (if you also need to modify the value)
			var validationResultIsObject = _(validationResult).isObject();

			validator.currentState = validationResultIsObject
			? (<IValidationResult>validationResult).isValid
			: validationResult;

			if (validationResultIsObject) {
				validatedValueBuffer = (<IValidationResult>validationResult).modifiedValue;
			}


			if (_(validationSummary).has(validator.name)
				&& !validationSummary[validator.name]) {
				return; //A single negative result makes the whole key invalid, so negative keys will never be set positive
			} else {
				validationSummary[validator.name] = validator.currentState;
            }

            return validator.currentState;
		}

        var processKey = (key: string, included: boolean) => {

            //Will be false if at least one validator for this key (event name) returns false
            var overallValidityForKey = true;

            _(this.options.validators[key])
                .each((validator: IValidatorFnCtrl) => {
                    var isValid = processValidator(validator, included);
                    if (!isValid) overallValidityForKey = false;
                });

            this.options.ngModel.$invalidEventsSummary[key] = !overallValidityForKey;

            //If there is no form to report to - return
            if (!this.options.ngForm) return;

           
            if (!overallValidityForKey) {
                 //report this event as invalid to parent form
                if (!_(this.options.ngForm.$invalidEventsSummary[key]).isArray()) {
                    this.options.ngForm.$invalidEventsSummary[key] = [this.options.ngModel];
                } else if (_(this.options.ngForm.$invalidEventsSummary[key]).contains(this.options.ngModel)) {
                    return;
                } else {
                    this.options.ngForm.$invalidEventsSummary[key].push(this.options.ngModel);
                }

            } else {
                //remove this event from invalids on parent form
                if (!_(this.options.ngForm.$invalidEventsSummary[key]).isArray()) {
                    return;
                } else {
                    this.options.ngForm.$invalidEventsSummary[key] = _(this.options.ngForm.$invalidEventsSummary[key])
                        .without(this.options.ngModel);
                    if (this.options.ngForm.$invalidEventsSummary[key].length == 0) {
                        this.options.ngForm.$invalidEventsSummary[key] = false;
                    }
                }

            }
        }

        //validation for requested events
        _(this.options.validators).chain().keys()
            .intersection(this.options.currentValidationTrigger.eventNames)
            .each((key) => {
                processKey(key, true);
            });

		//validation for events not included in request
		_(this.options.validators).chain().keys()
			.difference(this.options.currentValidationTrigger.eventNames)
            .each((key) => {
                processKey(key, false);
            });


		//validity is set
		_(validationSummary).chain().keys().each((key) => {
			this.options.ngModel.$setValidity(key, validationSummary[key]);
		});

        var triggerValidationGroups = () => {
            _(this.options.validateTogetherGroups).each((groupName) => {
                NGDynamicValidatorCtrl.triggerValidateTogetherGroup(groupName, this.options.currentValidationTrigger);
            })
        };

        if (this.options.currentValidationTrigger.isDefaultEvent && !this.options.currentValidationTrigger.isValidatingTogether) {
            //Validate together group validators usually expect model to already contain state passed from view.
            //There is one case, when that value has not yet been passed - the default input event of the ngModel (as identified by currentValidationTrigger.isDefaultEvent)
            //It is the only case, for which the view would contain changes not yet propogated to the model by the time dynamicValidationFormatter fires,
            //but since such an event can only be launched by ng-mode itself (through its events wiring) and not by ng-dynamic-validator, we can wrap that case in a $timeout
            //And let the validators work async (there can be no code relying on form validity exactly after $setViewValue returns, since it isn't our code calling it).
            this.$timeout(triggerValidationGroups);          
        } else {
            triggerValidationGroups();
        }

		return validatedValueBuffer;
	}

    public setModelAndFormCtrl(ngModel: ng.INgModelController, ngForm: INgFormExtended ) {
        if (this.options.ngModel || this.options.ngForm) throw new Error("ngModel or form has already been set");

		this.options.ngModel = <INgModelExtended>ngModel;
        ngModel.$parsers.push((value) => { return this.dynamicValidationFormatter(value); });

        //Overal validation state of different events is kept here
        this.options.ngModel.$invalidEventsSummary = {};

        this.options.ngForm = ngForm; //|| <INgFormExtended>{};

        if (this.options.ngForm) {
            this.options.ngForm.$invalidEventsSummary = {};
        }

	}

    public getOptionsProp(propName: string) {
        if (propName[0] == "_") {
            propName = propName.slice(1);
        }

        return this.options[propName];
    }

    public setOptionsProp(propName:string, newValue:any) {
        if (propName[0] != "_") {
            propName = "_" + propName;
        }

        if (!_(NGDynamicValidatorCtrl.reservedConfigPropertyNamesWithDirectAccess).contains(propName)) {
            throw new Error("Attempting to set options prop, which can not be set directly;");
        }

        this.options[propName.slice(1)] = newValue;
	}

	public addToValidateTogetherGroup(groupName: string) {
		if (_(this.options.validateTogetherGroups).contains(groupName)) return;

		this.options.validateTogetherGroups.push(groupName);

		NGDynamicValidatorCtrl.addMemberToValidateTogetherGroup({
			name: groupName,
			options: this.options,
			hasValidatedDuringThisEvent: false
		});
	}

	public removeFromValidateTogetherGroup(groupName: string) {
		if (!_(this.options.validateTogetherGroups).contains(groupName)) return;

		this.options.validateTogetherGroups = _(this.options.validateTogetherGroups).without(groupName);

		NGDynamicValidatorCtrl[groupName] = _(NGDynamicValidatorCtrl[groupName]).filter((validationGroupMember) => {
			return validationGroupMember.options !== this.options;
		});
	}

	public addRequestGroup(groupName: string) {
		this.options.validateRequestGroups.push(groupName);
	}

	public removeRequestGroup(groupName: string) {
		this.options.validateRequestGroups = _(this.options.validateRequestGroups).without(groupName);
	}

    public addValidator(eventName: string, validator: any) {

        if (_(validator).isArray()) {
            _(validator).each((validator) => {
                this.addValidator(eventName, validator);
            });
            return;
        }

        if (!_(validator).isFunction()) throw new Error("Wrong object passed as validator. Must be function or function array");

        if (!validator.name) throw new Error("One of the validator functions has no name. All validator functions must follow this signature : " +
            "'function someName(value){ ...validation... return {isValid : true | false, modifiedValue:{} }'" +
            "Offending function is " + validator.toString());

        var validatorCtrl: IValidatorFnCtrl = {
            validatorFn: validator,
            name: validator.name,
            currentState: true
        };

        //If this is the first validator for that event
        if (!this.options.validators[eventName]) {
            this.options.validators[eventName] = <IValidatorFnCtrl[]>[];
        }

        this.options.validators[eventName].push(validatorCtrl);

        if (_(NGDynamicValidatorCtrl.reservedEventNames).contains(eventName)) {
            //reserved event - do nothing
        } else if (eventName[0] == "$") {
            //Angular event
            this.addAngularEventHandler(eventName);
        } else {
            //js Event
            this.addJSEventHandler(eventName);
        }
    }

    public removeValidator(eventName: string, validatorFn: any) {

        if (_(validatorFn).isArray()) {
            _(validatorFn).each((validator) => {
                this.removeValidator(eventName, validator);
            });
            return;
        }

        this.options.validators[eventName] = _(this.options.validators[eventName])
                                                .filter((validatorFnCtrl: IValidatorFnCtrl) => {
                                                    return validatorFnCtrl.validatorFn !== validatorFn;
                                                });

        this.cleanupAfterValidatorRemoval(validatorFn.name);

        this.options.ngModel.$setViewValue(this.options.ngModel.$viewValue);

        //todo add cleanup for for handlers of events where no validators left?
    }

    public removeValidatorByName(eventName: string, validatorFnName: string) {

        if (_(validatorFnName).isArray()) {
            _(validatorFnName).each((validatorFnName) => {
                this.removeValidatorByName(eventName, validatorFnName);
            });
            return;
        }

        this.options.validators[eventName] = _(this.options.validators[eventName])
            .filter((validatorFnCtrl: IValidatorFnCtrl) => {
                return validatorFnCtrl.name !== validatorFnName;
            });

        this.cleanupAfterValidatorRemoval(validatorFnName);

        this.options.ngModel.$setViewValue(this.options.ngModel.$viewValue);

        //todo add cleanup for for handlers of events where no validators left?
    }

    private cleanupAfterValidatorRemoval(validatorFnName: string) {
        var cleanupNotNeeded =
            _(this.options.validators)
            .chain()
            .values()
            .flatten()
            .map((validatorCtrl: IValidatorFnCtrl) => { return validatorCtrl.name; })
            .contains(validatorFnName)
                .value();

        if (cleanupNotNeeded) return;

        this.options.ngModel.$setValidity(validatorFnName, true);
    }

    private static $inject = ["$scope", "$element", "$attrs", "$rootScope","$timeout", "$parse", "validators"];
    constructor(private $scope: IDynamicValidatorScope, private $elem: ng.IAugmentedJQuery, $attr: ng.IAttributes,
        private $rootScope: ng.IRootScopeService, private $timeout:ng.ITimeoutService, private $parse: ng.IParseService, private validatorsSrv: IValidatorsService) {

        console.log("Validator ctrl init");

        this.options = angular.copy(NGDynamicValidatorCtrl.defaultOptions);

        var receivedOptionsString: string = $attr["ngDynamicValidator"];
        if (!receivedOptionsString) throw new Error("ngDynamicValidator requires options.");
        var receivedOptions = $parse(receivedOptionsString)($scope, validatorsSrv);

        this.copyConfigPropertiesFromReceivedOptions(receivedOptions);

        //Register in validate together groups
        _(this.options.validateTogetherGroups).each((groupName) => {
            NGDynamicValidatorCtrl.addMemberToValidateTogetherGroup({
                name: groupName,
                options: this.options,
                hasValidatedDuringThisEvent: true
            });
        });

        //Exclude all reservedEventNames and reservedPropertyNames from the receivedOptions,
        //normalize all event handlers and sort their names into arrays.
        //Events starting with '$' go into options.angularEvents,
        //Others go into options.jsEvents
        _(receivedOptions).chain().keys()
            .difference(NGDynamicValidatorCtrl.reservedConfigPropertyNames)
            .each((key) => {
                this.addValidator(key, receivedOptions[key]);
            });

        //Attach adapter for angular validation request to universal validationRequest handler
        $scope.$on(NGDynamicValidatorCtrl.validationEventNames.validateRequest, this.angularValidationRequestHandler);
    }
}

valdiatorModule.constant("excludedNonValidsBehaviours", NGDynamicValidatorCtrl.excludedNonValidsBehaviours);

valdiatorModule.constant("validateTogetherGroupsBehaviours", NGDynamicValidatorCtrl.validateTogetherGroupsBehaviours);

valdiatorModule.constant("validationEventNames", NGDynamicValidatorCtrl.validationEventNames);

valdiatorModule.directive("ngDynamicValidator", [function () {

        var directive: ng.IDirective = {
            require: ["ngModel","^?form","ngDynamicValidator"],
            controller: NGDynamicValidatorCtrl,
            link: function ($scope: IDynamicValidatorScope, $elem: ng.IAugmentedJQuery, $attr: ng.IAttributes, controllers) {
                controllers[2].setModelAndFormCtrl(controllers[0],controllers[1]);
            }
        };

        return directive;
    }]);

