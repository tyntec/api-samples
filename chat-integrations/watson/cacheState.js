const LRU = require("lru-cache");

const cache = new LRU(1);

console.log("Caching initiated!");

function setNewSession(sessionID) {
  cache.set("currentSession", sessionID);
  return sessionID;
}

function getCurrentSession() {
  const sessionId = cache.get("currentSession");
  return sessionId;
}

module.exports = { getCurrentSession, setNewSession };
