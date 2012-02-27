var ZipLock = function(name, expiration) {
  this.name = name || '';
  this.expiration = expiration || 1000*60*5;
};

ZipLock.prototype.get = function(key, callback, def) {
  var data = localStorage.getItem(key);
  if (data) data = JSON.parse(data);
  if (data && data.expires > new Date().getTime()) {
    callback(null, data.value);
  } else {
    localStorage.removeItem(key);
    callback(null, def);
  }
};

ZipLock.prototype.set = function(key, value, expires, callback) {
  if (typeof expires === 'function') {
    callback = expires;
    expires = null;
  }

  expires = new Date().getTime() + (expires || this.expiration);
  var data = { expires: expires, value: value };
  localStorage.setItem(key, JSON.stringify(data));
  if (callback) callback(null, data);
};

ZipLock.prototype.remove = function(key, callback) {
  localStorage.removeItem(key);
  if (callback) callback(null);
};
