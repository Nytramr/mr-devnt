

function greaterThan (value1, value2) {
  return +value1 <= +value2;
}

function lowerThan (value1, value2) {
  return +value1 >= +value2;
}

var comparisons = {
  '>': greaterThan,
  'greater-than': greaterThan,
  '<': lowerThan,
  'lower-than': lowerThan
};

var htmlFilter = function (filterForm) {
  var filterFields = $(filterForm).find('[mr-name]');
  var itemList = document.getElementById(filterForm.getAttribute('mr-item-list'));

  function execFilter () {
    var items = $(itemList).find('[mr-item]');
    filterFields.each(function(){
      var comparisonType = this.getAttribute('mr-comparison-type');
      var attrName = this.getAttribute('mr-name');
      var comparisonValue = this.value;

      for (var i = items.length - 1; i >= 0; i--) {
        var itemField = $(items[i]).find('[mr-name='+attrName+']');
        var itemValue = itemField.val() || itemField.text();

        if (comparisons[comparisonType](itemValue, comparisonValue)) {
          $(items[i]).hide();
        }

        console.log(itemValue);
      }



    });
  }

  filterFields.on('change', function(e){
    console.log(this + 'change');
    execFilter();
  });

  debugger;
};


var filterForms = document.getElementsByClassName('html-filter');

for (var i = filterForms.length-1; i >= 0; i--) {
  htmlFilter(filterForms[i]);
}
