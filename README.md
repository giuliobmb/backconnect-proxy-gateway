# Backconnect private proxy

Example of proxy server that redirects request over another proxy server based on the client auth and sends the data back to the client.

It uses Proxy-Chain library to manage the network, and an Express server related to a Mongdb database to manage users.

It allows to set a bandwith limit to each user and manage it based on the owner requests made to the API.

IS NOT SAFE TO USE THIS SOFTWARE it's just a proof of work, it needs to be implemented better.

I am planning to build a Java version coding myself the proxy chaining library, if anyone wants to help i am open to work with you.
