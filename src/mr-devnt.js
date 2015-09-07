
//These functions return true if the comparison fails and false on succeed
(function mrNameSpace (argument) {
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
      if (elem.type === 'submit'){continue;}
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

  function fieldsToURI (fields) {
    var result = '';

    for (var i = 0; i < fields.length; i++) {
      result += i ? '&' : '';
      result += fields[i].name + ':';
      result += fields[i].comparison + '(';
      result += fields[i].value + ')';
    }
    return '#'+ encodeURIComponent(result);
  }

  function URItoFields (uri) {
    
  }

  var htmlFilter = function (filterForm) {
    var filterFields = $(filterForm).find('[mr-name]');
    var itemList = document.getElementById(filterForm.getAttribute('mr-item-list'));

    function execFilter () {
      var items = $(itemList).find('[mr-item]');
      items.show();
      var fields = getFields(filterForm)
      for (var f = fields.length - 1; f >= 0; f--) {
        for (var i = items.length - 1; i >= 0; i--) {
          var itemField = $(items[i]).find('[mr-name='+fields[f].name+']');
          var itemValue = itemField.val() || itemField.text();

          if (comparisons[fields[f].comparison](itemValue, fields[f].value)) {
            $(items[i]).hide();
          }
        }
      }
      return fieldsToURI(fields);
    }

    // filterFields.on('change', function(e){
    //   execFilter();
    // });

    //Prevent form to submit
    filterForm.onsubmit = function (e){
      e.preventDefault();
      location.href = location.href.replace(/#.*/, '') + execFilter();
      return false;
    }

    var params = decodeURIComponent(
      location.hash || location.href.replace(/.*#?/,'#')
    ).replace('#','');

    if(params) {
      params = params.split('&');

      for (var i = params.length - 1; i >= 0; i--) {
        var options = /(.*?):(.*?)\((.*?)\)/.exec(params[i]);
        var elem = filterFields.filter('[mr-name='+ options[1] + ']')
          .filter('[mr-comparison-type="'+ options[2] + '"]');
        if (elem.length === 1 && elem[0].type !== 'checkbox') {
          elem.val(options[3]);
        } else {
          var values = options[3].split(',');
          for (var j = values.length-1; j >= 0; j--) {
            var newElem = elem.filter('[value='+ values[j] + ']');
            if (newElem.length)[0].checked = true;
          }
        }
      }

      execFilter();
    }

  };


  var filterForms = document.getElementsByClassName('html-filter');

  for (var i = filterForms.length-1; i >= 0; i--) {
    htmlFilter(filterForms[i]);
  }
})();
