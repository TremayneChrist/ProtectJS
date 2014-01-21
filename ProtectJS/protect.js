var protect;

(function () {

	var validCall = false, privateKeys = [];

  // Builds the protection of an object
	protect = function (object) {
    object = protect_constructor(object);

		// Lists all of the private keys
		eachKeys(object, function (type, object, key) {
			privateKeys.push(key);
		});

		// Add protection checks
		eachKeys(object, true, function (type, object, key) {
			switch (type) {
				case 'PUBLIC': {
					protect_public(object, key);
					break;
				}
				case 'PRIVATE': {
					protect_private(object, key);
					break;
				}
			}
		});

		return object;
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
	function protect_constructor(object) {
    var result, ProtectJS_Object, prototypeCopy = object.prototype;

		ProtectJS_Object = function () {
			validCall = true;
			try {
				result = object.apply(this, arguments);
			}
			catch (e) {
				validCall = false;
				throw e;
			};
			validCall = false;
			return result;
		}
    ProtectJS_Object.prototype = prototypeCopy;
    return ProtectJS_Object;
	}

  // Parses public methods to allow them to call private ones
	function protect_public(object, key) {
    var result, fn = object.prototype[key];
    if (hasPrivateReference(object.prototype[key])) {
			object.prototype[key] = function () {
				publicResult = undefined;
				validCall = true;
				try {
					result = fn.apply(this, arguments);
				}
				catch (e) {
					validCall = false;
					throw e;
				};
				validCall = false;
				return result;
			}
		}
	}

  // Protects private methods from outside calls
	function protect_private(object, key) {
		var fn = object.prototype[key];
		object.prototype[key] = function () {
			if (validCall === true) {
			   return fn.apply(this, arguments);
			}
			throw 'You cannot call a private method';
		}
	}

})();