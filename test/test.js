/* jshint expr: true */
/* global describe, it */
'use strict';
// var should = require('should');

describe('test', function () {
  it('should return fail', function (done) {
    (true).should.be.ok;
    done();
  });
});