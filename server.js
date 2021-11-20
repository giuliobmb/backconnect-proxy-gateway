const ProxyChain = require('proxy-chain');
const readArr = require('./poolFormatter');
const User = require('./database');
const api = require('./api');

let pool1 = readArr('./pool.txt');
let pool2 = readArr('./pool2.txt');

let requestinfo = {}

const server = new ProxyChain.Server({
    port: 8000,
    verbose: true,
    prepareRequestFunction: async ({ request, username, password, hostname, port, isHttp, connectionId }) => {
        let upstreamProxyUrl;
        let pool;
        if(username != null){
            let s = username.split('-');
            if(s.length > 1){
                username = s[0];
                pool = s[1];
            }else{
                username = s[0];
            }
        }
       
        requestinfo = {username, password, connectionId};
        let result = await User.findOne({username, password}).exec();
        console.log(pool);
        if(result != null && result.bandwith > 500){
            switch(pool){
                case 'pool1':
                    upstreamProxyUrl = pool1[Math.floor(Math.random() * ((pool1.length-1) - 0) + 0)];
                    break;
                case 'pool2':
                    upstreamProxyUrl = pool2[Math.floor(Math.random() * ((pool2.length-1) - 0) + 0)];
                    break;
                default:
                    upstreamProxyUrl = pool1[Math.floor(Math.random() * ((pool1.length-1) - 0) + 0)];
            }
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