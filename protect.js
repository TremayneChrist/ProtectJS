(function () {

  'use strict';

  // The protect object
  var protect = function (_O) {

    var callDepth = 0; // Stores the call depth of the current execution

    var locked = function () {
      return !callDepth;
    };

    var O = _O.prototype || _O; // Protect the prototype, if there is one

    Object.keys(O).forEach(function (key) {

        var value = O[key]; // The original property value
        var isFunction = typeof value === 'function';

        if (key.indexOf('_') === 0) { // Should the object be protected
          Object.defineProperty(O, key, {
            get: function () {
              if (locked()) {
                return undefined;
              }
              else {
                if (!isFunction) {
                  return value;
                }
                return function () {
                  return value.apply(this, arguments);
                };
              }
            },
            set: function () {
              if (!locked()) {
                value = arguments[0];
              }
            },
            enumerable: false // Remove from Object.keys
          });
        }
        else { // Allow functions to retrieve private properties
          Object.defineProperty(O, key, {
            get: function () {
              if (!isFunction) {
                return value;
              }
              return function () {
                var result;
                try {
                  callDepth++;
                  result = value.apply(this, arguments);
                }
                catch (e) {
                  throw e;
                }
                finally {
                  callDepth--;
                }
                return result;
              };
            },
            set: function () {
              value = arguments[0];
            }
          });
        }
    });
  };

  // Make it available for both Node and Browser
  if( typeof exports !== 'undefined' ) {
    if( typeof module !== 'undefined' && module.exports) {
      exports = module.exports = protect;
    }
    exports.protect = protect;
  }
  else {
    this.protect = protect;
  }

}).call(this);
