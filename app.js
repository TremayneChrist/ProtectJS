console.log('************************\nTEST - PUBLIC vs PRIVATE\n************************\n');

var api = new API();
console.log('\nThis is an unprotected object');
console.log('API', api);

var api_protected = new API_PROTECTED();
console.log('\nThis is a protected object');
console.log('API (PROTECTED)', api_protected);