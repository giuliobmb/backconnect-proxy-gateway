const ProxyChain = require('proxy-chain');
const readArr = require('./poolFormatter');
const User = require('./database');
const api = require('./api');

let proxies = readArr('pool.txt');

let requestinfo = {}

const server = new ProxyChain.Server({
    port: 8000,
    verbose: true,
    prepareRequestFunction: async ({ request, username, password, hostname, port, isHttp, connectionId }) => {
        requestinfo = {username, password, connectionId};
        let result = await User.findOne({username, password}).exec();
        if(result != null && result.bandwith > 500){
            let upstreamProxyUrl = proxies[Math.floor(Math.random() * ((proxies.length-1) - 0) + 0)];
            console.log("Using proxy: " + upstreamProxyUrl);
            auth = false;
            return {
                requestAuthentication: auth,
                upstreamProxyUrl,
            };
        }
        else{
            auth = true;
            return {
                requestAuthentication: auth,
                failMsg: 'Bad username or password, please try again.',
            };
        }
    },
});
 
server.listen(() => {
  console.log(`Proxy server is listening on port ${server.port}`);
  api();
});
 
// Emitted when HTTP connection is closed
server.on('connectionClosed', ({ connectionId, stats}) => {
    console.log(requestinfo);
    updateUsers(requestinfo, stats);
    console.log(`Connection ${connectionId} closed`);
    console.dir(stats);
});
 
// Emitted when HTTP request fails
server.on('requestFailed', ({ request, error }) => {
    console.log(`Request ${request.url} failed`);
    console.error(error);

});

let updateUsers = async (reqInfo, stats) => {
    let result = await User.findOne({username: reqInfo.username, password: reqInfo.password}).exec();
    let nbandwith = result.bandwith-stats.srcTxBytes;
    await User.findOneAndUpdate({username: reqInfo.username, password: reqInfo.password}, {bandwith: nbandwith}).exec();
}