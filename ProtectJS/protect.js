var protect;

(function() {

  'use strict';

  var callerID, privateID, privateKeys = {}, originalPrototypes = {}, id = 0;

  // Builds the protection of an object
  protect = function(object, pjsID) {

    var hasPjsID = pjsID !== undefined;

    // Create a new ID
    incrementID();

    // Reset the obfuscation IDs
    resetPrivateID();

    pjsID = pjsID || 'pjs_' + id;

    // Copy and store the current prototype
    var pCopy = {};
    for (var key in object.prototype) {
      pCopy[key] = object.prototype[key];
    }
    storeOriginal(pCopy, pjsID);

    // Lists all of the private keys
    eachKeys(object, function(type, object, key) {
      privateKeys[key] = '_' + privateID++;
    });

    // Build the constructor
    if (!hasPjsID)
      object = protect_constructor(id, object);

    // Add protection checks
    eachKeys(object, true, function(type, object, key) {
      switch (type) {
        case 'PUBLIC':
          {
            protect_public(id, object, key);
            break;
          }
        case 'PRIVATE':
          {
            protect_private(id, object, key);
            break;
          }
      }
    });

    return object;
  };

  // Increments the ID

  function incrementID() {
    id++;
  }

  // Increments the ID

  function resetPrivateID() {
    privateID = 0;
  }

  // Resets the caller ID

  function resetCallerID() {
    callerID = undefined;
  }

  // Stores the original prototype methods

  function storeOriginal(prototype, pjsID) {
    originalPrototypes[pjsID] = prototype;
  }

  // Finds all methods on the prototype chain

  function eachKeys(object, returnPublic, callback) {

    if (!callback && typeof returnPublic === 'function') {
      callback = returnPublic;
      returnPublic = false;
    }

    for (var key in object.prototype) {
      if (key.indexOf('_') === 0 && typeof object.prototype[key] === 'function') {
        callback('PRIVATE', object, key);
      } else if (returnPublic) {
        callback('PUBLIC', object, key);
      }
    }
  }

  // Checks to see whether a function contains references to any private methods

  function getPrivateReferences(object) {
    var keys = [],
      objectString = object.toString();
    for (var key in privateKeys) {
      if (objectString.indexOf(key + '(') != -1)
        keys.push(key);
    }
    return keys;
  }

  // Build the method

  function buildMethod(object, parser) {
    var fn, keys = getPrivateReferences(object);
    if (protect.options.obfuscatePrivateMethods && keys.length) {
      fn = object.toString();
      for (var i = 0; i < keys.length; i++) {
        fn = fn.replace(new RegExp(keys[i], 'g'), privateKeys[keys[i]]);
      }
      eval('object = ' + fn);
    }
    parser(object, keys.length > 0);
  }

  // Parses the constructor to allow it to call private methods

  function protect_constructor(id, object) {
    var result, ProtectJS_Object, prototypeCopy = object.prototype;
    buildMethod(object, function(fn, hasKeys) {
      if (hasKeys) {
        ProtectJS_Object = function() {
          callerID = id;
          try {
            result = fn.apply(this, arguments);
          } catch (e) {
            resetCallerID();
            throw e;
          }
          resetCallerID();
          return result;
        };
        ProtectJS_Object.prototype = prototypeCopy;
      } else {
        ProtectJS_Object = object;
      }
    });
    ProtectJS_Object.pjsID = 'pjs_' + id;
    return ProtectJS_Object;
  }

  // Parses public methods to allow them to call private ones

  function protect_public(id, object, key) {
    buildMethod(object.prototype[key], function(fn, hasKeys) {
      if (hasKeys) {
        var result;
        object.prototype[key] = function() {
          result = undefined;
          callerID = id;
          try {
            result = fn.apply(this, arguments);
          } catch (e) {
            resetCallerID();
            throw e;
          }
          resetCallerID();
          return result;
        };
      }
      object.prototype[key].toString = function() {
        return 'function () {}';
      };
    });
  }

  // Protects private methods from outside calls

  function protect_private(id, object, key) {
    buildMethod(object.prototype[key], function(fn) {
      (object.prototype[protect.options.obfuscatePrivateMethods ?
        privateKeys[key] : key] = function() {
        if (callerID === id) {
          return fn.apply(this, arguments);
        }
        throw 'You cannot call a private method';
      }).toString = function() {
        return 'Protected by ProtectJS';
      };

      if (protect.options.obfuscatePrivateMethods)
        delete object.prototype[key];
    });
  }

  // Code to extend or override a protected object

  function extend_override(object, prototype, allowOverride) {
    var key, original = originalPrototypes[object.pjsID];
    if (!original) {
      throw 'You cannot use \'protect.extend\' to extend an object that has not already been protected';
    }
    for (key in prototype) {
      if (original[key] && !allowOverride) {
        throw 'Trying to extend object failed because object already contains \'' + key + '\'. Use \'protect.override\' instead';
      }
      if (!original[key] && allowOverride) {
        throw 'Trying to override method \'' + key + '\' failed because method does not exist';
      }
      if (typeof prototype[key] !== 'function') {
        throw 'You can only extend protected objects with methods';
      }
      original[key] = prototype[key];
    }
    for (key in original) {
      object.prototype[key] = original[key];
    }
    protect(object, object.pjsID);
  }

  // Extend protected objects
  protect.extend = function(object, prototype) {
    extend_override(object, prototype);
  };

  // Override protected objects
  protect.override = function(object, prototype) {
    extend_override(object, prototype, true);
  };

  protect.options = {
    obfuscatePrivateMethods: false
  };

})();
