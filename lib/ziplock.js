var ZipLock = function(name, expiration) {
  this.name = name || '';
  this.expiration = expiration || 1000*60*5;
  this._cache = {};
};

ZipLock.prototype.get = function(key, callback, def) {
  var data = this._cache[key];
  if (data && data.expires > new Date().getTime()) {
    callback(null, data.value);
  } else {
    delete this._cache[key];
    callback(null, def);
  }
};

ZipLock.prototype.set = function(key, value, expires, callback) {
  if (typeof expires === 'function') {
    callback = expires;
    expires = null;
  }

  expires = new Date().getTime() + (expires || this.expiration);
  this._cache[key] = { expires: expires, value: value };
  if (callback) callback(null, this._cache[key]);
};

ZipLock.prototype.remove = function(key, callback) {
  delete this._cache[key];
  if (callback) callback(null);
};

module.exports = ZipLock;
