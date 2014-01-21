var protect;

(function () {

	var callerID, privateID, privateKeys = {}, id = 0;

  // Builds the protection of an object
	protect = function (object) {

		// Create a new ID
		incrementID();

		// Reset the obfuscation IDs
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
	function getPrivateReferences(object) {
		var keys = [], objectString = object.toString();
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
			var fn = object.toString();
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
    buildMethod(object, function (fn, hasKeys) {
    	if (hasKeys) {
    		ProtectJS_Object = function () {
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
		    ProtectJS_Object.prototype = prototypeCopy;
    	}
    	else {
    		ProtectJS_Object = object;
    	}
    });
	  return ProtectJS_Object;
	}

  // Parses public methods to allow them to call private ones
	function protect_public(id, object, key) {
    buildMethod(object.prototype[key], function (fn, hasKeys) {
    	if (hasKeys) {
    		var result;
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
			object.prototype[key].toString = function () {
				return 'function () {}';
			}
		});
	}

  // Protects private methods from outside calls
	function protect_private(id, object, key) {
    buildMethod(object.prototype[key], function(fn) {
			(object.prototype[protect.options.obfuscatePrivateMethods ?
			privateKeys[key] : key] = function () {
				if (callerID === id) {
				   return fn.apply(this, arguments);
				}
				throw 'You cannot call a private method';
			}).toString = function () {
				return 'Protected by ProtectJS';
			}

			if (protect.options.obfuscatePrivateMethods)
				delete object.prototype[key];
		});
	}

	protect.options = {
		obfuscatePrivateMethods: false
	}

})();