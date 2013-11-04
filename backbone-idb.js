/**
 * Backbone Indexed DB Adapter
 * Version 0.0.1
 *
 * http://github.com/vincentmac/backbone-idb
 */
(function (root, factory) {
  if (typeof exports === 'object' && root.require) {
    module.exports = factory(require('underscore'), require('backbone'));
  } else if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], function(_, Backbone) {
      return factory(_ || root._, Backbone || root.Backbone);
    });
  } else {
    factory(_, Backbone);
  }
}(this, function(_, Backbone) {

}));