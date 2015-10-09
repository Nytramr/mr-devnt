
describe("Element: ", function(){

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/tests/fixtures';
  });

  describe("construstor: ", function(){
    beforeEach(function() {
      loadFixtures('elements.html');
    });

    it("Should shuld build an Elements object with a single element", function(){
      var elem = document.getElementById('container');
      var result = new mrNameSpace.Elements(elem);
      expect(result.length).toBe(1);
    });

    it("Should shuld build an Elements object from an array of elements", function(){
      var elem = [document.getElementById('container'), document.getElementById('first-two')];
      var result = new mrNameSpace.Elements(elem);
      expect(result.length).toBe(2);
    });

    it("Should shuld build an Elements object from an HTMLCollection", function(){
      var elem = document.getElementsByClassName('class1');
      console.log(elem.length);
      var result = new mrNameSpace.Elements(elem);
      expect(result.length).toBe(5);
    });

    it("Should shuld build an Elements object from an jQuery object", function(){
      var elem = jQuery('.class1');
      console.log(elem.length);
      var result = new mrNameSpace.Elements().addJQuery(elem);
      expect(result.length).toBe(5);
    });
  });

  describe("findByAttribute: ", function(){
    var container;
    beforeEach(function() {
      loadFixtures('elements.html');
      container = document.getElementById('container');
    });

    it("Should find elements that have the attr1 attribute no matter its value", function(){
      var result = mrNameSpace.Elements(container).findByAttribute('attr1');
      expect(result.length).toBe(20);
    });

    it("Should find elements that don't have the attr1 attribute", function(){
      var result = mrNameSpace.Elements(container).findByAttribute('attr1', null);
      expect(result.length).toBe(8);
    });

    it("Should find elements that have the attr1 attribute with the value 'eight'", function(){
      var result = mrNameSpace.Elements(container).findByAttribute('attr1', 'eight');
      expect(result.length).toBe(8);
    });

    it("Should find elements that have the attr1 attribute with the value 'one'", function(){
      var result = mrNameSpace.Elements(container).findByAttribute('attr1', 'one');
      expect(result.length).toBe(1);
    });

    it("Shouldn't find elements that have the attr1 attribute with the value 'five'", function(){
      var result = mrNameSpace.Elements(container).findByAttribute('attr1', 'five');
      expect(result.length).toBe(0);
    });
  });

  describe("findFirstByAttribute: ", function(){
    var container;
    beforeEach(function() {
      loadFixtures('elements.html');
      container = document.getElementById('container');
    });

    it("Should find the first element that has the attr1 attribute no matter its value", function(){
      var result = mrNameSpace.Elements(container).findFirstByAttribute('attr1');
      expect(result).toExist();
      expect(result.id).toBe('first-arrt1');
    });

    it("Should find the first element that doesn't have the attr1 attribute", function(){
      var result = mrNameSpace.Elements(container).findFirstByAttribute('attr1', null);
      expect(result.id).toBe('first-no-arrt1');
    });

    it("Should find the first element that has the attr1 attribute with the value 'eight'", function(){
      var result = mrNameSpace.Elements(container).findFirstByAttribute('attr1', 'eight');
      expect(result.id).toBe('first-eight');
    });

    it("Should find the first element that has the attr1 attribute with the value 'two'", function(){
      var result = mrNameSpace.Elements(container).findFirstByAttribute('attr1', 'two');
      expect(result.id).toBe('first-two');
    });

    it("Shouldn't find any first element that has the attr1 attribute with the value 'five'", function(){
      var result = mrNameSpace.Elements(container).findFirstByAttribute('attr1', 'five');
      expect(result).toBe(null);
    });
  });

  describe("filterByAttribute: ", function(){
    var collection;
    beforeEach(function() {
      loadFixtures('elements.html');
      var container = document.getElementById('container');
      collection = mrNameSpace.Elements(container).findByAttribute('attr1');
    });

    it("Should filter every element that has the color attribute no matter its value", function(){
      var result = collection.filterByAttribute('color');
      expect(result.length).toBe(12);
    });

    it("Should filter every element that hasn not the color attribute", function(){
      var result = collection.filterByAttribute('color', null);
      expect(result.length).toBe(8);
    });

    it("Should filter every element that has the color attribute with the value 'red'", function(){
      var result = collection.filterByAttribute('color', 'red');
      expect(result.length).toBe(9);
    });

    it("Should filter every element that has the color attribute with the value 'black'", function(){
      var result = collection.filterByAttribute('color', 'black');
      expect(result.length).toBe(1);
    });

    it("Shouldn return an empty Array due to no color green is present", function(){
      var result = collection.filterByAttribute('color', 'green');
      expect(result.length).toBe(0);;
    });
  });
});
