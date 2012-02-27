var expect = require('chai').expect;

var ZipLock = require('../lib/ziplock');

describe('ZipLock', function() {
  var cache;
  beforeEach(function() {
    cache = new ZipLock('name', 500);
  });
  describe('#init', function() {
    it('should set name', function() {
      expect(cache.name).to.equal('name');
    });
    it('should set default expiration', function() {
      expect(cache.expiration).to.equal(500);
    });
  });
  describe('#set', function() {
    it('should add to cache', function() {
      cache.set('key', 'value');
      var expires = new Date().getTime() + 500;
      expect(cache._cache['key'].value).to.equal('value');
      expect(cache._cache['key'].expires).to.equal(expires);
    });

    it('should trigger a callback', function() {
      cache.set('key', 'value', function(err, cacheValue) {
        expect(cacheValue.expires).to.exist;
        expect(cacheValue.value).to.equal('value');
      });
      
    });

    it('should take a custom expires time', function() {
      cache.set('key', 'value', 1000);
      var expires = new Date().getTime() + 1000;
      expect(cache._cache['key'].expires).to.equal(expires);
    });
  });

  describe('#get', function() {
    it('should return if not expired', function(done) {
      cache.set('key', 'value');
      cache.get('key', function(err, value) {
        expect(value).to.equal('value');
        done();
      });
    });
    it('should return null if expired', function(done) {
      cache.set('key', 'value', -1000);
      cache.get('key', function(err, value) {
        expect(value).to.not.exist;
        done();
      });
    });
    it('should remove key from cache if expired', function(done) {
      cache.set('key', 'value', -1000);
      cache.get('key', function(err, value) {
        expect(value).to.not.exist;
        expect(cache._cache['key']).to.not.exist;
        done();
      });
    });
    it('should remove key from cache if expired', function(done) {
      cache.set('key', 'value', 10);
      setTimeout(function() {
        cache.get('key', function(err, value) {
          expect(value).to.not.exist;
          expect(cache._cache['key']).to.not.exist;
          done();
        });
      }, 11);
    });
    it('should not error if key not defined', function(done) {
      cache.get('key1', function(err, value) {
        expect(value).to.not.exist;
        done();
      });
    });
    it('should set a default value if the key doesn\'t exist', function(done) {
      cache.get('key1', function(err, value) {
        expect(value).to.equal('value')
        done();
      }, 'value');
      
    });
    
  });

  describe('#remove', function() {
    it('should remove from cache', function(done) {
      cache.set('key', 'value');
      cache.remove('key');
      cache.get('key', function(err, value) {
        expect(value).to.not.exist;
        expect(cache._cache['key']).to.not.exist;
        done();
      });
    });
    
    
  });
});
