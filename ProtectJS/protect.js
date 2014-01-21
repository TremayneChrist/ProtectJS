var protect;

(function () {

	var callerID, privateKeys = [], id = 0;

  // Builds the protection of an object
	protect = function (object) {

		// Create a new ID
		incrementID();

		// Build the constructor
    object = protect_constructor(id, object);

		// Lists all of the private keys
		eachKeys(object, function (type, object, key) {
			privateKeys.push(key);
		});

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
		for (var i = 0; i < privateKeys.length; i++) {
			if (object.toString().indexOf(privateKeys[i] + '(') != -1)
				return true;
		}
		return false;
	}

  // Parses the constructor to allow it to call private methods
	function protect_constructor(id, object) {
    var result, ProtectJS_Object, prototypeCopy = object.prototype;

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

  // Parses public methods to allow them to call private ones
	function protect_public(id, object, key) {
    var result, fn = object.prototype[key];
    if (hasPrivateReference(object.prototype[key])) {
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
		var fn = object.prototype[key];
		object.prototype[key] = function () {
			if (callerID === id) {
			   return fn.apply(this, arguments);
			}
			throw 'You cannot call a private method';
		}
	}

})();