const grpc = require('grpc');
const loader = require('@grpc/proto-loader');


const createClient = function () {
  return new Promise((resolve) => {
    loader.load('greet.proto', { includeDirs: ['./src'] }).then((packageDefinition) => {
      const { grettings_package } = grpc.loadPackageDefinition(packageDefinition);
      const Client = grettings_package.Greeting;
      const client = new Client('0.0.0.0:8080', grpc.credentials.createInsecure());

      // client.greetDefault({}, function (err, res) {
      //   if (err) {
      //     return console.log(err);
      //   }
      //   return console.log(res);
      // });

      // client.greetName({ name: 'Shobhit' }, function (err, res) {
      //   if (err) {
      //     return console.log(err);
      //   }
      //   return console.log(res);
      // });

      resolve(client);
    });
  });
};

module.exports = {
  createClient,
};