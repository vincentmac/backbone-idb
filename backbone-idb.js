/**
 * @license
 * Backbone IndexedDB Adapter
 * Version 0.0.1
 * Copyright (c) 2013 Vincent Mac
 *
 * Available under MIT license <https://raw.github.com/vincentmac/backbone-idb/master/LICENSE>
 *
 * http://github.com/vincentmac/backbone-idb
 */
(function (global, factory) {
  'use strict';
  if (typeof exports === 'object' && typeof require === 'function') {
    // CommonJS Module - Register as a CommonJS Module 
    module.exports = factory(require('underscore'), require('backbone'), require('idb-wrapper'), 'CommonJS');
  } else if (typeof define === 'function' && define.amd) {
    // AMD - Register as an anonymouse module
    define(['underscore', 'backbone'], function(_, Backbone) {
      return factory(_ || global._, Backbone || global.Backbone, IDBStore || global.IDBStore, 'AMD');
    });
  } else {
    factory(_, Backbone, IDBStore, 'window');
  }
}(this, function(_, Backbone, IDBStore, method) {
  'use strict';

  // // Generate four random hex digits.
  // function S4() {
  //   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  // }

  // // Generate a pseudo-GUID by concatenating random hexadecimal.
  // function guid() {
  //   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  // }

  var defaultReadyHandler = function () {
    console.log('idb:ready this:', this);
    Backbone.trigger('idb:ready', this);
  };

  var defaultErrorHandler = function (error) {
    throw error;
  };

  var defaults = {
    storeName: 'Store',
    storePrefix: '',
    dbVersion: 1,
    keyPath: 'id',
    autoIncrement: true,
    onStoreReady: defaultReadyHandler,
    onError: defaultErrorHandler,
    indexes: []
  };

  Backbone.IndexedDB = function IndexedDB(options) {
    // this.name = name;
    // console.log(method);

    options = _.defaults(options || {}, defaults);
    this.dbName = options.storePrefix + options.storeName;
    this.store = new IDBStore(options);

    // this.store = new IDBStore({
    //   dbVersion: options.dbVersion || 1,
    //   storePrefix: options.storePrefix || '',
    //   storeName: options.storeName || 'store',
    //   keyPath: options.keyPath || 'id',
    //   autoIncrement: options.autoIncrement || true,
    //   indexes: options.indexes || [],
    //   onStoreReady: options.onStoreReady || function() {
    //     Backbone.trigger('idb:ready');
    //   }
    // });
    
    // console.log('idbstore', IDBStore());

    // this.dbName;
    // this.storeName;
    // this.db;
    // this.store;
    // this.dbVersion

    // // Set defaults with overrides
    // for (var key in defaults) {
    //   this[key] = typeof options[key] !== 'undefined' ? options[key] : defaults[key];
    // }

    // var env = typeof window == 'object' ? window : self;
    // this.idb = env.indexedDB || env.webkitIndexedDB || env.mozIndexedDB;
    // this.keyRange = env.IDBKeyRange || env.webkitIDBKeyRange || env.mozIDBKeyRange;

    // this.features = {
    //   hasAutoIncrement: !env.mozIndexedDB
    // };
    // this.openDB();
  };

  _.extend(Backbone.IndexedDB.prototype, {

    // Save the current state of the model 
    // save: function() {
    //   console.log('save via backbone-idb');
    // },

    create: function(model, options) {
      // console.log('create via backbone-idb', options.success());
      console.log('create via backbone-idb', model.attributes);
      console.log('create via backbone-idb', model.toJSON());
      this.store.put(_.clone(model.attributes), options.success, options.error);

    },

    update: function(model, options) {
      console.log('update via backbone-idb');
    },

    get: function(model, options) {
      console.log('get via backbone-idb');
    },

    findAll: function(options) {

    },

    destroy: function(model, options) {
      if (model.isNew()) {
        return false;
      }
      console.log('destroy via backbone-idb');
    }

  });


  // Backbone.IndexedDB.deleteDatabase = function(name) {
  //   var env = typeof window == 'object' ? window : self;
  //   var idb = env.indexedDB || env.webkitIndexedDB || env.mozIndexedDB;
  //   // console.log('deleteDatabase', name);
  //   if (idb) {
  //     idb.deleteDatabase(name);
  //   }
  // };

  Backbone.IndexedDB.sync = Backbone.idbSync = function(method, model, options) {
    var db = model.indexedDB || model.collection.indexedDB;

    var resp, error;
    console.log('Backbone.IndexedDB.sync', method, model, options);

    // if (method === 'create') {
    //   db.save();
    // }

    switch (method) {
      case 'read':
        console.log('fetch', model.id);
        model.id !== undefined ? db.find(model, options) : db.findAll(options);
        break;
      case 'create':
        if (model.id) {
          db.update(model, options);
        } else {
          db.create(model, options);
        }
        break;
    }
    resp;
    error;

  };

  // Reference original `Backbone.sync`
  Backbone.ajaxSync = Backbone.sync;

  Backbone.getSyncMethod = function(model) {
    if(model.indexedDB || (model.collection && model.collection.indexedDB)) {
      return Backbone.idbSync;
    }

    return Backbone.ajaxSync;
  };

  // Override 'Backbone.sync' to default to idbSync,
  // the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
  Backbone.sync = function(method, model, options) {
    return Backbone.getSyncMethod(model).apply(this, [method, model, options]);
  };

  return Backbone.IndexedDB;
}));