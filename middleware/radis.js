const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

client.auth(process.env.REDIS_PASS || "kukuduku");

function setValue(key, value, exp) {
  if (typeof exp === 'undefined' || typeof exp === 'null') {
    return client.set(key, value)
  } else {
    return client.setex(key, exp, value)
  }
}

function getValue(key) {
  return client.get(key);
}

function delKey(key) {
  return client.del(key);
}

function setList(key, value) {
  return client.sadd(key, value)
}

function getList(key) {
  return client.smembers(key)
}

// value: value or array
function delListMember(key, value) {
  return client.srem(key, value);
}

function isMember(key, value) {
  return client.sismember(key, value)
}

module.exports = {
  getValue,
  setValue,
  delKey,
  setList,
  getList,
  delListMember,
  isMember
}
