
//These functions return true if the comparison fails and false on succeed

function greaterThan (value1, value2) {
  return +value1 <= +value2;
}

function lowerThan (value1, value2) {
  return +value1 >= +value2;
}

function equalsTo (value1, value2) {
  return value1 != value2;
}

function notEqualsTo (value1, value2) {
  return value1 == value2;
}

function inValues(value, values) {
  if (value) {
    return values.indexOf(value) < 0;
  }
  return false;
}

var comparisons = {
  '>': greaterThan,
  'greater-than': greaterThan,
  '<': lowerThan,
  'lower-than': lowerThan,
  'equals-to': equalsTo,
  '=': equalsTo,
  'not-equals-to': notEqualsTo,
  '!=': notEqualsTo,
  'in': inValues,
  'none': null
};

function getFields(form) {
  //Gets an array of objects with name, comparison type and values
  var i, elements = {}, result = [];
  for (i = form.elements.length - 1; i >= 0; i--) {
    var elem = form.elements[i];
    if (elem.value && (elem.type !== 'checkbox' || elem.checked)) {
      var comparison = elem.getAttribute('mr-comparison-type');
      var name = elem.getAttribute('mr-name');
      if (comparison !== 'in') {
        //Add element into the array, no matter wath
        result.push({
          'name': name,
          'comparison': comparison,
          'value': elem.value
        });
      } else {
        (elements[name] = elements[name] || {
          'name': name,
          'comparison': comparison,
          'value': []
        }).value.push(elem.value);
      }
    }
  }

  for (var key in elements) {
    if (elements.hasOwnProperty(key)) {
      result.push(elements[key]);
    }
  }

  return result;
}

var htmlFilter = function (filterForm) {
  var filterFields = $(filterForm).find('[mr-name]');
  var itemList = document.getElementById(filterForm.getAttribute('mr-item-list'));

  function execFilter () {
    var items = $(itemList).find('[mr-item]');
    items.show();
    var fields = getFields(filterForm)
    for (var f = fields.length - 1; f >= 0; f--) {
      // var comparisonType = this.getAttribute('mr-comparison-type');
      // var attrName = this.getAttribute('mr-name');
      //
      // var comparisonValue = this.value;
      //if (comparisonValue) {}
      for (var i = items.length - 1; i >= 0; i--) {
        var itemField = $(items[i]).find('[mr-name='+fields[f].name+']');
        var itemValue = itemField.val() || itemField.text();

        if (comparisons[fields[f].comparison](itemValue, fields[f].value)) {
          $(items[i]).hide();
        }

        console.log(fields[f].value);
      }
    }
  }

  filterFields.on('change', function(e){
    console.log(this + 'change');
    execFilter();
  });

};


var filterForms = document.getElementsByClassName('html-filter');

for (var i = filterForms.length-1; i >= 0; i--) {
  htmlFilter(filterForms[i]);
}
