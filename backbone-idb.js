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
    // AMD - Register as an anonymous module
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

  Backbone.IndexedDB = function IndexedDB(options, parent) {
    var that = this;
    this.parent = parent;  // reference to the model or collection

    var defaultReadyHandler = function () {
      // console.log('idb:ready this:', this);  // <IDBStore>
      // console.log('idb:ready that:', that);  // <IndexedDB>
      
      // By default, make the Backbone.IndexedDB available through `parent.idbStore`
      that.parent.idbStore = that;
      // Fire ready event on parent model or collection
      that.parent.trigger('idb:ready', that);
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

    options = _.defaults(options || {}, defaults);
    this.dbName = options.storePrefix + options.storeName;
    this.store = new IDBStore(options);

  };

  _.extend(Backbone.IndexedDB.prototype, {

    /**
     * Add a new model to the store
     *
     * @param {Backbone.Model} model - Backbone model to add to store
     * @param {Object} options - sync options created by Backbone
     * @param {Function} [options.success] - overridable success callback 
     * @param {Function} [options.error] - overridable error callback
     */
    create: function(model, options) {
      // console.log('create via backbone-idb', options.success());
      // console.log('create via backbone-idb', model.attributes);
      this.store.put(_.clone(model.attributes), options.success, options.error);

    },

    /**
     *
     * @param {Backbone.Model} model - Backbone model to update and save to store
     * @param {Object} options - sync options created by Backbone
     * @param {Function} [options.success] - overridable success callback 
     * @param {Function} [options.error] - overridable error callback
     */
    update: function(model, options) {
      // console.log('update via backbone-idb');
      this.store.put(_.clone(model.attributes), options.success, options.error);
    },

    /**
     *
     * @param {Backbone.Model} model - Backbone model to get from store
     * @param {Object} options - sync options created by Backbone
     * @param {Function} [options.success] - overridable success callback 
     * @param {Function} [options.error] - overridable error callback
     */
    read: function(model, options) {
      // console.log('get via backbone-idb');
      this.store.get(model.id, options.success, options.error);
    },

    /**
     *
     * @param {Object} options - sync options created by Backbone
     * @param {Function} [options.success] - overridable success callback 
     * @param {Function} [options.error] - overridable error callback
     */
    findAll: function(options) {

    },

    /**
     *
     * @param {Backbone.Model} model - Backbone model to delete from store
     * @param {Object} options - sync options created by Backbone
     * @param {Function} [options.success] - overridable success callback 
     * @param {Function} [options.error] - overridable error callback
     */
    destroy: function(model, options) {
      if (model.isNew()) {
        return false;
      }
      // console.log('destroy via backbone-idb');
      this.store.remove(model.id, options.success, options.error);
    },

    /**
     * Clears all content the current indexedDB for this collection/model
     *
     * @param {Function} [onSuccess] - success callback 
     * @param {Function} [onError] - error callback
     */
    clear: function(onSuccess, onError) {
      if (typeof onSuccess !== 'function') {
        onSuccess = function onSuccess() {};
      }
      if (typeof onError !== 'function') {
        onError = function onError(err) {
          throw err;
        };
      }
      this.store.clear(onSuccess, onError);
    },

    /**
     * Deletes the current indexedDB for this collection/model
     */
    deleteDatabase: function() {
      this.store.deleteDatabase();
    }

  });



  Backbone.IndexedDB.sync = Backbone.idbSync = function(method, model, options) {
    var db = model.indexedDB || model.collection.indexedDB;

    // var resp, error;
    // console.log('Backbone.IndexedDB.sync', method, model, options);
    // console.log('Backbone.IndexedDB.sync', method);

    switch (method) {
      case 'read':
        model.id !== undefined ? db.read(model, options) : db.findAll(options);
        break;

      case 'create':
        if (model.id) {
          db.update(model, options);
        } else {
          db.create(model, options);
        }
        break;

      case 'update':
        if (model.id) {
          db.update(model, options);
        } else {
          db.create(model, options);
        }
        break;
      case 'delete':
        if (model.id) {
          db.destroy(model, options);
        }
        break;
    }
    // resp;
    // error;

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