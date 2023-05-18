// Or, if you're not using a transpiler:
const Eureka = require('eureka-js-client').Eureka;
const stun = require('stun');
const ping = require("ping");
const axios = require("axios");
const Consul = require('consul');



let eurekaSingleton = null;

async function getEurekaSingleton(port=null, seviceName=null){
    if (eurekaSingleton == null){
        if (port==null || seviceName==null){
            throw new Error(`eurekaSingleton is null when calling getEurekaSingleton(${port}, ${seviceName})`)
        }
        eurekaSingleton = await getEurekaClient(port, seviceName);
    }
    return eurekaSingleton;
}
module.exports.getEurekaSingleton = getEurekaSingleton;


async function getEurekaClient(thisServicePort, thisServiceName) {
    const ip = (await getIpAndPort()).ipAddr;
    const eurekaAddr = await getEurekaServerAddr();
    console.log(`Eureka (${eurekaAddr})`)

    if (typeof thisServicePort === 'string')
        thisServicePort = parseInt(thisServicePort);

// example configuration
    const client = new Eureka({
        // application instance information
        instance: {
            app: thisServiceName,
            hostName: ip,
            ipAddr: ip,
            port: thisServicePort,
            vipAddress: ip,
            dataCenterInfo: {
                name: 'MyOwn',
            }
        },
        eureka: {
            // eureka server host / port
            host: eurekaAddr,
            port: 8761,
            servicePath: '/eureka/apps/',
        },
    });
    await client.start();
    return client;
}

module.exports.getEurekaClient = getEurekaClient;


async function getIpAndPort() {
    const res = await stun.request('stun.l.google.com:19302');
    const ipAddr = res.getXorAddress().address;
    const port = res.getXorAddress().port;
    return {
        ipAddr: ipAddr,
        port: port,
    };
}

async function getEurekaServerAddr() {
    console.log(`process.env.HZZART_NAVIGATOR_SERVER ${process.env.HZZART_NAVIGATOR_SERVER}`)
    const response = await axios({
        url: process.env.HZZART_NAVIGATOR_SERVER,
        method: "GET",
    });

    return response.data.EurekaElkStack.value;
}

