

var mrNameSpace = (function (self) {

  self = self || {};

  //DOM ready
  var onReadyCallbacks = [];
  var domReady = false;
  self.onDOMReady = function (cb) {
    if(domReady){
      cb();
    } else {
      onReadyCallbacks.push(cb);
    }
  };

  function onReady () {
    for (var i = 0; i < onReadyCallbacks.length; i++) {
      onReadyCallbacks[i]();
    }

  }

  if (document.attachEvent) {
    //IE 9 or lower
    document.addEventListener = document.addEventListener || function (eventName, cb){
      document.attachEvent('on'+eventName, cb);
    };

    function onReadyIE () {
      if (document.readyState === "complete"){
        document.detachEvent("onreadystatechange", onReadyIE);
        onReady();
      }
    }
    document.attachEvent("onreadystatechange", onReadyIE);
  } else {
    document.addEventListener("DOMContentLoaded", onReady);
  }

  //Elements objects
  var rx = RegExp('^\\\[object Array|HTMLCollection\\\]$');

  function Elements() {
    var arr = [ ];
    for (var i = 0; i < arguments.length; i++) {
      if (rx.test(Object.prototype.toString.call(arguments[i]))) {
        arr.push.apply(arr, arguments[i]);
      } else {
        arr.push.call(arr, arguments[i]);
      }
    }
    arr.__proto__ = Elements.prototype;
    return arr;
  }

  Elements.prototype = new Array;

  //add elements from a jQuery object
  Elements.prototype.addJQuery = function (jQueryObj) {
    for (var i = 0; i < jQueryObj.length; i++) {
      this.push(jQueryObj[i]);
    }
    return this;
  };

  function selectorToString (attribute, value) {
    var selector = '[' + attribute;

    if (value !== null) {
      if (value !== undefined) {
        selector += '=' + value;
      }
      selector += ']';
    } else {
      selector = ':not(' + selector + '])';
    }

    return selector;
  }

  function findByAttribute (attribute, value, result) {
    for (var i = 0; i < this.length; i++) {
      var attrValue = this[i].getAttribute(attribute);
      if ((value !== undefined)?(attrValue == value):(attrValue !== null)) {
        result.push(this[i]);
      }

      if(this[i].children.length){
        //Call recursively
        findByAttribute.call(this[i].children, attribute, value, result);
      }
    }
  }

  Elements.prototype.findByAttribute = (function () {

    if (document && document.querySelectorAll) {
      //Return a function that use document.querySelector because it is several times faster
      return function (attribute, value) {
        var selector = selectorToString(attribute, value);

        var result = new Elements();
        for (var i = 0; i < this.length; i++) {
          result.push.apply(result, this[i].querySelectorAll(selector));
        }
        return result;
      };
    }

    return function (attribute, value) {
      result = new Elements();

      for (var i = 0; i < this.length; i++) {
        if(this[i].children.length){
          findByAttribute.call(this[i].children, attribute, value, result);
        }
      }
      return result;
    };
  })();

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

  Elements.prototype.findFirstByAttribute = (function(){
    if (document && document.querySelector) {
      //Return a function that use document.querySelector because it is several times faster
      return function (attribute, value) {
        var selector = selectorToString(attribute, value);
        for (var i = 0; i < this.length; i++) {
          var result = this[i].querySelector(selector);
          if (result) return result;
        }
        return null;
      };
    }

    return function (attribute, value) {
      for (var i = 0; i < this.length; i++) {
        if(this[i].children.length){
          var result = findFirstByAttribute.call(this[i].children, attribute, value);
          if (result) return result;
        }
      }
      return null;
    };
  })();

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
      this[i].style.display = '';
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
  //Making it public
  self.Elements = Elements;

  /***************/
  /* Form Filter */
  /***************/
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

  function _loadPage () {
    var filterForms = document.getElementsByClassName('html-filter');
    //Just one filter per page
    if (filterForms.length > 1) {
      throw "Multiple html filters are not allowed";
    }
    if (filterForms.length == 1) {
      htmlFilter(filterForms[0]);
    }
  }

  self.reloadPage = _loadPage;

  self.onDOMReady(_loadPage);

  return self;
})(mrNameSpace);

var Elements = Elements || mrNameSpace.Elements;


function getElementsByAttribute (elem, attribute, value) {
  return Elements.prototype.findByAttribute.call([elem], attribute, value);
};
