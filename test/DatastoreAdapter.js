'use strict'

const expect = require('chai').expect
const DatastoreAdapter = require('../')

describe('DatastoreAdapter', function () {
  describe('#query', function () {
    let adapter
    let user

    before(function (done) {
      adapter = new DatastoreAdapter()
      adapter.insert(null, null, 'Usr', {u: 'abc', p: '123'}, done)
    })

    after(function (done) {
      adapter.delete(null, null, 'Usr', user.id, done)
    })

    it('returns matching records', function (done) {
      adapter.query(null, null, 'Usr', [['u', '=', 'abc']], (err, _req, _res, results) => {
        if (err) {
          return done(err)
        }
        user = results[0]
        expect(user).to.exist()
        expect(user.u).to.equal('abc')
        done()
      })
    })
  })
})
