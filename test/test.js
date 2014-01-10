/* jshint expr:true, unused:false */
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

var Note = Backbone.Model.extend({
  initialize: function() {

  }
});

var Notes = Backbone.Collection.extend({
  initialize: function() {
    this.indexedDB = new Backbone.IndexedDB({
      storeName: 'notes',
      dbVersion: 1,
      keyPath: 'id',
      autoIncrement: true,
      indexes:[
        {name:'tags', keyPath:'tags', unique: false, multiEntry: true},
        // When specifying only the `name`, `keyPath` is assummed to be the same.
        // `unique` and `multiEntry` are also false by default.
        // {name:'titleLC', keyPath:'titleLC', unique: false, multiEntry: false}
        {name:'titleLC'}
      ]
    }, this);
  },

  idbStore: null,

  model: Note

});

describe('Working with a Backbone Collection', function () {
  
  before(function(done) {
    if (window.PHANTOMJS) {
      return done();
    }

    this.notes = new Notes();

    this.notes.once('idb:ready', function() {
      done();
    });
  });

  after(function(done) {
    if (window.PHANTOMJS) {
      return done();
    }
    this.notes.idbStore.deleteDatabase();
    done();
  });

  it('should create a collection with an indexedDB store names `notes`', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }
    // console.log('notes collection name =', this.notes.idbStore.dbName);
    (this.notes.idbStore.dbName).should.equal('notes');

    done();
  });

  it('should save models to the store', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    var title = 'Some note title';
    var body = 'This is some arbitrary note that needs saving';
    var note1 = new Note({
      title: title,
      titleLC: title.toLowerCase(),
      body: body,
      tags: ['test', 'arbitrary']
    });

    this.notes.add(note1);
    note1.save({}, {success: function(model, resp) {
      (model).should.be.ok;
      // When saving a new item to IndexedDB, IDB-Wrapper will return the key as the response
      (resp).should.be.ok;
      note1.set({id: resp});
      resp.should.be.type('number');

      done();
    }});
  });

  it('should save another model to the store', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    var title = 'Second arbitrary note title';
    var body = 'Second arbitrary note that needs saving';
    var note2 = new Note({
      title: title,
      titleLC: title.toLowerCase(),
      body: body,
      tags: ['test', 'arbitrary', 'second']
    });

    this.notes.add(note2);
    note2.save({}, {success: function(model, resp) {
      (model).should.be.ok;
      // When saving a new item to IndexedDB, IDB-Wrapper will return the key as the response
      (resp).should.be.ok;
      note2.set({id: resp});
      resp.should.be.type('number');

      done();
    }});
  });

  it('should be able to fetch a collection from indexedDB', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    var dupCollection = new Notes();

    dupCollection.once('idb:ready', function() {
      dupCollection.fetch({success: function() {
        (dupCollection.length).should.equal(2);
        var note = dupCollection.get(1);
        note.should.be.an.instanceof(Backbone.Model);

        done();
      }});
      
    });


  });

  it('should be able to iterate the store', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    /*
     * @param {Object} dataItem - object representation of the model
     * @param {Object} cursor - IDBCursor
     * @param {Object} transaction - IDBTransaction
     */
    function onItem(dataItem, cursor, transaction) {
      // console.log('dataItem', dataItem);
    }

    function onEnd() {
      // console.log('onEnd');
      done();
    }

    var options = {
      // index: 'lastname',
      // keyRange: myKeyRange,
      // order: 'ASC',
      // filterDuplicates: false,
      // writeAccess: false,
      onEnd: onEnd,
      // onError: onErrorCallback
    };

    this.notes.idbStore.iterate(onItem, options);
    // done();
  });

  it('should be able to iterate over an index in the store', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    /*
     * @param {Object} dataItem - object representation of the model
     * @param {Object} cursor - IDBCursor
     * @param {Object} transaction - IDBTransaction
     */
    function onItem(dataItem, cursor, transaction) {
      // console.log('dataItem', dataItem);
    }

    function onEnd() {
      // console.log('onEnd');
      done();
    }

    var options = {
      index: 'titleLC',
      // keyRange: myKeyRange,
      // order: 'ASC',
      // filterDuplicates: false,
      // writeAccess: false,
      onEnd: onEnd,
      // onError: onErrorCallback
    };

    this.notes.idbStore.iterate(onItem, options);
    // done();
  });

  it('should be able to make a keyRange', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    var options = {
      lower: 'A',
      excludeLower: false,
      upper: 'M',
      excludeUpper: true
    };

    var keyrange = this.notes.idbStore.makeKeyRange(options);
    // console.log(keyrange.constructor);
    // console.log(keyrange);
    keyrange.should.be.an.instanceof(window.IDBKeyRange);
    done();
  });

  it('should be able to iterate over store with an IDBKeyRange or convert a keyRange object to IDBKeyRange', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    /*
     * @param {Object} dataItem - object representation of the model
     * @param {Object} cursor - IDBCursor
     * @param {Object} transaction - IDBTransaction
     */
    function onItem(dataItem, cursor, transaction) {
      // console.log('dataItem', dataItem);
    }

    function onEnd() {
      // console.log('onEnd');
      done();
    }

    var keyRange = this.notes.idbStore.makeKeyRange({
      lower: 'a',
      excludeLower: false,
      upper: 't',
      excludeUpper: true
    });

    var options = {
      index: 'titleLC',
      keyRange: keyRange,
      // order: 'ASC',
      // filterDuplicates: false,
      // writeAccess: false,
      onEnd: onEnd,
      // onError: onErrorCallback
    };

    this.notes.idbStore.iterate(onItem, options);
  });

  it('should be able to iterate over store and convert a keyRange object to IDBKeyRange', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    /*
     * @param {Object} dataItem - object representation of the model
     * @param {Object} cursor - IDBCursor
     * @param {Object} transaction - IDBTransaction
     */
    function onItem(dataItem, cursor, transaction) {
      console.log('dataItem', dataItem);
    }

    function onEnd() {
      // console.log('onEnd');
      done();
    }

    var options = {
      index: 'titleLC',
      keyRange: {
        lower: 'a',
        excludeLower: false,
        upper: 's',
        excludeUpper: true
      },
      // order: 'ASC',
      // filterDuplicates: false,
      // writeAccess: false,
      onEnd: onEnd,
      // onError: onErrorCallback
    };

    this.notes.idbStore.iterate(onItem, options);
  });

  it('should be able to iterate over store and retrieve item by index value', function (done) {
    if (window.PHANTOMJS) {
      return done();
    }

    var tag = 'second';

    /*
     * @param {Object} dataItem - object representation of the model
     * @param {Object} cursor - IDBCursor
     * @param {Object} transaction - IDBTransaction
     */
    function onItem(dataItem, cursor, transaction) {
      console.log('dataItem', dataItem);
      (dataItem.tags).should.include(tag);
    }

    function onEnd() {
      // console.log('onEnd');

      done();
    }

    var options = {
      index: 'tags',
      keyRange: {
        only: tag
      },
      // order: 'ASC',
      // filterDuplicates: false,
      // writeAccess: false,
      onEnd: onEnd,
      // onError: onErrorCallback
    };

    this.notes.idbStore.iterate(onItem, options);
  });

  it('should be able to do batch operations', function (done) {
    done();
  });

  it('should be able to do a batch add', function (done) {
    done();
  });

  it('should be able to do a batch delete', function (done) {
    done();
  });

});






