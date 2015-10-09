describe("HTML filter: ", function(){
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/tests/fixtures';
  });

  describe("initialization: ", function(){
    beforeEach(function() {
      loadFixtures('html-dual-filter.html');
    });

    it("Should throw an Multiple Filters error", function(){
      expect(mrNameSpace.reloadPage).toThrow("Multiple html filters are not allowed");
    });
  });

  fdescribe("filter greater than: ", function(){
    beforeEach(function() {
      loadFixtures('html-filter.html');
      mrNameSpace.reloadPage();
    });

    it("Should filter elements showing only those which are grater than 0", function(){
      document.getElementById('greater-than').value = '0';
      jQuery('#submit').click();
      var result = jQuery('.item:visible');
      expect(result.length).toBe(6);
      expect(location.href).toEndWith('#num-value%3A%3E(0)');
    });

    it("Should filter elements showing only those which are grater than 50", function(){
      document.getElementById('greater-than').value = '50';
      jQuery('#submit').click();
      var result = jQuery('.item:visible');
      expect(result.length).toBe(2);
      expect(location.href).toEndWith('#num-value%3A%3E(50)');
    });

    it("Should filter elements showing only those which are grater than 150", function(){
      document.getElementById('greater-than').value = '150';
      jQuery('#submit').click();
      var result = jQuery('.item:visible');
      expect(result.length).toBe(0);
      expect(location.href).toEndWith('#num-value%3A%3E(150)');
    });
  });
});
