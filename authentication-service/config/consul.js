// Or, if you're not using a transpiler:
const Eureka = require('eureka-js-client').Eureka;
const stun = require('stun');
const ping = require("ping");
const axios = require("axios");
const Consul = require('consul');






let consulSingleton = null;

async function getConsulSingleton(port=null, seviceName=null){
    if (consulSingleton == null){
        if (port==null || seviceName==null){
            throw new Error(`eurekaSingleton is null when calling getEurekaSingleton(${port}, ${seviceName})`)
        }
        consulSingleton = await getConsulClient(port, seviceName);
    }
    return consulSingleton;
}
module.exports.getConsulSingleton = getConsulSingleton;

async function getConsulClient(thisServicePort, thisServiceName) {
    const ip = (await getIpAndPort()).ipAddr;
    const consulAddr = await getEurekaServerAddr();
    console.log(`Eureka (${consulAddr})`)
    console.log(`Registering ${thisServiceName}  ${ip}:${thisServicePort}`)

    if (typeof thisServicePort === 'string')
        thisServicePort = parseInt(thisServicePort);

    const consul = new Consul({
        host: consulAddr,
        port: 8500,
    });
    await consul.agent.service.register({
        name: thisServiceName,
        address: ip,
        port: thisServicePort,
        check: {
            http: `http://${ip}:${thisServicePort}/health`,
            interval: '10s',
            timeout: '5s',
        },
    });
    return consul;
}

module.exports.getConsulClient = getConsulClient;


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

