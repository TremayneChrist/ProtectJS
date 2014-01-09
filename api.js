var API = (function () {
	function API() {}

	API.prototype = {
		public_1: function () {
			console.log('I am a public method');
			console.log('Calling private method(s)');
			this._private_1('First call', '1');
			this._private_1('Second call', '2');
			this._private_1('Third call', '3');
		},
		public_2: function () {
			console.log('I am public throw');
			throw 'Uh oh!';
		},
		_private_1: function (a, b) {
			console.log('I am private', a, b);
		}
	}

	return protect(API);
})();

