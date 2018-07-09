const http = require('http');
const { createClient: grpcClient } = require('../src/grpc-client');
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

suite
  .add('GRPC', { defer: true, fn: grpcGreet })
  .add('GRPC#NAME', { defer: true, fn: grpcGreetName })
  .add('REST', { defer: true, fn: restGreet })
  .add('REST#NAME', { defer: true, fn: restGreetName })
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

function restGreetName(deferred) {
  const postData = JSON.stringify({ name: 'Shobhit' });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/greet',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let rawData;
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      deferred.resolve()
    });
  });

  req.on('error', console.log);
  req.write(postData);
  req.end();
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

function grpcGreetName(deferred) {
  grpcClient().then((client) => {
    client.greetDefault({ name: 'Shobhit' }, function (err, res) {
      if (err) {
        return console.log(err);
      }
      return deferred.resolve();
    });
  });
}