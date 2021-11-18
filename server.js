const ProxyChain = require('proxy-chain');
const readArr = require('./poolFormatter');


let proxies = readArr('pool.txt');

let requestinfo = {}
let users = [
    {
        username: 'giuliobmb',
        password: 'a',
        bandwith: 1000
    },
    {
        username: 'gerino',
        password: 'b',
        bandwith: 1000
    }
]


const server = new ProxyChain.Server({
    // Port where the server will listen. By default 8000.
    port: 8000,
 
    // Enables verbose logging
    verbose: true,
 
    // Custom function to authenticate proxy requests and provide the URL to chained upstream proxy.
    // It must return an object (or promise resolving to the object) with the following form:
    // { requestAuthentication: Boolean, upstreamProxyUrl: String }
    // If the function is not defined or is null, the server runs in simple mode.
    // Note that the function takes a single argument with the following properties:
    // * request      - An instance of http.IncomingMessage class with information about the client request
    //                  (which is either HTTP CONNECT for SSL protocol, or other HTTP request)
    // * username     - Username parsed from the Proxy-Authorization header. Might be empty string.
    // * password     - Password parsed from the Proxy-Authorization header. Might be empty string.
    // * hostname     - Hostname of the target server
    // * port         - Port of the target server
    // * isHttp       - If true, this is a HTTP request, otherwise it's a HTTP CONNECT tunnel for SSL
    //                  or other protocols
    // * connectionId - Unique ID of the HTTP connection. It can be used to obtain traffic statistics.
    prepareRequestFunction: ({ request, username, password, hostname, port, isHttp, connectionId }) => {
        requestinfo = {username, password, connectionId};
        if(checkUser(username, password)){
            let upstreamProxyUrl = proxies[Math.floor(Math.random() * ((proxies.length-1) - 0) + 0)];
            console.log("Using proxy: " + upstreamProxyUrl);
            auth = false;
            return {
                requestAuthentication: auth,
                upstreamProxyUrl,
            };
        }else{
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
});
 
// Emitted when HTTP connection is closed
server.on('connectionClosed', ({ connectionId, stats , username}) => {
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

let checkUser = (username, password) => {
    for(i=0;i<users.length;i++){
        if(username === users[i].username && password === users[i].password && users[i].bandwith > 50)
            return true;
    }
    return false;
}

let updateUsers = (reqInfo, stats) => {
    for(i=0;i<users.length;i++){
        if(users[i].username === reqInfo.username && users[i].password === reqInfo.password)
            users[i].bandwith -= stats.srcTxBytes;
    }
}