const { 
    LiteClient, 
    LiteRoundRobinEngine, 
    LiteSingleEngine 
} = require('ton-lite-client');
const { servers } = require('./config');
const { intToIPv4 } = require("./util");

const createClient = (servers) => {
    const engines = servers.map(server => {
        const ip = intToIPv4(server.ip);
        const port = server.port;
        const id = server.id;
        const publicKey = Buffer.from(id.key, 'base64');

        return new LiteSingleEngine({
            host: "tcp://" + ip + ":" + port,
            publicKey
        });
    });

    return new LiteClient({
        engine: new LiteRoundRobinEngine(engines)
    });
};

module.exports = createClient(servers);