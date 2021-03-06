const request = require('request')
const dataCenterUrl = 'http://scan.biut.io:3000/mining-pool/'

const DataCenterHandler = {
  createWallet: function (params, callback) {
    request({
      url: `${dataCenterUrl}createwallet`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  findOutWallet: function (params, callback) {
    request({
      url: `${dataCenterUrl}finditem`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  updateWallet: function (params, callback) {
    request({
      url: `${dataCenterUrl}updatefreezevalue`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  updatePoolAddress: function (params, callback) {
    request({
      url: `${dataCenterUrl}updatepooladdress`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getRelatedMiners: function (params, callback) {
    request({
      url: `${dataCenterUrl}getrelatedminers`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getRelatedMinersPromise: function (params) {
    return new Promise((resovle, reject) => {
      request({
        url: `${dataCenterUrl}getrelatedminers`,
        method: 'POST',
        body: params,
        json: true
      }, (err, res, body) => {
        if (err) throw reject(err)
        resovle(body)
      })
    })
  },

  getMinerLevel: function (params, callback) {
    request({
      url: `${dataCenterUrl}getminertype`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getInvitationDetails: function (params, callback) {
    request({
      url: `${dataCenterUrl}getRewardsHistoryByAddress`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getInvitationDetailsPromise: function (params) {
    return new Promise((resovle, reject) => {
      request({
        url: `${dataCenterUrl}getRewardsHistoryByAddress`,
        method: 'POST',
        body: params,
        json: true
      }, (err, res, body) => {
        if (err) throw reject(err)
        resovle(body)
      })
    })
  },

  addPoolName: function (params, callback) {
    request({
      url: `${dataCenterUrl}updateMiningPoolName`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getMiningPool: function (params, callback) {
    request({
      url: `${dataCenterUrl}getMiningPool`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getTotalPoolProfit: function (params, callback) {
    request({
      url: `${dataCenterUrl}totalPoolProfit`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getMyPoolProfit: function (params, callback) {
    request({
      url: `${dataCenterUrl}myPoolProfit`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  }
}

module.exports = DataCenterHandler
