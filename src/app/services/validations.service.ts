import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { JSONPath } from 'jsonpath-plus';
import { Observable, map, of } from 'rxjs';
import { BasicValidations } from '../data/basicValidations';
import { AsyncValidation } from '../interfaces/AsyncValidation.interface';
import { SyncValidation } from '../interfaces/SyncValidation.interface';
import { DynFormService } from './dyn-form.service';
import { ErrorsService } from './errors.service';
import { FetchService } from './fetch.service';

type BasicExpression = [
  string,
  (
    | 'greater_than'
    | 'less_than'
    | 'equal'
    | 'starts_with'
    | 'ends_with'
    | 'contains'
  ),
  string | number
];

type LogicalExpression = [string, Expression[]];

type Expression = BasicExpression | LogicalExpression;

@Injectable({
  providedIn: 'root',
})
export class ValidationsService {
  constructor(
    private readonly fetchService: FetchService,
    private readonly errorsService: ErrorsService,
    private readonly dynFormService: DynFormService
  ) {}

  /**
   * This function evaluates a basic expression using a key, operation, and value, and returns a
   * boolean value based on the comparison.
   * @param {BasicExpression} expression - The expression parameter is a BasicExpression, which is an
   * array containing three elements: the key (property name), the operation to perform on the value of
   * the property, and the value to compare against.
   * @param {any} obj - The object on which the expression is being evaluated. It could be any
   * JavaScript object.
   * @returns a boolean value, which is determined by evaluating the expression passed as the first
   * argument using the object passed as the second argument. The function checks the operation
   * specified in the expression and performs the corresponding comparison between the key and value of
   * the expression. The result of the comparison is returned as a boolean value.
   */
  private evaluateExpression(expression: BasicExpression, obj: any): boolean {
    let [key, operation, value] = expression;
    let propValue = key;

    if (typeof obj == 'object') {
      try {
        propValue = JSONPath(key, obj, undefined, undefined) ?? key;
      } catch (error) {}
    }

    if (typeof value == 'string') {
      try {
        value = JSONPath(value, obj, undefined, undefined) ?? value;
      } catch (error) {}
    }

    switch (operation) {
      case 'greater_than':
        return propValue > value;
      case 'less_than':
        return propValue < value;
      case 'contains':
        return new RegExp(value + '').test(propValue + '');
      case 'starts_with':
        return new RegExp('^' + value + '').test(propValue + '');
      case 'ends_with':
        return new RegExp(value + '$').test(propValue + '');
      case 'equal':
      default:
        return propValue === value;
    }
  }

  /**
   * This function evaluates a logical expression by recursively calling itself on sub-expressions and
   * returning a boolean value.
   * @param {LogicalExpression} expr - The logical expression to be evaluated, which can be either an
   * "and" or "or" operation with one or more sub-expressions.
   * @param {Object} obj - The `obj` parameter is an object that contains the values of variables used
   * in the logical expression. The function `evaluateLogicalExpression` evaluates the logical
   * expression using the values of these variables.
   * @returns a boolean value, which is the result of evaluating the logical expression passed as the
   * first argument, using the object passed as the second argument.
   */
  private evaluateLogicalExpression(
    expr: LogicalExpression,
    obj: Object
  ): boolean {
    const [condition, expressions] = expr;
    const fn = condition == 'and' ? expressions.every : expressions.some;
    return fn.call(expressions, (expr) => {
      const isQuery = expr.length == 2;
      if (isQuery) {
        return this.evaluateLogicalExpression(expr as LogicalExpression, obj);
      } else {
        return this.evaluateExpression(expr as BasicExpression, obj);
      }
    });
  }

  /**
   * This function replaces the "value" property in a logical expression with a given control value.
   * @param {LogicalExpression} expr - The `expr` parameter is a `LogicalExpression` object, which is
   * being passed as an argument to the `replaceQueryControlValue` function. This object represents a
   * logical expression that can be evaluated to either true or false.
   * @param {any} controlValue - The `controlValue` parameter is the value that will replace any
   * occurrences of the string "value" in the `expr` parameter. This function uses the `jsonpath`
   * library to find and replace all occurrences of "value" in the `expr` object with the
   * `controlValue`.
   * @returns a modified copy of the input `expr` LogicalExpression, where any occurrence of the string
   * "value" is replaced with the input `controlValue`.
   */
  private replaceQueryControlValue(
    expr: LogicalExpression,
    controlValue: any
  ): LogicalExpression {
    const copy: LogicalExpression = JSON.parse(JSON.stringify(expr));

    const replaceValue = (structure: any, replacement: any): any => {
      if (Array.isArray(structure)) {
        return structure.map((item) => replaceValue(item, replacement));
      } else if (structure === 'value') {
        return replacement;
      } else {
        return structure;
      }
    };

    return replaceValue(copy, controlValue);
  }

  /**
   * This function builds a list of synchronous validations based on a given list of validation
   * objects.
   * @param {SyncValidation[]} validationsList - an array of objects representing the validations to be
   * performed on a form control. Each object contains a "type" property indicating the type of
   * validation to be performed (e.g. "required", "minLength", "pattern", "custom"), and a "value"
   * property containing the value to be used
   * @returns The function `buildSyncValidations` is returning an array of validation functions. The
   * validation functions are created based on the `validationsList` parameter, which is an array of
   * objects containing a `type` and a `value` property. If the `type` is not `'custom'`, the function
   * retrieves a validation function from the `BasicValidations` object based on the `type`
   */
  buildSyncValidations(validationsList: SyncValidation[]): ValidatorFn[] {
    return validationsList.map((validation: SyncValidation) =>
      validation.type != 'custom'
        ? BasicValidations[validation.type](validation.value as never)
        : (control: AbstractControl): ValidationErrors | null => {
            this.errorsService.addCustomValidationMessage(
              validation.name,
              validation.message
            );

            const errorObj = Object.create(null);
            errorObj[validation.name] = {
              value: control.value,
            };

            return control.value != null &&
              control.value != '' &&
              this.evaluateLogicalExpression(
                this.replaceQueryControlValue(validation.value, control.value),
                control.value
              )
              ? null
              : errorObj;
          }
    );
  }

  /**
   * This function builds an array of asynchronous validator functions based on a list of async
   * validations.
   * @param {AsyncValidation[]} validationsList - An array of AsyncValidation objects, which contain
   * information about the validation to be performed, including the URL to fetch data from and the
   * logical expression to evaluate.
   * @returns The function `buildAsynValidations` returns an array of `AsyncValidatorFn` functions.
   * These functions are used to perform asynchronous validation on Angular reactive form controls. The
   * validation logic is based on a list of `AsyncValidation` objects that contain a URL to fetch data
   * from and a logical expression to evaluate the response against. The function maps each
   * `AsyncValidation` object to an `AsyncValidator
   */
  buildAsynValidations(validationsList: AsyncValidation[]): AsyncValidatorFn[] {
    return validationsList.map(
      (validation: AsyncValidation) =>
        (control: AbstractControl): Observable<ValidationErrors | null> => {
          this.errorsService.addCustomValidationMessage(
            validation.name,
            validation.message as string
          );

          switch (validation.type) {
            case 'custom':
              return this.createCustomValidationRequest(validation, control);
            case 'external':
              return this.createExternalValidationRequest(validation);
            default:
              return of(null);
          }
        }
    );
  }

  /**
   * This function creates a custom validation request by replacing a placeholder value in the URL with
   * the control's value, fetching data from the URL, and evaluating a logical expression using the
   * response to determine if there is an error.
   * @param {AsyncValidation} validation - AsyncValidation object containing information about the
   * validation to be performed, including the URL to fetch data from, the name of the validation, the
   * message to display if the validation fails, and the logical expression to evaluate the response
   * against.
   * @param {AbstractControl} control - An instance of the AbstractControl class, which represents a
   * form control in Angular. It can be a FormControl, FormGroup, or FormArray. The control parameter
   * is used to get the current value of the form control and to replace the "value" placeholder in the
   * validation URL if it exists.
   * @returns The `createCustomValidationRequest` function is returning an Observable that makes a HTTP
   * request to a specified URL using the `fetchService`, and then evaluates a logical expression using
   * the response data and a value from the control. If the expression evaluates to true, the function
   * returns null, indicating that the validation has passed. Otherwise, it returns an error object
   * with a message specified in the `validation` parameter
   */
  private createCustomValidationRequest(
    validation: AsyncValidation,
    control: AbstractControl
  ) {
    let url = `${validation.url}`;

    if (validation.url.includes('value'))
      url = validation.url.replace('value', control.value);

    const errorObj = Object.create(null);
    errorObj[validation.name] = {
      value: validation.message,
    };

    return this.fetchService
      .fetchGenericData(url)
      .pipe(
        map((response) =>
          this.evaluateLogicalExpression(
            this.replaceQueryControlValue(validation.value, control.value),
            response
          )
            ? null
            : errorObj
        )
      );
  }

  /**
   * This function creates an external validation request using a provided validation object and
   * returns an error object if the validation fails.
   * @param {AsyncValidation} validation - The `validation` parameter is an object of type
   * `AsyncValidation` which contains information about the validation to be performed, including the
   * URL to send the validation request to and the validation message to display if the validation
   * fails.
   * @returns The `createExternalValidationRequest` function is returning an Observable that makes a
   * POST request to a specified URL with some data. The response from the server is then mapped to either a
   * null value or an error object, depending on the value of `validationResult` in the response. The
   * error object contains a single key-value pair.
   */
  private createExternalValidationRequest(validation: AsyncValidation) {
    return this.fetchService
      .postGenericData(
        validation.url,
        this.dynFormService.getValidationStatus()
      )
      .pipe(
        map((response) => {
          const { validationResult } = response as any;

          const errorObj = Object.create(null);
          errorObj[validation.name] = {
            value: validation.message,
          };

          return validationResult ? null : errorObj;
        })
      );
  }
}
