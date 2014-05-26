/// <reference path="typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="typings/underscore/underscore.d.ts" />
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="ValidatorsProvider.ts" />
/// <reference path="interfaces.ts" />
var NGDynamicValidatorCtrl = (function () {
    function NGDynamicValidatorCtrl($scope, $elem, $attr, $rootScope, $timeout, $parse, validatorsSrv) {
        var _this = this;
        this.$scope = $scope;
        this.$elem = $elem;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.$parse = $parse;
        this.validatorsSrv = validatorsSrv;
        this.angularValidationRequestHandler = function (angularEvent, eventNames, requestGroupNames) {
            var normalizedEventNames = angular.isArray(eventNames) ? eventNames : (eventNames || "").split(" ");

            var normalizedRequestGroupNames = angular.isArray(requestGroupNames) ? requestGroupNames : (requestGroupNames || "").split(" ");

            //If no request groups were specified or this DynamicValidator belong to any of the requested groups - validate;
            if (!requestGroupNames || requestGroupNames.length == 0 || _(normalizedRequestGroupNames).intersection(_this.options.validateRequestGroups).length > 0) {
                var trigger = angular.copy(NGDynamicValidatorCtrl.blankValidationTrigger);
                trigger.eventNames = Object.freeze(normalizedEventNames);
                trigger.requestGroupNames = Object.freeze(normalizedRequestGroupNames);
                trigger.isAngularEvent = true;
                Object.freeze(trigger);

                _this.universalEventHandler(trigger);
            }
        };
        //console.log("Validator ctrl init");
        this.options = angular.copy(NGDynamicValidatorCtrl.defaultOptions);

        var receivedOptionsString = $attr["ngDynamicValidator"];
        if (!receivedOptionsString)
            throw new Error("ngDynamicValidator requires options.");
        var receivedOptions = $parse(receivedOptionsString)($scope, validatorsSrv);

        this.copyConfigPropertiesFromReceivedOptions(receivedOptions);

        //Register in validate together groups
        _(this.options.validateTogetherGroups).each(function (groupName) {
            NGDynamicValidatorCtrl.addMemberToValidateTogetherGroup({
                name: groupName,
                options: _this.options,
                hasValidatedDuringThisEvent: true
            });
        });

        //Exclude all reservedEventNames and reservedPropertyNames from the receivedOptions,
        //normalize all event handlers and sort their names into arrays.
        //Events starting with '$' go into options.angularEvents,
        //Others go into options.jsEvents
        _(receivedOptions).chain().keys().difference(NGDynamicValidatorCtrl.reservedConfigPropertyNames).each(function (key) {
            _this.addValidator(key, receivedOptions[key]);
        });

        //Attach adapter for angular validation request to universal validationRequest handler
        $scope.$on(NGDynamicValidatorCtrl.validationEventNames.validateRequest, this.angularValidationRequestHandler);
    }
    NGDynamicValidatorCtrl.addMemberToValidateTogetherGroup = function (member) {
        //if first member of that group
        if (!NGDynamicValidatorCtrl.validateTogetherGroupsReigstry[member.name]) {
            NGDynamicValidatorCtrl.validateTogetherGroupsReigstry[member.name] = [];
        }

        NGDynamicValidatorCtrl.validateTogetherGroupsReigstry[member.name].push(member);
    };

    //Will cascade:
    //Validation group with inputs(a, b, c) will trigger group (c,d,e), which will trigger (e,f,g))
    //Also, keeps track to precent endless loops from validation like (a,b,c) => (c,d,a) => (a,b,c)...
    NGDynamicValidatorCtrl.triggerValidateTogetherGroup = function (groupName, originalTrigger) {
        //console.log("Validation group trigger for " + groupName);
        if (_(NGDynamicValidatorCtrl.validateTogetherGroupsReigstry._groupsAlreadyValidatedDuringThisTrigger).contains(groupName))
            return;

        NGDynamicValidatorCtrl.validateTogetherGroupsReigstry._groupsAlreadyValidatedDuringThisTrigger.push(groupName);

        var groupMembers = NGDynamicValidatorCtrl.validateTogetherGroupsReigstry[groupName];

        var newTrigger = angular.extend({}, originalTrigger);
        newTrigger.isValidatingTogether = true;
        Object.freeze(newTrigger);

        _(groupMembers).each(function (groupMember) {
            //don't valdiate
            if (groupMember.options.validateTogetherGroupsBehaviour == NGDynamicValidatorCtrl.validateTogetherGroupsBehaviours.onlyTrigger || groupMember.options.validateTogetherGroupsBehaviour == NGDynamicValidatorCtrl.validateTogetherGroupsBehaviours.afterFirst && groupMember.hasValidatedDuringThisEvent) {
                return;
            }

            var oldTrigger = groupMember.options.currentValidationTrigger;
            groupMember.options.currentValidationTrigger = newTrigger;
            groupMember.options.ngModel.$setViewValue(groupMember.options.ngModel.$viewValue);
            groupMember.options.currentValidationTrigger = oldTrigger;

            groupMember.hasValidatedDuringThisEvent = true;
        });

        NGDynamicValidatorCtrl.validateTogetherGroupsReigstry._groupsAlreadyValidatedDuringThisTrigger = _(NGDynamicValidatorCtrl.validateTogetherGroupsReigstry._groupsAlreadyValidatedDuringThisTrigger).without(groupName);

        //Not a mistake, can be normal timeout;
        setTimeout(function () {
            _(groupMembers).each(function (groupMember) {
                groupMember.hasValidatedDuringThisEvent = false;
            });
        });
    };

    NGDynamicValidatorCtrl.prototype.copyConfigPropertiesFromReceivedOptions = function (receivedOptions) {
        var _this = this;
        _(NGDynamicValidatorCtrl.reservedConfigPropertyNames).each(function (key) {
            var optKey = key.slice(1);
            _this.options[optKey] = receivedOptions[key] || _this.options[optKey];
        });
    };

    NGDynamicValidatorCtrl.prototype.addJSEventHandler = function (eventName) {
        var _this = this;
        if (_(this.options.jsEvents).contains(eventName)) {
            //Event already wired up
            return;
        }

        this.options.jsEvents.push(eventName);

        this.$elem.on(eventName, function (event) {
            _this.$scope.$apply(function () {
                var trigger = angular.copy(NGDynamicValidatorCtrl.blankValidationTrigger);
                trigger.eventNames = Object.freeze([eventName]);
                trigger.requestGroupNames = Object.freeze([]);
                trigger.isJSEvent = true;
                Object.freeze(trigger);

                _this.universalEventHandler(trigger);
            });
        });
    };

    NGDynamicValidatorCtrl.prototype.addAngularEventHandler = function (eventName) {
        if (!this.options.angularEvents[eventName]) {
            this.options.angularEvents.push(eventName);
        }
    };

    NGDynamicValidatorCtrl.prototype.universalEventHandler = function (trigger) {
        //console.log("universal handler enter");
        //save previous state and switch it to requested events
        this.options.currentValidationTrigger = trigger;

        this.options.ngModel.$setViewValue(this.options.ngModel.$viewValue);

        this.options.currentValidationTrigger = NGDynamicValidatorCtrl.defaultValidationTrigger;

        _(this.options.validateTogetherGroups).each(function (groupName) {
            NGDynamicValidatorCtrl.triggerValidateTogetherGroup(groupName, trigger);
        });
        //console.log("universal handler exit");
    };

    NGDynamicValidatorCtrl.prototype.dynamicValidationFormatter = function (value) {
        //console.log(JSON.stringify(this.options.currentValidationTrigger));
        var _this = this;
        var validatedValueBuffer = value;

        //Each key / value of this object will be used to ngModelCtrl.$setValidity(key,value);
        //Each key is the name of the validator function (as in function name(value){...},
        //each value is its result for current input value
        //If several functions will have the same name, the resulting key in validationSummary
        //will only be true if all of them return true
        var validationSummary = {};

        //Object shared between each IValidationInfo passed to validators, in case they need to communicate
        var communicationBag = {};

        var processValidator = function (validator, included) {
            var validationResult;

            if (included || (!validator.currentState && _this.options.excludedNonValids == NGDynamicValidatorCtrl.excludedNonValidsBehaviours.validate)) {
                //validate
                var validationInfo = {
                    trigger: _this.options.currentValidationTrigger,
                    isIncludedInTrigger: included,
                    currentState: validator.currentState,
                    communicationBag: communicationBag
                };

                validationResult = validator.validatorFn(value, validationInfo);
            } else if (!validator.currentState && _this.options.excludedNonValids == NGDynamicValidatorCtrl.excludedNonValidsBehaviours.setValid) {
                //set valid
                validationResult = true;
            } else {
                //the "do notghing" behaviour
                validationResult = validator.currentState;
            }

            //Validation result can be either bool or IValidationResult (if you also need to modify the value)
            var validationResultIsObject = _(validationResult).isObject();

            validator.currentState = validationResultIsObject ? validationResult.isValid : validationResult;

            if (validationResultIsObject) {
                validatedValueBuffer = validationResult.modifiedValue;
            }

            if (_(validationSummary).has(validator.name) && !validationSummary[validator.name]) {
                return;
            } else {
                validationSummary[validator.name] = validator.currentState;
            }

            return validator.currentState;
        };

        var processKey = function (key, included) {
            //Will be false if at least one validator for this key (event name) returns false
            var overallValidityForKey = true;

            _(_this.options.validators[key]).each(function (validator) {
                var isValid = processValidator(validator, included);
                if (!isValid)
                    overallValidityForKey = false;
            });

            _this.options.ngModel.$invalidEventsSummary[key] = !overallValidityForKey;

            //If there is no form to report to - return
            if (!_this.options.ngForm)
                return;

            if (!overallValidityForKey) {
                //report this event as invalid to parent form
                if (!_(_this.options.ngForm.$invalidEventsSummary[key]).isArray()) {
                    _this.options.ngForm.$invalidEventsSummary[key] = [_this.options.ngModel];
                } else if (_(_this.options.ngForm.$invalidEventsSummary[key]).contains(_this.options.ngModel)) {
                    return;
                } else {
                    _this.options.ngForm.$invalidEventsSummary[key].push(_this.options.ngModel);
                }
            } else {
                //remove this event from invalids on parent form
                if (!_(_this.options.ngForm.$invalidEventsSummary[key]).isArray()) {
                    return;
                } else {
                    _this.options.ngForm.$invalidEventsSummary[key] = _(_this.options.ngForm.$invalidEventsSummary[key]).without(_this.options.ngModel);
                    if (_this.options.ngForm.$invalidEventsSummary[key].length == 0) {
                        _this.options.ngForm.$invalidEventsSummary[key] = false;
                    }
                }
            }
        };

        //validation for requested events
        _(this.options.validators).chain().keys().intersection(this.options.currentValidationTrigger.eventNames).each(function (key) {
            processKey(key, true);
        });

        //validation for events not included in request
        _(this.options.validators).chain().keys().difference(this.options.currentValidationTrigger.eventNames).each(function (key) {
            processKey(key, false);
        });

        //validity is set
        _(validationSummary).chain().keys().each(function (key) {
            _this.options.ngModel.$setValidity(key, validationSummary[key]);
        });

        var triggerValidationGroups = function () {
            _(_this.options.validateTogetherGroups).each(function (groupName) {
                NGDynamicValidatorCtrl.triggerValidateTogetherGroup(groupName, _this.options.currentValidationTrigger);
            });
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
    };

    NGDynamicValidatorCtrl.prototype.setModelAndFormCtrl = function (ngModel, ngForm) {
        var _this = this;
        if (this.options.ngModel || this.options.ngForm)
            throw new Error("ngModel or form has already been set");

        this.options.ngModel = ngModel;
        ngModel.$parsers.push(function (value) {
            return _this.dynamicValidationFormatter(value);
        });

        //Overal validation state of different events is kept here
        this.options.ngModel.$invalidEventsSummary = {};

        this.options.ngForm = ngForm; //|| <INgFormExtended>{};

        if (this.options.ngForm) {
            this.options.ngForm.$invalidEventsSummary = {};
        }
    };

    NGDynamicValidatorCtrl.prototype.getOptionsProp = function (propName) {
        if (propName[0] == "_") {
            propName = propName.slice(1);
        }

        return this.options[propName];
    };

    NGDynamicValidatorCtrl.prototype.setOptionsProp = function (propName, newValue) {
        if (propName[0] != "_") {
            propName = "_" + propName;
        }

        if (!_(NGDynamicValidatorCtrl.reservedConfigPropertyNamesWithDirectAccess).contains(propName)) {
            throw new Error("Attempting to set options prop, which can not be set directly;");
        }

        this.options[propName.slice(1)] = newValue;
    };

    NGDynamicValidatorCtrl.prototype.addToValidateTogetherGroup = function (groupName) {
        if (_(this.options.validateTogetherGroups).contains(groupName))
            return;

        this.options.validateTogetherGroups.push(groupName);

        NGDynamicValidatorCtrl.addMemberToValidateTogetherGroup({
            name: groupName,
            options: this.options,
            hasValidatedDuringThisEvent: false
        });
    };

    NGDynamicValidatorCtrl.prototype.removeFromValidateTogetherGroup = function (groupName) {
        var _this = this;
        if (!_(this.options.validateTogetherGroups).contains(groupName))
            return;

        this.options.validateTogetherGroups = _(this.options.validateTogetherGroups).without(groupName);

        NGDynamicValidatorCtrl[groupName] = _(NGDynamicValidatorCtrl[groupName]).filter(function (validationGroupMember) {
            return validationGroupMember.options !== _this.options;
        });
    };

    NGDynamicValidatorCtrl.prototype.addRequestGroup = function (groupName) {
        this.options.validateRequestGroups.push(groupName);
    };

    NGDynamicValidatorCtrl.prototype.removeRequestGroup = function (groupName) {
        this.options.validateRequestGroups = _(this.options.validateRequestGroups).without(groupName);
    };

    NGDynamicValidatorCtrl.prototype.addValidator = function (eventName, validator) {
        var _this = this;
        if (_(validator).isArray()) {
            _(validator).each(function (validator) {
                _this.addValidator(eventName, validator);
            });
            return;
        }

        if (!_(validator).isFunction())
            throw new Error("Wrong object passed as validator. Must be function or function array");

        if (!validator.name)
            throw new Error("One of the validator functions has no name. All validator functions must follow this signature : " + "'function someName(value){ ...validation... return {isValid : true | false, modifiedValue:{} }'" + "Offending function is " + validator.toString());

        var validatorCtrl = {
            validatorFn: validator,
            name: validator.name,
            currentState: true
        };

        //If this is the first validator for that event
        if (!this.options.validators[eventName]) {
            this.options.validators[eventName] = [];
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
    };

    NGDynamicValidatorCtrl.prototype.removeValidator = function (eventName, validatorFn) {
        var _this = this;
        if (_(validatorFn).isArray()) {
            _(validatorFn).each(function (validator) {
                _this.removeValidator(eventName, validator);
            });
            return;
        }

        this.options.validators[eventName] = _(this.options.validators[eventName]).filter(function (validatorFnCtrl) {
            return validatorFnCtrl.validatorFn !== validatorFn;
        });

        this.cleanupAfterValidatorRemoval(validatorFn.name);

        this.options.ngModel.$setViewValue(this.options.ngModel.$viewValue);
        //todo add cleanup for for handlers of events where no validators left?
    };

    NGDynamicValidatorCtrl.prototype.removeValidatorByName = function (eventName, validatorFnName) {
        var _this = this;
        if (_(validatorFnName).isArray()) {
            _(validatorFnName).each(function (validatorFnName) {
                _this.removeValidatorByName(eventName, validatorFnName);
            });
            return;
        }

        this.options.validators[eventName] = _(this.options.validators[eventName]).filter(function (validatorFnCtrl) {
            return validatorFnCtrl.name !== validatorFnName;
        });

        this.cleanupAfterValidatorRemoval(validatorFnName);

        this.options.ngModel.$setViewValue(this.options.ngModel.$viewValue);
        //todo add cleanup for for handlers of events where no validators left?
    };

    NGDynamicValidatorCtrl.prototype.cleanupAfterValidatorRemoval = function (validatorFnName) {
        var cleanupNotNeeded = _(this.options.validators).chain().values().flatten().map(function (validatorCtrl) {
            return validatorCtrl.name;
        }).contains(validatorFnName).value();

        if (cleanupNotNeeded)
            return;

        this.options.ngModel.$setValidity(validatorFnName, true);
    };
    NGDynamicValidatorCtrl.excludedNonValidsBehaviours = {
        validate: "validate",
        doNothing: "doNothing",
        setValid: "setValid"
    };

    NGDynamicValidatorCtrl.validateTogetherGroupsBehaviours = {
        onlyTrigger: "onlyTrigger",
        afterFirst: "afterFirst",
        afterEach: "afterEach"
    };

    NGDynamicValidatorCtrl.validationEventNames = {
        validateRequest: "VALIDATE_REQUEST"
    };

    NGDynamicValidatorCtrl.reservedEventNames = ["default"];
    NGDynamicValidatorCtrl.reservedConfigPropertyNamesWithDirectAccess = ["_excludedNonValids", "_validateTogetherGroupsBehaviour"];
    NGDynamicValidatorCtrl.reservedConfigPropertyNamesWithoutDirectAccess = ["_validateRequestGroups", "_validateTogetherGroups"];
    NGDynamicValidatorCtrl.reservedConfigPropertyNames = _(NGDynamicValidatorCtrl.reservedConfigPropertyNamesWithDirectAccess).union(NGDynamicValidatorCtrl.reservedConfigPropertyNamesWithoutDirectAccess);

    NGDynamicValidatorCtrl.blankValidationTrigger = {
        isJSEvent: false,
        isAngularEvent: false,
        isDefaultEvent: false,
        eventNames: [],
        requestGroupNames: [],
        isValidatingTogether: false
    };

    NGDynamicValidatorCtrl.defaultValidationTrigger = Object.freeze({
        isJSEvent: false,
        isAngularEvent: false,
        isDefaultEvent: true,
        eventNames: Object.freeze(["default"]),
        requestGroupNames: Object.freeze([]),
        isValidatingTogether: false
    });

    NGDynamicValidatorCtrl.defaultOptions = {
        excludedNonValids: NGDynamicValidatorCtrl.excludedNonValidsBehaviours.validate,
        validateRequestGroups: [],
        validateTogetherGroups: [],
        validateTogetherGroupsBehaviour: NGDynamicValidatorCtrl.validateTogetherGroupsBehaviours.afterFirst,
        validators: {},
        jsEvents: [],
        angularEvents: [],
        currentValidationTrigger: NGDynamicValidatorCtrl.defaultValidationTrigger,
        ngModel: null,
        ngForm: null
    };

    NGDynamicValidatorCtrl.validateTogetherGroupsReigstry = {
        //Circular group membership infinit loop prevention
        _groupsAlreadyValidatedDuringThisTrigger: []
    };

    NGDynamicValidatorCtrl.$inject = ["$scope", "$element", "$attrs", "$rootScope", "$timeout", "$parse", "validators"];
    return NGDynamicValidatorCtrl;
})();

NGDynamicValdiatorModule.constant("excludedNonValidsBehaviours", NGDynamicValidatorCtrl.excludedNonValidsBehaviours);

NGDynamicValdiatorModule.constant("validateTogetherGroupsBehaviours", NGDynamicValidatorCtrl.validateTogetherGroupsBehaviours);

NGDynamicValdiatorModule.constant("validationEventNames", NGDynamicValidatorCtrl.validationEventNames);

NGDynamicValdiatorModule.directive("ngDynamicValidator", [function () {
        var directive = {
            require: ["ngModel", "^?form", "ngDynamicValidator"],
            controller: NGDynamicValidatorCtrl,
            link: function ($scope, $elem, $attr, controllers) {
                controllers[2].setModelAndFormCtrl(controllers[0], controllers[1]);
            }
        };

        return directive;
    }]);
//# sourceMappingURL=NGDynamicValidator.js.map
