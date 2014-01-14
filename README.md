backbone-idb
============

Backbone IndexedDB adapter with cross browser support via IDBWrapper

<!-- [![browser support](http://ci.testling.com/vincentmac/backbone-idb.png)](http://ci.testling.com/vincentmac/backbone-idb) -->

<!-- [![Build Status](https://travis-ci.org/vincentmac/backbone-idb.png)](https://travis-ci.org/vincentmac/backbone-idb) -->


[IDBWrapper tutorial Part 1 - Basic CRUD](http://jensarps.de/2011/11/25/working-with-idbwrapper-part-1/)

[IDBWrapper tutorial Part 2 - Indexes and Query](http://jensarps.de/2012/11/13/working-with-idbwrapper-part-2/)

See tests for usage until I get some more time to fully document.

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

  idbStore: null,

  model: Note
});
```
