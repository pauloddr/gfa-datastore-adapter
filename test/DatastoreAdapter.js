'use strict'

const DatastoreAdapter = require('../')
const {behaves} = require('@gfa/core/test/behaviors/DatabaseAdapter')

describe('DatastoreAdapter', function () {
  this.timeout(5000)

  before(function () {
    this.adapter = new DatastoreAdapter()
  })

  behaves.like.a.DatabaseAdapter()
})
