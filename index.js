'use strict'

const {DatabaseAdapter} = require('@gf-apis/core/adapters/DatabaseAdapter')
const Datastore = require('@google-cloud/datastore')

class DatastoreAdapter extends DatabaseAdapter {
  constructor (opts) {
    super(opts)
    var options = opts || {}
    var dsOpts = {}
    if (options.projectId) {
      dsOpts.projectId = options.projectId
    }
    if (options.namespace) {
      dsOpts.namespace = options.namespace
    }
    this.datastore = new Datastore(dsOpts)
  }

  query (req, res, entity, conditions, callback) {
    var q = this.datastore.createQuery(entity)
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
}

module.exports = DatastoreAdapter
