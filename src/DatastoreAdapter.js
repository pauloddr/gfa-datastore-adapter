'use strict'

const {DatabaseAdapter} = require('@gfa/core/adapters/DatabaseAdapter')
const Datastore = require('@google-cloud/datastore')

const INVALID_METHOD = new Error('INVALID_METHOD')

class DatastoreAdapter extends DatabaseAdapter {
  constructor (opts) {
    super(opts)
    this.customId = true
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
    if (conditions) {
      var condition
      for (condition of conditions) {
        if (condition[0] === 'id') {
          condition[0] = '__key__'
          condition[2] = this.generateKey(kind, condition[2])
        }
        q.filter(condition[0], condition[1], condition[2])
      }
    }
    this
      .datastore
      .runQuery(q)
      .then(results => {
        const resources = results[0]
        var resource, key
        for (resource of resources) {
          key = resource[this.datastore.KEY]
          resource.id = key.name || key.id
        }
        callback(null, req, res, resources)
      }).catch(err => {
        callback(err, req, res, null)
      })
  }

  save (req, res, kind, id, data, method, callback) {
    var key
    if (this.customId && method === 'insert') {
      key = this.generateKey(kind, id)
    } else if (method === 'insert') {
      key = this.datastore.key(kind)
    } else if (method === 'update' && id) {
      key = this.generateKey(kind, id)
    } else {
      return callback(INVALID_METHOD, req, res, null)
    }
    var entity = {method, key, data}
    this.datastore.save(entity).then(results => {
      callback(null, req, res, entity.key.name || entity.key.id)
    }).catch(err => {
      callback(err, req, res, null)
    })
  }

  insert (req, res, kind, data, callback) {
    var id = data.id
    delete data.id
    return this.save(req, res, kind, id, data, 'insert', callback)
  }

  replace (req, res, kind, id, data, callback) {
    return this.save(req, res, kind, id, data, 'update', callback)
  }

  delete (req, res, kind, id, callback) {
    var key = this.generateKey(kind, id)
    this.datastore.delete(key, () => {
      callback(null, req, res)
    })
  }

  generateKey (kind, id) {
    if (id) {
      if (/^\d+$/.test(id)) {
        // Integer Key
        return this.datastore.key([kind, this.datastore.int(id)])
      } else {
        // String Key
        return this.datastore.key([kind, id])
      }
    } else {
      return this.datastore.key(kind)
    }
  }
}

exports.DatastoreAdapter = DatastoreAdapter
