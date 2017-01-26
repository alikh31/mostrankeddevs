'use strict'
const rp = require('request-promise')
const url = require('url')
const async = require('async')

/**
 * Extractor class, holds the logic for extracting data from github api.
 */
class Extractor {

  /**
   * @param {object} config containing name of the city and api url
   * both as string.
   */
  constructor(config) {
    this._city = encodeURIComponent(config.city)
    this.apiUrl = config.apiUrl
  }

  /**
   * @return {promise} if accepted passes array of top users,
   * if rejected passes the specified error.
   */
  _getUsers() {
    return new Promise((accept, reject) => {
      const q = `type:user+language:javascript+location:${this._city}`
      const endpoint = `search/users?q=${q}&sort=followers&order=desc`

      rp({
        uri: url.resolve(this.apiUrl, endpoint),
        json: true
      })
      .then((res) => accept(res.items))
      .catch((e) => reject(e))
    })
  }

  /**
   * computes the users score based summerizing all stars of
   * owned repositories with main language of javascript
   * @param {string} username to compute its score
   * @return {promise} if accepted passes score of a givern user,
   * if rejected passes the specified error.
   */
  _getUserScore(username) {
    return new Promise((accept, reject) => {
      const q = `language:javascript+user:${username}`
      const endpoint = `search/repositories?q=${q}&sort=stars&order=desc&page=1`

      rp({
        uri: url.resolve(this.apiUrl, endpoint),
        json: true
      })
      .then((res) => {
        const score = res.items
        .reduce((a, b) => a + b.stargazers_count, 0)

        accept(score)
      })
      .catch((e) => reject(e))
    })
  }

  /**
   * runner function
   * @return {promise} if accepted passes top three users of a city,
   * if rejected passes the specified error.
   */
  run() {
    return new Promise((accept, reject) => {
      this._getUsers()
      .then((users) => {
        const result = []
        const q = async.queue((user, callback) => {
          this._getUserScore(user.login)
          .then((score) => {
            result.push({username: user.login, score: score})
            callback()
          })
          .catch((e) => callback(e))
        }, 1)

        users.forEach((u) =>q.push(u))
        q.drain = () => {
          result.sort((a, b) => a.score < b.score)
          accept(result.slice(0, 3).map((a) => a.username))
        }
      })
      .catch((e) => reject(e))
     })
   }
}

module.exports = Extractor
