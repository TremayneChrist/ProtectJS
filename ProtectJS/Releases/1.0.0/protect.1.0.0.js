var protect;

(function () {

	var validCall = false;

    // Builds the protection of an object
	protect = function (object) {
        object = protect_constructor(object);
		object.prototype._ = {};
		for (var key in object.prototype) {
			if (key == '_') continue;
			if (key.indexOf('_') == 0 && typeof object.prototype[key] === 'function') {
				protect_private(object, key);
			}
			else {
				protect_public(object, key);
			}
		}
		return object;
	}

    // Parses the constructor to allow it to call private methods
	function protect_constructor(object) {
        var result, fn, prototypeCopy = object.prototype;
		eval('fn = ' + object.toString().replace(/\._/g, '._.'));
		object = function () {
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
        object.prototype = prototypeCopy;
        return object;
	}

    // Parses public methods to allow them to call private ones
	function protect_public(object, key) {
        var result, fn;
        eval('fn = ' + object.prototype[key].toString().replace(/\._/g, '._.'));
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

    // Protects private methods from outside calls
	function protect_private(object, key) {
		var fn = object.prototype[key];
		object.prototype._[key.substring(1)] = function () {

			if (validCall === true) {
			   return fn.apply(this, arguments);
			}
          
			throw 'You cannot call a private method';
		}
        delete object.prototype[key];
	}
    
})();