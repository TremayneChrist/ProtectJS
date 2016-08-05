describe('ProtectJS', function () {

  var fn;
  var testObject;
  var autoProtect;
  var expect = chai.expect;

  var test = function () {

    it('Should successfully protect the object', function () {
      fn = function () {
        protect(testObj);
        autoProtect = true;
      }
      // Should show all properties as enumerable
      expect(Object.keys(testObj.prototype || testObj)).lengthOf(14);
      // Should protect the object without any errors
      expect(fn).to.not.throw();
      // Once protected, the enumerable values should only be public ones
      expect(Object.keys(testObj.prototype || testObj)).lengthOf(7);
    });

    it('Should NOT return PRIVATE properties', function () {
      fn = function () {
        return testObj._function();
      }
      expect(testObj._string).to.be.undefined;
      expect(testObj._number).to.be.undefined;
      expect(testObj._object).to.be.undefined;
      expect(testObj._null).to.be.undefined;
      expect(testObj._undefined).to.be.undefined;
      expect(testObj._function).to.be.undefined;
      expect(fn).to.throw();
    });

    it('Should return PUBLIC properties', function () {
      expect(testObj.string).to.equal('Hello Universe');
      expect(testObj.number).to.equal(2016);
      expect(testObj.object).to.not.be.undefined;
      expect(testObj.null).to.be.null;
      expect(testObj.undefined).to.be.undefined;
      expect(testObj.function).to.not.throw();
      expect(testObj.function()).to.equal('Hello Universe 2016');
    });

    it('Should allow PRIVATE methods to be called from PUBLIC ones', function () {
      fn = function () {
        return testObj.public();
      }
      expect(fn).to.not.throw();
      expect(function () {
        return testObj._private();
      }).to.throw();
      expect(fn()).to.equal(2016);
    });

    it('Should allow PUBLIC strings to be set', function () {
      expect(testObj.string).to.equal('Hello Universe');
      testObj.string = 'ProtectJS is cool!';
      expect(testObj.string).to.equal('ProtectJS is cool!');
    });

    it('Should allow PUBLIC numbers to be set', function () {
      expect(testObj.number).to.equal(2016);
      testObj.number *= 2;
      expect(testObj.number).to.equal(4032);
    });

    it('Should NOT allow PUBLIC functions to be set', function () {
      expect(testObj.function).to.not.be.undefined;
      testObj.function = 123;
      expect(testObj.function).to.not.equal(123);
    });

    it('Should NOT allow PRIVATE strings to be set', function () {
      expect(testObj._string).to.be.undefined;
      testObj._string = 'ProtectJS is cool!';
      expect(testObj._string).to.be.undefined;
    });

    it('Should NOT allow PRIVATE numbers to be set', function () {
      expect(testObj._number).to.be.undefined;
      testObj._number = 'ProtectJS is cool!';
      expect(testObj._number).to.be.undefined;
    });

    it('Should NOT allow PRIVATE functions to be set', function () {
      expect(testObj._function).to.be.undefined;
      testObj._function = function () {};
      expect(testObj._function).to.be.undefined;
    });
  };

  describe('Literal Objects', function () {

    before(function () {
      autoProtect = false;
    });

    beforeEach(function () {

      testObj = {

        // Private
        '_string': 'Hello Universe',
        '_number': 2016,
        '_object': {},
        '_null': null,
        '_undefined': undefined,
        '_function': function () {
          return [this._string, this.number].join(' ');
        },

        // Public
        'string': 'Hello Universe',
        'number': 2016,
        'object': {},
        'null': null,
        'undefined': undefined,
        'function': function () {
          return [this.string, this.number].join(' ');
        },

        // Test functions
        public: function () {
          return 10 + this._private();
        },
        _private: function() {
          return 2006;
        }

      };

      if (autoProtect) {
        protect(testObj);
      }

    });

    test(); // Run the generic tests

  });

  describe('Instance Objects', function () {

    before(function () {
      autoProtect = false;
    });

    beforeEach(function () {

      var MyObject = function () {

        // Private
        this._string = 'Hello Universe';
        this._number = 2016;
        this._object = {};
        this._null = null;
        this._undefined = undefined;
        this._function = function () {
          return [this.string, this.number].join(' ');
        };

        // Public
        this.string = 'Hello Universe';
        this.number = 2016;
        this.object = {};
        this.null = null;
        this.undefined = undefined;
        this.function = function () {
          return [this.string, this.number].join(' ');
        };

        // Test functions
        this.public = function () {
          return 10 + this._private();
        }
        this._private = function () {
          return 2006;
        }

        if (autoProtect) {
          protect(this);
        }

      };

      testObj = new MyObject();

    });

    test(); // Run the generic tests

  });

  describe('Prototyped Objects', function () {

    before(function () {
      autoProtect = false;
    });

    beforeEach(function () {

      var MyObject = function () {};

      // Private
      MyObject.prototype._string = 'Hello Universe';
      MyObject.prototype._number = 2016;
      MyObject.prototype._object = {};
      MyObject.prototype._null = null;
      MyObject.prototype._undefined = undefined;
      MyObject.prototype._function = function () {
        return [this.string, this.number].join(' ');
      };

      // Public
      MyObject.prototype.string = 'Hello Universe';
      MyObject.prototype.number = 2016;
      MyObject.prototype.object = {};
      MyObject.prototype.null = null;
      MyObject.prototype.undefined = undefined;
      MyObject.prototype.function = function () {
        return [this.string, this.number].join(' ');
      };

      // Test functions
      MyObject.prototype.public = function () {
        return 10 + this._private();
      }
      MyObject.prototype._private = function () {
        return 2006;
      }

      if (autoProtect) {
        protect(MyObject);
        testObj = new MyObject();
      }
      else {
        testObj = MyObject;
      }

    });

    test(); // Run the generic tests

  });

});
