backbone-idb
============

Backbone [IndexedDB](https://developer.mozilla.org/en-US/docs/IndexedDB) adapter with cross browser support via [IDBWrapper](https://github.com/jensarps/IDBWrapper)

<!-- [![browser support](http://ci.testling.com/vincentmac/backbone-idb.png)](http://ci.testling.com/vincentmac/backbone-idb) -->

<!-- [![Build Status](https://travis-ci.org/vincentmac/backbone-idb.png)](https://travis-ci.org/vincentmac/backbone-idb) -->
[![Build Status](https://drone.io/github.com/vincentmac/backbone-idb/status.png)](https://drone.io/github.com/vincentmac/backbone-idb/latest)

[IDBWrapper tutorial Part 1 - Basic CRUD](http://jensarps.de/2011/11/25/working-with-idbwrapper-part-1/)

[IDBWrapper tutorial Part 2 - Indexes and Query](http://jensarps.de/2012/11/13/working-with-idbwrapper-part-2/)

See tests for usage until I get some more time to fully document.

## Dependencies
- [Backbone](https://github.com/jashkenas/backbone)
- [LoDash](https://github.com/lodash/lodash) (or [Underscore](https://github.com/jashkenas/underscore/))
- [IDBWrapper](https://github.com/jensarps/IDBWrapper)

## Obtaining backbone-idb

Available via `npm`

```Shell
$ npm install backbone-idb
# or
$ npm install backbone-idb --save # to install and save to package.json
```

Also available via `bower`
```Shell
$ bower install backbone-idb
# or
$ bower install backbone-idb --save # to install and save to bower.json
```

## Usage

Define a `Backbone.Model` or `Backbone.Collection` with an `indexedDB` property in the initialize function.


```JavaScript
var Note = Backbone.Model.extend({});

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

  model: Note
});
```

The first parameter passed into Backbone.IndexedDB is the `options` object.  You may pass in an empty object and have the default attributes set for the store (defaults listed below).  Any options that you pass in will override the defaults.
```JavaScript
// The default options object set on the Collection/Model
var options = {
  storeName: 'Store',
  storePrefix: '',
  dbVersion: 1,
  keyPath: 'id',
  autoIncrement: true,
  onStoreReady: defaultReadyHandler,
  onError: defaultErrorHandler,
  indexes: []
};
```

Since [indexedDB is asynchronous](https://developer.mozilla.org/en-US/docs/IndexedDB) in nature, we need to update the way we instantiate a new Collection or Model.  By default, backbone-idb will trigger `idb:ready` on the object.  This behaviour can be overridden by setting your own callback function on the `onStoreReady` attribute in the options object.


```JavaScript
var notes = new Notes();

notes.once('idb:ready', function() {
  // Some actions to take after initializing the new collection
});
```

Collections/Models can now use the same Backbone.sync api to interact with IndexedDB; however, you will need to add your own success callback and, optionally, your own error callback in the options parameter.

```JavaScript
notes.fetch({success: function() {
  // fetch success handler
}});

var note = new Note();

notes.add(note);
note.save({title: 'some note title'}, {success: function() {
  // save success handler
}});
```

### TODO

- Document retrieving models from a store by an `index` via the `iterate` command
- Document keyRanges
- Proxying directly to `idb-wrapper` via the `indexedDB.store` object



