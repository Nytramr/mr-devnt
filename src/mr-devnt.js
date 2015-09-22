
//Element a
function Elements() {
  var arr = [ ];
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i].length) {
      arr.push.apply(arr, arguments[i]);
    } else {
      arr.push.call(arr, arguments[i]);
    }
  }
  arr.__proto__ = Elements.prototype;
  return arr;
}

Elements.prototype = new Array;

function findByAttribute (attribute, value, result) {
  for (var i = 0; i < this.length; i++) {
    var attrValue = this[i].getAttribute(attribute);
    if ((value !== undefined)?(attrValue == value):(attrValue !== null)) {
      result.push(this[i]);
    }

    if(this[i].children.length){
      //Call recursively
      findByAttribute.call(this[i].children, attribute, value, result);
      // this.push(this[i].children[j]);
    }
  }
}

Elements.prototype.findByAttribute = function (attribute, value) {
  result = new Elements();

  for (var i = 0; i < this.length; i++) {
    if(this[i].children.length){
      findByAttribute.call(this[i].children, attribute, value, result);
    }
  }
  return result;
};

function findFirstByAttribute (attribute, value) {
  for (var i = 0; i < this.length; i++) {
    var attrValue = this[i].getAttribute(attribute);
    if ((value !== undefined)?(attrValue == value):(attrValue !== null)) {
      return this[i];
    }

    if(this[i].children.length){
      var result = findFirstByAttribute.call(this[i].children, attribute, value);
      if (result) return result;
    }
  }
  //Not found
  return null;
}

Elements.prototype.findFirstByAttribute = function (attribute, value) {

  for (var i = 0; i < this.length; i++) {
    if(this[i].children.length){
      var result = findFirstByAttribute.call(this[i].children, attribute, value);
      if (result) return result;
    }
  }
  return null;
};

Elements.prototype.filterByAttribute = function (attribute, value) {
  var result = new Elements();

  for (var i = 0; i < this.length; i++) {
    var attrValue = this[i].getAttribute(attribute);
    if ((value !== undefined)?(attrValue == value):(attrValue !== null)) {
      result.push(this[i]);
    }
  }

  return result;
};

Elements.prototype.show = function () {

  for (var i = 0; i < this.length; i++) {
    this[i].style.display = 'block';
    this[i].style.visibility = 'visible';
  }

  return this;
};

Elements.prototype.hide = function () {

  for (var i = 0; i < this.length; i++) {
    this[i].style.display = 'none';
    this[i].style.visibility = 'hidden';
  }

  return this;
};

var getElementsByAttribute = function (elem, attribute, value) {
  return Elements.prototype.findByAttribute.call([elem], attribute, value);
};

document.addEventListener = document.addEventListener || function (eventName, cb){
  document.attachEvent('on'+eventName, cb);
};


//(function (){
//    if (document.querySelectorAll) {
//      return function (elem, attribute, value) {
//        var result = elem.querySelectorAll('[' + attribute + (value?'="' + value + '"]':']'));
//        return Array.prototype.slice.call(result);
//      };
//    } else {
//      return function (elem, attribute, value) {
//        if (elem) {
//          var result = [];
//          elem.children
//
//          return result;
//        }
//      };
//    }
//  })();

//These functions return true if the comparison fails and false on succeed
var mrNameSpace = (function (argument) {

  var self = {};

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
    var filterFields = Elements(filterForm).findByAttribute('mr-name');
    var itemList = document.getElementById(filterForm.getAttribute('mr-item-list'));

    function execFilter () {
      var items = Elements(itemList).findByAttribute('mr-item');
      items.show();
      var fields = getFields(filterForm)
      for (var f = fields.length - 1; f >= 0; f--) {
        for (var i = items.length - 1; i >= 0; i--) {
          var itemField = Elements(items[i]).findFirstByAttribute('mr-name', fields[f].name);
          var itemValue = itemField ? (itemField.value || itemField.innerText || itemField.innerHTML):null;

          if (comparisons[fields[f].comparison](itemValue, fields[f].value)) {
            items[i].style.display = 'none';
            items[i].style.visibility = 'hidden';
          }
        }
      }
      return fieldsToURI(fields);
    }

    // filterFields.on('change', function(e){
    //   execFilter();
    // });

    //Prevent form to submit and change the navigation bar url
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
        var elem = filterFields.filterByAttribute('mr-name', options[1])
          .filterByAttribute('mr-comparison-type', options[2]);
        if (elem.length === 1 && elem[0].type !== 'checkbox') {
          elem[0].value = options[3];
        } else {
          var values = options[3].split(',');
          for (var j = values.length-1; j >= 0; j--) {
            var newElem = elem.filterByAttribute('value', values[j]);
            if (newElem.length) {
              newElem[0].checked = true;
            } else {
              elem.filterByAttribute('value', null)[0].value = values[j];
            }
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
