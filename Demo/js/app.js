document.addEventListener('DOMContentLoaded', init);
function init() {
	hljs.initHighlightingOnLoad();
}
function runTest(obfuscate) {
	var TestObject = (function () {
		function TestObject () {
			var _this = this;
			this.testName = 'Protected object test';
			this.step_6 = function () {
				console.log('Step 6: Pass');
				this.step_7();
			}
			this.step_8 = function () {
				console.log('Step 8: Pass');
				try {
					this._end();
				}
				catch (e) {
					console.warn('Failed to end from within the constructor. Ending...');
					this.end();
				}
			}
			setTimeout(function () {
				_this._init();
			});
		}
		TestObject.prototype = {
			_init: function () {
				console.log('Starting Test...');
				this.step_1();
			},
			step_1: function () {
				console.log('Step 1: Pass');
				this.step_2();
			},
			step_2: function () {
				console.log('Step 2: Pass');
				this._step_3();
			},
			_step_3: function () {
				console.log('Step 3: Pass');
				this._step_4();
			},
			_step_4: function (stage) {
				stage = stage ? stage : 0;
				var _this = this;
				console.log('Step 4' + ('.' + stage) + ': Pass');
				if (stage < 9) {
					setTimeout(function () {
						_this._step_4(stage + 1);
					}, 100);
				}
				else {
					setTimeout(function () {
						_this.step_5();
					}, 1000);
				}
			},
			step_5: function () {
				console.log('Step 5: Pass');
				this.step_6();
			},
			step_7: function () {
				var _this = this;
				console.log('Step 7: Pass');
				setTimeout(function () {
					_this.step_8();
				}, 2000);
			},
			end: function () {
				this._end();
			},
			_end: function () {
				console.log(this.testName + ' completed');
			}
		}
		protect.options.obfuscatePrivateMethods = obfuscate === true;
		return protect(TestObject);
	})();
	return new TestObject();
}