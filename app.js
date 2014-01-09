console.log('************************\nTEST - PUBLIC vs PRIVATE\n************************\n');

var items = 10000;

console.time('Time to create ' + items + ' (UNPROTECTED)');
for (var i = 0; i < items; i++) {
  var a = new API();
}
console.timeEnd('Time to create ' + items + ' (UNPROTECTED)');

console.time('Time to create ' + items + ' (PROTECTED)');
for (var i = 0; i < items; i++) {
  var a = new API_PROTECTED();
}
console.timeEnd('Time to create ' + items + ' (PROTECTED)');


var api = new API();
console.log('\nThis is an unprotected object');
console.log('API', api);

var api_protected = new API_PROTECTED();
console.log('\nThis is a protected object');
console.log('API (PROTECTED)', api_protected);

console.log('\nWith an uprotected object you can call private methods');
console.log('Calling api._getRandom...');
console.log('result = ' + api._getRandom(5));

console.log('\nWith a protected object, private methods are protected from outsiders');
console.log('Calling the same method...');
console.log('result = ' + api_protected._.getRandom(5));