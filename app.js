var api = new API();

console.log('API', api);

console.log('\r\n*******************');
console.log('CALLING PUBLIC');
console.log('*******************');

api.public_1();

console.log('\r\n*******************');
console.log('CALLING PRIVATE');
console.log('*******************');
api._.private_1(1, 2);