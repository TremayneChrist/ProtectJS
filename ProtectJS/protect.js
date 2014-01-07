var protect;

(function () {

	var publicResult, calling = false;

	protect = function (object) {
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

	function protect_public(object, key) {
		eval('var copy = ' + object.prototype[key].toString().replace(/\._/g, '._.'));
		object.prototype[key] = function () {
			publicResult = undefined;
			calling = true;
			try {
				publicResult = copy.apply(this, arguments);
			}
			catch (e) {
				calling = false;
				throw e;
			};
			calling = false;
			return publicResult;
		}
	}

	function protect_private(object, key) {
		var copy = object.prototype[key];
		object.prototype._[key.substring(1)] = function () {

			if (calling === false) {
				throw 'You cannot call a private method';
			}
			return copy.apply(object, arguments);
		}
		delete object.prototype[key];
	}
})();