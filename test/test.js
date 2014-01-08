/* jshint expr: true */
/* global describe, it, before, after, indexedDB, Backbone, _*/
'use strict';
// var should = require('should');

describe('Check for global dependencies', function () {

  it('should have IndexedDB', function (done) {
    // console.log('indexedDB?', window.indexedDB);
    if (window.PHANTOMJS) {
      return done();
    }
    (window.indexedDB).should.be.ok;
    done();
  });

  it('should have Backbone as a global', function (done) {
    (Backbone).should.be.ok;
    done();
  });

  it('should have lodash/underscore as a global ', function (done) {
    (_).should.be.ok;
    done();
  });

  it('Backbone should have an IndexedDB object ', function (done) {
    (Backbone.IndexedDB).should.be.ok;
    done();
  });

});

var TestModel = Backbone.Model.extend({
  initialize: function() {

  },

  indexedDB: new Backbone.IndexedDB({
    storeName: 'backbone-idb-model',
    onStoreReady: function() {
      window.console.log('indexedDB:OnStoreReady');
      Backbone.trigger('indexedDB:ready', this);
    }
  }),
  idbStore: null
});

describe('Working with a Backbone Model', function () {
  var model;
  before(function(done) {
    // if (window.indexedDB) {
    //   console.log('try to delete idb');
    //   var delIdb = indexedDB.deleteDatabase('backbone-idb-model');
    //   delIdb;
    // }
    console.log('indexedDB:preready');
    // var that = this;
    // this.model = new TestModel();
    model = new TestModel({
      firstname: 'John',
      lastname: 'Doe',
      age: 52,
      email: 'johndoe@example.com'
    });

    Backbone.on('indexedDB:ready', function(idbStore) {
      console.log('indexedDB:ready', idbStore);
      // that.model.idbStore = idbStore;
      model.idbStore = idbStore;
      done();
    });
    // done();
  });

  after(function(done) {
    // this.model.idbSync.deleteDatabase('backbone-idb-model');
    // this.model.idbStore.deleteDatabase();
    // model.idbStore.deleteDatabase();
    // Backbone.IndexedDB.deleteDatabase('backbone-idb-model');
    // Backbone.IndexedDB.deleteDatabase('backbone-idb-model');
    console.log('after');
    // if (window.indexedDB) {
    //   window.indexedDB.deleteDatabase('store');
    // }
    done();
  });

  it('should create a Backbone.Model', function (done) {
    // this.model.save();
    model.save({}, {success: function(model, resp) {
      console.log('success model', model);
      console.log('success resp', resp);
      model.set({id: resp});
      console.log(model.attributes);
    }});
    // model.save({}, {success: function(resp) {console.log('success saving', resp);}});
    // Backbone.IndexedDB.deleteDatabase('backbone-idb-model');

    done();
  });
});