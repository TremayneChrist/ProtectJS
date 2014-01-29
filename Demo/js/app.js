document.addEventListener('DOMContentLoaded', init);
function init() {
	hljs.initHighlightingOnLoad();
}
function runTest() {
	var TestObject = (function () {
		function TestObject () {
			this.testName = 'Protected object test';
			this.step_6 = function () {
				console.log('Step 6: Pass');
				this.step_7();
			}
			this.step_8 = function () {
				console.log('Step 8: Pass');
				this._end();
			}
			this._init();
		}
		TestObject.prototype = {
			_init: function () {
				console.log('Initialising - ' + this.testName);
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
				var _this = this;
				console.log('Step 3: Pass');
				setTimeout(function () {
					_this._step_4();
				}, 2000);
			},
			_step_4: function () {
				var _this = this;
				console.log('Step 4: Pass');
				setTimeout(function () {
					_this.step_5();
				}, 4000);
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
				}, 5000);
			},
			_end: function () {
				console.log(this.testName = ' completed');
			}
		}

		return protect(TestObject);

	})();
	new TestObject();
}