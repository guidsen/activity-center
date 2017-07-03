const redis = require('./redis-client')();
const emitter = require('./emitter');
const { EPriority, REDIS_KEY_PREFIX, CHUNK_SIZE } = require('./definitions');

const processQueue = (priority = EPriority.NORMAL) => {
  const transaction = redis.multi();
  transaction.lrange(`${REDIS_KEY_PREFIX}:${priority}`, 0, CHUNK_SIZE - 1);
  transaction.ltrim(`${REDIS_KEY_PREFIX}:${priority}`, CHUNK_SIZE, -1);

  transaction.exec((err, [result]) => {
    if (err) throw err;

    if (result.length === 0) {
      console.log('No more activities left.');
    }

    result.forEach((value) => {
      const activity = JSON.parse(value);

      emitter.process(activity);
    });
  });
};

const main = async () => {
  const transaction = redis.multi();
  transaction.llen(`${REDIS_KEY_PREFIX}:${EPriority.HIGH}`);
  transaction.llen(`${REDIS_KEY_PREFIX}:${EPriority.NORMAL}`);
  transaction.llen(`${REDIS_KEY_PREFIX}:${EPriority.LOW}`);
  
  transaction.exec(async (err, [highCount, normalCount, lowCount]) => {
    if (err) throw err;

    if (highCount > 0) {
      processQueue(EPriority.HIGH);
    }

    if (highCount === 0 && normalCount > 0) {
      processQueue(EPriority.NORMAL);
    }

    if (highCount === 0 && normalCount === 0 && lowCount > 0) {
      processQueue(EPriority.LOW);
    }
  });
};

setInterval(main, 2500);
