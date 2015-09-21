describe("Element: ", function(){
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/tests/fixtures';
  });
  describe("findByAttribute: ", function(){
    var container;
    beforeEach(function() {
      loadFixtures('fixture-1.html');
      container = document.getElementById('container');
    });
    it("Should find elements that have the attr1 attribute no matter its value", function(){
      var result = Elements(container).findByAttribute('attr1');
      expect(result.length).toBe(20);
    });

    it("Should find elements that don't have the attr1 attribute", function(){
      var result = Elements(container).findByAttribute('attr1', null);
      expect(result.length).toBe(8);
    });

    it("Should find elements that have the attr1 attribute with the value 'eight'", function(){
      var result = Elements(container).findByAttribute('attr1', 'eight');
      expect(result.length).toBe(8);
    });

    it("Should find elements that have the attr1 attribute with the value 'one'", function(){
      var result = Elements(container).findByAttribute('attr1', 'one');
      expect(result.length).toBe(1);
    });

    it("Should find elements that have the attr1 attribute with the value 'four'", function(){
      var result = Elements(container).findByAttribute('attr1', 'four');
      expect(result.length).toBe(4);
    });

    it("Shouldn't find elements that have the attr1 attribute with the value 'five'", function(){
      var result = Elements(container).findByAttribute('attr1', 'five');
      expect(result.length).toBe(0);
    });
  });

  describe("findFirstByAttribute: ", function(){
    var container;
    beforeEach(function() {
      loadFixtures('fixture-1.html');
      container = document.getElementById('container');
    });

    it("Should find the first element that has the attr1 attribute no matter its value", function(){
      var result = Elements(container).findFirstByAttribute('attr1');
      expect(result).toExist();
      expect(result.id).toBe('first-arrt1');
    });

    it("Should find the first element that doesn't have the attr1 attribute", function(){
      var result = Elements(container).findFirstByAttribute('attr1', null);
      expect(result.id).toBe('first-no-arrt1');
    });

    it("Should find the first element that has the attr1 attribute with the value 'eight'", function(){
      var result = Elements(container).findFirstByAttribute('attr1', 'eight');
      expect(result.id).toBe('first-eight');
    });

    it("Should find the first element that has the attr1 attribute with the value 'two'", function(){
      var result = Elements(container).findFirstByAttribute('attr1', 'two');
      expect(result.id).toBe('first-two');
    });

    it("Should find the first element that has the attr1 attribute with the value 'four'", function(){
      var result = Elements(container).findFirstByAttribute('attr1', 'four');
      expect(result.id).toBe('first-four');
    });

    it("Shouldn't find any first element that has the attr1 attribute with the value 'five'", function(){
      var result = Elements(container).findFirstByAttribute('attr1', 'five');
      expect(result).toBe(null);
    });
  });
});
