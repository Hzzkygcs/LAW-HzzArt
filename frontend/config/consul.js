
const stun = require('stun');
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
    console.log(`Consul (${consulAddr})`)
    console.log(`Registering ${thisServiceName}  ${ip}:${thisServicePort}. 
    Instance id: ${getInstanceId(thisServiceName, ip)}`)

    if (typeof thisServicePort === 'string')
        thisServicePort = parseInt(thisServicePort);

    const consul = new Consul({
        host: consulAddr,
        port: 8500,
    });
    await consul.agent.service.register({
        name: thisServiceName,
        id: getInstanceId(thisServiceName, ip),
        address: ip,
        port: thisServicePort,
        check: {
            http: `http://${ip}:${thisServicePort}/health`,
            interval: '10s',
            timeout: '5s',
        },
    });
    console.log("Registered to Consul successfully");
    return consul;
}
module.exports.getConsulClient = getConsulClient;



async function getAnyHealthyServiceHostName(serviceName, fallback, trailingSlash=false) {  // TODO
    let result;
    try{
        result = await getAllHealthyServiceUrl(serviceName);
    }catch (e) {
        console.log(e.message);  // consul err
        result = [];
    }
    console.log(`All healthy service for ${serviceName}: ${JSON.stringify(result)}`)

    let randomChoosen = fallback;
    if (result.length !== 0)
        randomChoosen = result[Math.floor(Math.random() * result.length)];

    if (trailingSlash && !randomChoosen.endsWith('/'))
        randomChoosen += '/';
    if (!trailingSlash && randomChoosen.endsWith('/'))
        randomChoosen = randomChoosen.substring(0, randomChoosen.length-1);

    return randomChoosen;
}
module.exports.getAnyHealthyServiceHostName = getAnyHealthyServiceHostName;

async function getAllHealthyServiceUrl(serviceName) {
    const consul = await getConsulSingleton();
    if (consul == null)
        return [];
    const valid = /^[a-zA-Z\-0-9]+$/.test(serviceName);
    if (!valid){
        for (let i = 0; i < 5; i++) {
            console.log(`INVALID SERVICE NAME getAllHealthyServiceUrl(${serviceName})`);
        }
        return [];
    }

    const members = await consul.health.service({ service: serviceName, passing: true });
    const ret = [];
    for (const member of members) {
        const {Service} = member;
        const {Address, Port} = Service;
        ret.push(`http://${Address}:${Port}`);
    }
    return ret;
}
module.exports.getAllHealthyServiceHostName = getAllHealthyServiceUrl;



function getInstanceId(serviceName, ipAddress) {
    return `${serviceName}-${ipAddress}-${process.env.HOSTNAME}`
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


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

