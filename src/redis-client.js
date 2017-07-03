const bluebird = require('bluebird');
const redis = require('redis');

module.exports = () => {
  bluebird.promisifyAll(redis.RedisClient.prototype);

  return redis.createClient({
    host: '192.168.99.100',
    port: '32768',
  });
};
