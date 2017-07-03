const util = require('util');
const EventEmitter = require('events').EventEmitter;
const redis = require('./redis-client')();
const { EPriority } = require('./definitions');

class ActivityEmitter extends EventEmitter {
  fire(activity) {
    super.emit(`${activity.activity_type}.fire`, activity);
  }

  process(activity) {
    super.emit(`${activity.activity_type}.process`, activity);
  }

  emit() {
    throw new Error('You should use the fire or process method.');
  }
}

const emitter = new ActivityEmitter();

emitter.on('message.created.process', (activity) => {
  console.log('process on activity', activity);
});

emitter.on('message.created.fire', (activity) => {
  const stringifiedActivity = JSON.stringify(activity);

  redis.rpush(`activities:${activity.priority || EPriority.NORMAL}`, stringifiedActivity);
});

module.exports = emitter;