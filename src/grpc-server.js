const grpc = require('grpc');
const loader = require('@grpc/proto-loader');

const HOST = `0.0.0.0:${process.env.PORT || 3000}`;

class GreetingsHandler {
  greetDefault(_, callback) {
    return callback(null, { message: 'Hello world!' });
  }

  greetName(call, callback) {
    return callback(null, { message: `Hello ${call.request.name}!` });
  }
}

const createServer = function (host, handler) {
  loader.load('greet.proto', { includeDirs: ['./src', './'] }).then((packageDefinition) => {
    const { grettings_package } = grpc.loadPackageDefinition(packageDefinition);
    const service = grettings_package.Greeting.service;
    const server = new grpc.Server();
    server.addService(service, handler);
    server.bind(host, grpc.ServerCredentials.createInsecure());
    server.start();
  });
}

createServer(HOST, new GreetingsHandler);

console.log(`Server running on ${HOST}`);