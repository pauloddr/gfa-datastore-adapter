'use strict'

const {DatabaseAdapter} = require('@gf-apis/core/adapters/DatabaseAdapter')
const Datastore = require('@google-cloud/datastore')

const INVALID_METHOD = new Error('INVALID_METHOD')

class DatastoreAdapter extends DatabaseAdapter {
  constructor (opts) {
    super(opts)
    var options = opts || {}
    var datastoreOpts = {}
    if (options.projectId) {
      datastoreOpts.projectId = options.projectId
    }
    if (options.namespace) {
      datastoreOpts.namespace = options.namespace
    }
    this.datastore = new Datastore(datastoreOpts)
  }

  query (req, res, kind, conditions, callback) {
    var q = this.datastore.createQuery(kind)
    var condition
    for (condition of conditions) {
      q.filter(condition[0], condition[1], condition[2])
    }
    this
      .datastore
      .runQuery(q)
      .then(results => {
        const resources = results[0]
        var resource
        for (resource of resources) {
          resource.id = resource[this.datastore.KEY].id
        }
        callback(null, req, res, resources)
      }).catch(err => {
        callback(err, req, res, null)
      })
  }

  save (req, res, kind, data, method, callback) {
    var key
    if (method === 'insert') {
      key = this.datastore.key(kind)
    } else if (method === 'update') {
      key = this.datastore.key([kind, data.id])
    } else {
      return callback(INVALID_METHOD, req, res)
    }
    this
      .datastore
      .save({
        method: method,
        key: key,
        data: data
      })
      .then(() => {
        callback(null, req, res)
      })
      .catch(err => {
        callback(err, req, res)
      })
  }

  insert (req, res, kind, data, callback) {
    return this.save(req, res, kind, data, 'insert', callback)
  }

  replace (req, res, kind, data, callback) {
    return this.save(req, res, kind, data, 'update', callback)
  }

  delete (req, res, kind, id, callback) {
    var key = this.datastore.key([kind, this.datastore.int(id)])
    this.datastore.delete(key, () => {
      callback(null, req, res)
    })
  }
}

exports.DatastoreAdapter = DatastoreAdapter
