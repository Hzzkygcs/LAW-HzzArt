// Or, if you're not using a transpiler:
const Eureka = require('eureka-js-client').Eureka;
const stun = require('stun');


module.exports.setupEureka = async function () {
    const res = await stun.request('stun.l.google.com:19302');
    console.log('your ip', res.getXorAddress().address);
    console.log('your port', res.getXorAddress().port);



// example configuration
    const client = new Eureka({
        // application instance information
        instance: {
            app: 'jqservice',
            hostName: 'localhost',
            ipAddr: '127.0.0.1',
            port: 8080,
            vipAddress: 'jq.test.something.com',
            dataCenterInfo: {
                name: 'MyOwn',
            },
        },
        eureka: {
            // eureka server host / port
            host: '192.168.99.100',
            port: 32768,
        },
    });
}