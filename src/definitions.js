exports.CHUNK_SIZE = 2;
exports.REDIS_KEY_PREFIX = 'activities';

// TODO: Use integers instead of text to add extra priority levels later if needed.
exports.EPriority = {
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low',
};