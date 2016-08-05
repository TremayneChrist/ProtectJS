(function () {
  var callDepth = 0;
  var locked = function () {
    return !callDepth;
  }
  window.protect = function (_O) {
    var O = _O.prototype || _O;
    Object.keys(O)
    .forEach(function (key) {
        var original = O[key];
        var isFunction = typeof original === 'function';
        if (key.indexOf('_') === 0) {
          Object.defineProperty(O, key, {
            get: function () {
              if (locked()) {
                return undefined;
              }
              else {
                if (!isFunction) {
                  return original;
                }
                return function () {
                  return original.apply(this, arguments);
                }
              }
            },
            set: function () {
              if (!locked()) {
                original = arguments[0];
              }
            },
            enumerable: false
          })
        }
        else {
          Object.defineProperty(O, key, {
            get: function () {
              if (!isFunction) {
                return original;
              }
              return function () {
                var result;
                try {
                  callDepth++;
                  result = original.apply(this, arguments);
                }
                catch (e) {
                  throw e;
                }
                finally {
                  callDepth--;
                }
                return result;
              }
            },
            set: function () {
              original = arguments[0];
            }
          })
        }
    });
  }
})();
