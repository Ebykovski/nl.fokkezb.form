/**
 * Base Controller for all field types.
 *
 * See the [Fields](#!/guide/types) guide.
 *
 * @class Widgets.nlFokkezbForm.controllers.field
 * @requires Widgets.nlFokkezbForm.lib.util
 */

var util = require(WPATH('util'));

/**
 * @type {Function} Function to use as validator, e.g.:
 *
 *     function(value) {
 *       return form.validator.isEmail(value) && !value.indexOf('hotmail.com');
 *     }
 */
$.validator = null;

/**
 * @type {Boolean} Whether the field is required.
 */
$.required = false;

$.setInput = setInput;
$.focus = focus;
$.setValue = setValue;
$.getValue = getValue;
$.isValid = isValid;
$.showError = showError;

// keep a reference to our controllerParam for showError()
// when we are extended they will change to our child's.
var controllerParam = {
  widgetId: $.__widgetId,
  name: $.__controllerPath
};

// hold the value received via constructor until after setInput was called.
var value;

/**
 * Constructor for the row.
 *
 * @constructor
 * @method Controller
 * @param args Arguments passed to the controller.
 * @param {Object|String} [args.label]  Properties to apply to the `Ti.UI.Label` or value for the text property.
 * @param {String} args.labelid         String name to use with `L()` for the `Ti.UI.Label` text property.
 */
(function constructor(args) {

  // for the table's singletap event listener
  $.row._name = args.name;

  if (args.validator) {
    $.validator = args.validator;
  }

  $.required = args.required === true;

  var label = util.extractProperties(args, 'label', 'text');

  // label properties to apply
  if (_.size(label) > 0) {
    $.label.applyProperties(label);
  }

  // position the controls right of the label, where ever that is.
  $.control.left = $.label.width;

  if (args.value !== undefined) {
    value = args.value;
  }

})(arguments[0]);

/**
 * Set the input view in the control wrapper
 *
 * @param {Object} input Some kind of input, e.g. `Ti.UI.TextField`.
 */
function setInput(input) {

  // if a custom type uses another id we make the ref ourselves
  if (!$.input) {
    $.input = input;
  }

  $.control.add($.input);

  if (value !== undefined) {
    $.setValue(value);
  }
}

/**
 * Visually mark the row as having an error.
 *
 * @param {Boolean} show   Show or hide the mark.
 */
function showError(show) {

  if (show) {
    Alloy.addClass(controllerParam, $.row, 'errorRow');
    Alloy.addClass(controllerParam, $.label, 'errorLabel');

  } else {
    Alloy.removeClass(controllerParam, $.row, 'errorRow');
    Alloy.removeClass(controllerParam, $.label, 'errorLabel');
  }
}

/**
 * Sets the focus on the input.
 *
 * This method is called by {@link Widgets.nlFokkezbForm.controllers.widget} when the user clicks on the row.
 */
function focus() {
  $.input.focus();
}

/**
 * Get the value of the field.
 *
 * @return {String} Value of the field.
 */
function getValue() {
  return $.input.value;
}

/**
 * Set the value of the field.
 *
 * @param  {String} [value] Value to set or `undefined` to unset.
 */
function setValue(value) {
  $.input.value = value;
}

/**
 * Validates the current value.
 *
 * @return {Boolean|String} Returns `true` if valid or an error message if not.
 */
function isValid() {
  var value = $.getValue();
  var valid = true;

  if ($.required && !value) {
    valid = false;

  } else if ($.validator) {
    valid = $.validator(value);
  }

  $.showError(!valid);

  return valid;
}