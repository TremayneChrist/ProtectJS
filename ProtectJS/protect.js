var protect;

(function () {

	var callerID, privateID, privateKeys = {}, id = 0;

  // Builds the protection of an object
	protect = function (object) {

		// Create a new ID
		incrementID();

		resetPrivateID();

		// Lists all of the private keys
		eachKeys(object, function (type, object, key) {
			privateKeys[key] = '_' + privateID++;
		});

		// Build the constructor
    object = protect_constructor(id, object);

		// Add protection checks
		eachKeys(object, true, function (type, object, key) {
			switch (type) {
				case 'PUBLIC': {
					protect_public(id, object, key);
					break;
				}
				case 'PRIVATE': {
					protect_private(id, object, key);
					break;
				}
			}
		});

		return object;
	}

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

	// Finds all methods on the prototype chain
	function eachKeys(object, returnPublic, callback) {

		if (!callback && typeof returnPublic === 'function') {
			callback = returnPublic;
			returnPublic = false;
		}

		for (var key in object.prototype) {
			if (key.indexOf('_') == 0 && typeof object.prototype[key] === 'function') {
				callback('PRIVATE', object, key);
			}
			else if (returnPublic) {
				callback('PUBLIC', object, key);
			}
		}
	}

	// Checks to see whether a function contains references to any private methods
	function hasPrivateReference(object) {
		var keys = [], objectString = object.toString();
		for (var key in privateKeys) {
			if (objectString.indexOf(key + '(') != -1)
				keys.push(key);
		}
		return keys;
	}

	function buildMethod(keys, methodToParse) {
		if (protect.options.obfusicatePrivateMethods && keys.length) {
			var fn = methodToParse.toString();
			for (var i = 0; i < keys.length; i++) {
	  		fn = fn.replace(new RegExp(keys[i], 'g'), privateKeys[keys[i]]);
	  	}
	  	eval('methodToParse = ' + fn);
	  }
  	return methodToParse;
	}

  // Parses the constructor to allow it to call private methods
	function protect_constructor(id, object) {
    var result, ProtectJS_Object, prototypeCopy = object.prototype,
    keys = hasPrivateReference(object);

    if (keys.length) {
    	object = buildMethod(keys, object);
			ProtectJS_Object = function () {
				callerID = id;
				try {
					result = object.apply(this, arguments);
				}
				catch (e) {
					resetCallerID();
					throw e;
				};
					resetCallerID();
				return result;
			}
	    ProtectJS_Object.prototype = prototypeCopy;
	    return ProtectJS_Object;
	  }
	  return object;
	}

  // Parses public methods to allow them to call private ones
	function protect_public(id, object, key) {
    var result, fn, keys = hasPrivateReference(object.prototype[key]);

    if (keys.length) {
    	fn = buildMethod(keys, object.prototype[key]);
			object.prototype[key] = function () {
				publicResult = undefined;
				callerID = id;
				try {
					result = fn.apply(this, arguments);
				}
				catch (e) {
				resetCallerID();
					throw e;
				};
				resetCallerID();
				return result;
			}
		}
	}

  // Protects private methods from outside calls
	function protect_private(id, object, key) {
		var keys = hasPrivateReference(object.prototype[key]),
    fn = object.prototype[key];

    if (keys.length) {
    	fn = buildMethod(keys, fn);
    }

		object.prototype[protect.options.obfusicatePrivateMethods ?
		privateKeys[key] : key] = function () {
			if (callerID === id) {
			   return fn.apply(this, arguments);
			}
			throw 'You cannot call a private method';
		}

		if (protect.options.obfusicatePrivateMethods)
			delete object.prototype[key];
	}

	protect.options = {
		obfusicatePrivateMethods: true
	}

})();