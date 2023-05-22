const axios = require("axios");


async function getMongoUrlAlongWithCredentials() {
    console.log("Fetching Mongodb URL...");
    const urlWithUsernameAndPassword = getEnv('DATABASE_HOST_URL');

    const hostPartToBeReplaced = "@mongodb";
    console.assert(urlWithUsernameAndPassword.includes(hostPartToBeReplaced));

    const newHost = await getMongoUrlFromNavigator();
    const ret = urlWithUsernameAndPassword.replace(
        hostPartToBeReplaced, `@${newHost}`);
    console.log("Successful fetched Mongodb URL");
    return ret;
}
module.exports.getMongoUrlAlongWithCredentials = getMongoUrlAlongWithCredentials;


async function getMongoUrlFromNavigator() {
    const navigatorUrl = getEnv('MONGODB_NAVIGATOR_URL');
    const mongoIpKey = getEnv('MONGODB_NAVIGATOR_IP_KEY');
    const mongoPortKey = getEnv('MONGODB_NAVIGATOR_PORT_KEY');

    const result = await axios.get(navigatorUrl);
    const ipaddr = result.data[mongoIpKey];
    const port = result.data[mongoPortKey];
    if (ipaddr == null){
        throw new Error(`Invalid key ${mongoIpKey} from ${navigatorUrl}, ${result}`)
    }
    if (port == null){
        throw new Error(`Invalid key ${mongoPortKey} from ${navigatorUrl}, ${result}`)
    }
    return `${ipaddr}:${port}`;
}

getMongoUrlAlongWithCredentials();

function getEnv(name) {
    const ret = process.env[name];
    if (ret == null) {
        throw new Error(`ENV ${name} NOT FOUND!`)
    }
    return ret;
}