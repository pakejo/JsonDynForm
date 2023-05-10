import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import * as jp from 'jsonpath';
import { Observable, map } from 'rxjs';
import { BasicValidations } from '../data/basicValidations';
import { AsyncValidation } from '../interfaces/AsyncValidation.interface';
import { SyncValidation } from '../interfaces/SyncValidation.interface';
import { FetchService } from './fetch.service';
import { ErrorsService } from './errors.service';

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
    private readonly errorsService: ErrorsService
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
        propValue = jp.query(obj, key, 1)[0] ?? key;
      } catch (error) {}
    }

    if (typeof value == 'string') {
      try {
        value = jp.query(obj, value)?.[0] ?? value;
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
    jp.apply(copy, '$..[?(@=="value")]', (_x) => controlValue);
    return copy;
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
          let url = `${validation.url}`;

          if (validation.url.includes('value'))
            url = validation.url.replace('value', control.value);

          const errorObj = Object.create(null);
          errorObj[validation.name] = {
            value: control.value,
          };

          return this.fetchService
            .fetchGenericData(url)
            .pipe(
              map((response) =>
                this.evaluateLogicalExpression(
                  this.replaceQueryControlValue(
                    validation.value,
                    control.value
                  ),
                  response
                )
                  ? null
                  : errorObj
              )
            );
        }
    );
  }
}
