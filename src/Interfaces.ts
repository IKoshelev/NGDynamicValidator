/// <reference path="typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="typings/underscore/underscore.d.ts" />
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />

//NGDynamicValidator/////////////////////////////////////

interface IDynamicValidatorScope extends ng.IScope {

}

interface IDynamicValidatorOptions {
    excludedNonValids: string;
    validateRequestGroups: string[];
    validateTogetherGroups: string[];
    validateTogetherGroupsBehaviour: string;
    validators: any;
    jsEvents: string[];
    angularEvents: string[];
    currentValidationTrigger: IValidationTrigger;
    ngModel: INgModelExtended;
    ngForm: INgFormExtended;
};

interface IValidatorFn extends Function {
    name?: string;
    (value: any, validationInfo?: IValidationInfo): any;    //Will be either bool or IValidationResult, if you need to alter \ stop value progogation
}

interface IValidationResult {
    isValid: boolean;
    modifiedValue: any;
}

interface IValidateTogetherGroupMember {
    name: string;
    hasValidatedDuringThisEvent: boolean;
    options: IDynamicValidatorOptions;
}

//Information about the event that triggered validation. Object and its property objects will be frozen.
interface IValidationTrigger {

    isJSEvent: boolean;                 //True if validating on jQuery event, false if on angular validateRequest event or normal ngModel workflow
    isAngularEvent: boolean;            //True if validating on angular validateRequest event, false if on jQuery event or normal ngModel workflow
    isDefaultEvent: boolean;            //True if validation is firing due to normal ngModel workflow (meaning, it was not triggered by the jqeuery or angular event handlers of this directive)
                                        //do note, this will be false for validation on angular validateRequest event that just includes the "default" event name among requested event names
    eventNames: string[];               //Names of the events that were requested in this validation
    requestGroupNames: string[];        //Names of the groups that were requested in this validation
    isValidatingTogether: boolean;      //True if validation triggered not by an event on owner input, but on an input that shared validateTogetherGroups
}

interface IValidationInfo {
    trigger: IValidationTrigger;        //Info on the event, that triggered the validation. Will be a frozen object
    currentState: boolean;              //Current state of validity for this input with this validator
    isIncludedInTrigger: boolean;       //True if validating due to normal event handling flow, false if would not normally be validated on this event but
                                        //_excludedNonValids option forces it to validate 
    communicationBag: {};               //Just in case you need some communication between validators - here is the place to do it.
                                        //This object will be shared among all IValidationInfo instances created due to a single event (including validateTogetherGroups)
                                        //P.S. If you are forced to use communicationBag - something should probably be changed about your architecture
}

interface IValidatorFnCtrl {
    validatorFn: IValidatorFn;
    name: string;
    currentState: boolean;
}

interface INgModelExtended extends ng.INgModelController{
    $invalidEventsSummary: {};
}

interface INgFormExtended extends ng.IFormController {
    $invalidEventsSummary: {};
}

interface IExcludedNonValidsBehaviours {
    validate: string;
    doNothing: string;
    setValid: string;
}

interface IValidateTogetherGroupsBehaviour {
    onlyTrigger: string;		        //won't react to any validateTogeteherGroup validations, but will still trigger them for others
    afterFirst: string;
    afterEach: string;
}

interface IEventNames {
    validateRequest;
}

//validatorsProvider/////////////////////////////////////

interface IValidatorsProvider {
    getValueFromValueProvider: (valueProvider?: any) => any;    //valueProvider can be 4 things:
                                                                //not an object = will be used as is
                                                                //function - result of call with no args will be used
                                                                //object with a .value prop - the prop will be used
                                                                //any other object - the whold object will be used   
    validators: any;
    $get: any[];
}

interface IValidatorFnProvider {
    (valueProvider: any): IValidatorFn;
}

interface IValidatorsService {
	minLength: IValidatorFnProvider;
	maxLength: IValidatorFnProvider;
	required: IValidatorFnProvider;
	pattern: IValidatorFnProvider;
}