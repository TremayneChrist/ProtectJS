'use strict';

var fn;
var testObj;
var autoProtect;
var protect = this.protect || require('../protect.js');
var chai = this.chai || require('chai');
var expect = chai.expect;

describe('ProtectJS', function () {

  var test = function (options) {

    options = options || {};

    it('Should successfully protect the object', function () {
      autoProtect = true;
      fn = function () {
        protect(testObj);
      }
      if (!!options.enumerable) {
        // Should show all properties as enumerable
        expect(Object.keys(testObj.prototype || testObj)).lengthOf(16);
      }
      // Should protect the object without any errors
      expect(fn).to.not.throw();
      if (!!options.enumerable) {
        // Once protected, the enumerable values should only be public ones
        expect(Object.keys(testObj.prototype || testObj)).lengthOf(8);
      }
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
      expect(testObj._fn).to.be.undefined;
      expect(fn).to.throw();
    });

    it('Should return PUBLIC properties', function () {
      expect(testObj.string).to.equal('Hello Universe');
      expect(testObj.number).to.equal(2016);
      expect(testObj.object).to.not.be.undefined;
      expect(testObj.null).to.be.null;
      expect(testObj.undefined).to.be.undefined;
      expect(testObj.fn.bind(testObj)).to.not.throw();
      expect(testObj.fn()).to.equal('Hello Universe 2016');
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
    
    it('Should allow PUBLIC functions to be set', function () {
      var newFn = function () {};
      expect(testObj.function).to.not.be.undefined;
      testObj.function = newFn;
      expect(testObj.function).to.equal(newFn);
    });
    
    it('Should allow PUBLIC functions to set PUBLIC & PRIVATE properties', function () {
      var obj = testObj.object;
      var newObj = {};
      expect(obj).to.not.equal(newObj);
      expect(testObj.setFunction(newObj)).to.equal(true);
    });

    it('Should allow PUBLIC properties\' types to be changed', function () {
      fn = function () { return 'fn'; };
      expect(testObj.number).to.equal(2016);
      testObj.number = 'hello';
      expect(testObj.number).to.equal('hello');
      testObj.number = fn;
      testObj.function = 123;
      expect(testObj.number).to.equal(fn);
      expect(testObj.number()).to.equal('fn');
      expect(testObj.function).to.equal(123);
    });

    it('Should allow new PUBLIC functions to access PUBLIC properties', function () {
      testObj.newFn = function () { return this.number; };
      expect(testObj.newFn()).to.equal(2016);
    });

    it('Should NOT allow new PUBLIC functions to access PRIVATE properties', function () {
      testObj.newFn = function () { return this._number; };
      expect(testObj.newFn()).to.be.undefined;
    });
    
    it('Should NOT allow modified PUBLIC functions to access private properties', function () {
      var newFn = function () {
        return 10 + this._private();
      };
      expect(testObj.public()).to.equal(2016);
      testObj.public = newFn;
      expect(testObj.public).to.throw();
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
      expect(testObj._fn).to.be.undefined;
      testObj._fn = function () {};
      expect(testObj._fn).to.be.undefined;
    });

    it('Should NOT allow PRIVATE property access from other objects', function () {
      var obj2 = {
        fn: function () {
          return testObj._fn();
        },
        prop: function () {
          return testObj._number + testObj._string;
        }
      };

      // Unprotected
      expect(obj2.fn).to.throw();
      expect(obj2.prop()).to.be.NaN;

      // Protected
      protect(obj2);
      expect(obj2.fn).to.throw();
      expect(obj2.prop()).to.be.NaN;
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
        '_fn': function () {
          return [this._string, this.number].join(' ');
        },

        // Public
        'string': 'Hello Universe',
        'number': 2016,
        'object': {},
        'null': null,
        'undefined': undefined,
        'fn': function () {
          return [this.string, this.number].join(' ');
        },

        // Test functions
        setFunction: function (newObj) {
          this._object = newObj;
          return newObj === this._setFunction();
        },
        _setFunction: function () {
          this.object = this._object;
          return this.object;
        },
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
        this._fn = function () {
          return [this.string, this.number].join(' ');
        };

        // Public
        this.string = 'Hello Universe';
        this.number = 2016;
        this.object = {};
        this.null = null;
        this.undefined = undefined;
        this.fn = function () {
          return [this.string, this.number].join(' ');
        };

        // Test functions
        this.setFunction = function (newObj) {
          this._object = newObj;
          return newObj === this._setFunction();
        }
        this._setFunction = function () {
          this.object = this._object;
          return this.object;
        }
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
      MyObject.prototype._fn = function () {
        return [this.string, this.number].join(' ');
      };

      // Public
      MyObject.prototype.string = 'Hello Universe';
      MyObject.prototype.number = 2016;
      MyObject.prototype.object = {};
      MyObject.prototype.null = null;
      MyObject.prototype.undefined = undefined;
      MyObject.prototype.fn = function () {
        return [this.string, this.number].join(' ');
      };

      // Test functions
      MyObject.prototype.setFunction = function (newObj) {
        this._object = newObj;
        return newObj === this._setFunction();
      }
      MyObject.prototype._setFunction = function () {
        this.object = this._object;
        return this.object;
      }
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

  describe('ES6 Classes (Instance)', function () {

    before(function () {
      autoProtect = false;
    });

    beforeEach(function () {
      
      class MyObject {

        constructor () {
          
          // Private
          this._string = 'Hello Universe';
          this._number = 2016;
          this._object = {};
          this._null = null;
          this._undefined = undefined;
          this._fn = function () {
            return [this.string, this.number].join(' ');
          };

          // Public
          this.string = 'Hello Universe';
          this.number = 2016;
          this.object = {};
          this.null = null;
          this.undefined = undefined;
          this.fn = function () {
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
        }

      }
      
      testObj = new MyObject();

    });

    test();

  });

  describe('ES6 Classes (Prototype)', function () {

    before(function () {
      autoProtect = false;
    });

    beforeEach(function () {

      let number = 2016; // used for setting in test
      
      class MyObject {

        // Private
        get _string () {
          return 'Hello Universe';
        }
        get _number () {
          return 2016;
        }
        get _object () {
          return {};
        }
        get _null () {
          return null;
        }
        get _undefined () {
          return undefined;
        }
        _fn () {
          return [this.string, this.number].join(' ');
        }

        // Public
        get string () {
          return 'Hello Universe';
        }
        get number () {
          return number;
        }
        // Test needs to set an item
        set number (v) {
          return number = v;
        }
        get object () {
          return {};
        }
        get null () {
          return null;
        }
        get undefined () {
          return undefined;
        }
        fn () {
          return [this.string, this.number].join(' ');
        }

        // Test functions
        public () {
          return 10 + this._private();
        }
        _private () {
          return 2006;
        }

      }
      
      if (autoProtect) {
        protect(MyObject);
        testObj = new MyObject();
      }
      else {
        testObj = MyObject;
      }

    });

    test({ enumerable: false });

  });

});
