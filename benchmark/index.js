const http = require('http');
const { createClient: grpcClient } = require('../src/grpc-client');
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

suite
  .add('GRPC', { defer: true, fn: grpcGreet })
  .add('REST', { defer: true, fn: restGreet })

  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });

function restGreet(deferred) {
  http.get('http://localhost:3000', (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      deferred.resolve()
    });
  }).on('error', console.log);
}

function grpcGreet(deferred) {
  grpcClient().then((client) => {
    client.greetDefault({}, function (err, res) {
      if (err) {
        return console.log(err);
      }
      return deferred.resolve();
    });
  });
}