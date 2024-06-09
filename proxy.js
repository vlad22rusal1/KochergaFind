module.exports.proxyRet = proxyRet;
const proxyChain = require("proxy-chain");
async function proxyRet(){
// let seleniumDriver = require("selenium-webdriver");
const proxyUsername = "xHFMfokW69";
const proxyPassword = "Vucm9R7x5D";
const ipHost = "185.5.251.79";
const port = "21226";
const proxyUrl = `http://${proxyUsername}:${proxyPassword}@${ipHost}:${port}`;
const anonymizedProxy = await proxyChain.anonymizeProxy(proxyUrl);
// parse the anonymized proxy URL
const parsedUrl = new URL(anonymizedProxy);
// extract the host and port
const proxyHost = parsedUrl.hostname;
const proxyPort = parsedUrl.port;
const newProxyString = `${proxyHost}:${proxyPort}`;
return newProxyString;
// construct the new proxy string
}