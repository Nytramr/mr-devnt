describe ("JavaScript Application:", function(){
  describe ("When Jasmine Specs designed with ", function(){
    describe("HTML Fixture: ", function(){
      beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'base/tests/fixtures';
      });
      describe("'loadFixtures' Method, ", function(){
        beforeEach(function() {
          loadFixtures('fixture-1.html');
        });
        it("Load fixture from a file", function(){
          expect($j('.myULClass')).toExist();
          expect($j('#my-fixture')).toExist();
        });
      });
    });
  });
});
