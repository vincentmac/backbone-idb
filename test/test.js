/* jshint expr: true */
/* global describe, it, before, after, Backbone, _*/
'use strict';
// if (typeof exports === 'object' && typeof require === 'function') {
//   var Backbone = require('backbone');
//   var _ = require('lodash');
//   // var should = require('should');
//   var window = global;
//   // var IDBStore = require('idb-wrapper');
//   var IDBStore = require('../backbone-idb.js');
  
// }

describe('Check for global dependencies', function () {

  it('should have IndexedDB', function (done) {
    // console.log('indexedDB?', window.indexedDB);
    if (window.PHANTOMJS) {
      return done();
    } else {
      (window.indexedDB).should.be.ok;
      done();
    }
    
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
    this.indexedDB = new Backbone.IndexedDB({
      storeName: 'backbone-idb-model'
      // onStoreReady: function() {
      //   window.console.log('indexedDB:OnStoreReady');
      //   Backbone.trigger('indexedDB:ready', this);
      //   // that.trigger('indexedDB:ready', this);
      // }
    }, this);
  },

  idbStore: null
});

describe('Working with a Backbone Model', function () {
  // var model;
  before(function(done) {
    // if (window.indexedDB) {
    //   console.log('try to delete idb');
    //   var delIdb = indexedDB.deleteDatabase('backbone-idb-model');
    //   delIdb;
    // }
    if (window.PHANTOMJS) {
      return done();
    }

    this.model = new TestModel({
      firstname: 'John',
      lastname: 'Doe',
      age: 52,
      email: 'johndoe@example.com'
    });

    this.model.once('idb:ready', function() {
      // console.log('indexedDB:ready');
      done();
    });

  });

  after(function(done) {
    // console.log('after');
    if (window.PHANTOMJS) {
      return done();
    }

    // this.model.idbStore.clear(function() {
    //   done();
    // });

    this.model.idbStore.deleteDatabase();
    done();
  });

  it('should save/create a Backbone Model', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    var that = this;
    this.model.save({}, {success: function(model, resp) {
      (model).should.be.ok;

      // When saving a new item to IndexedDB, IDB-Wrapper will return the key as the response
      (resp).should.be.ok;
      that.model.set({id: resp});
      resp.should.be.type('number');

      done();
    }});
  });

  it('should save/update an existing Backbone Model', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    // var that = this;
    this.model.save({age: 54}, {success: function(model, resp) {
      (model).should.be.ok;
      (resp).should.be.ok;
      (model.get('age')).should.equal(54);

      done();
    }});
  });

  it('should fetch/get an existing Backbone Model', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    var that = this;
    this.model2 = new TestModel({id: this.model.id});

    this.model2.once('idb:ready', function() {
      that.model2.fetch({success: function(model, resp) {
        (model).should.be.ok;
        (resp).should.be.ok;
        (that.model.attributes).should.eql(that.model2.attributes);

        done();
      }});
    });
  });

  it('should destroy/delete a model from the store', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    this.model2.destroy({success: function(removed){
      (removed).should.be.ok;

      done();
    }});
  });


});





