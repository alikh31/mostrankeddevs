'use strict'

require('should')
const pkgInfo = require('../package.json')
const config = require('rc')(pkgInfo.name, {})
const nock = require('nock')
const mockAPI = nock(config.apiUrl)
const berlinUsers = require('./asserts/berlin-users.json')
const usersRepos = require('./asserts/users-repos.json')

config.city = 'berlin'

describe('Basic functionality', function() {
  let Extractor

  before(function() {
    Extractor = require('../lib/extractor')
  })

  it('should get users from github api', function(done) {
    mockAPI.get(/\/search\/users.*/)
    .reply(200, berlinUsers)

    const extractor = new Extractor(config)
    extractor._getUsers()
    .then((res) => {
      res.length.should.eql(5)
      done()
    })
    .catch((e) => done(e))
  })

  it('should handle 400 response for get users', function(done) {
    mockAPI.get(/\/search\/users.*/)
    .reply(400, '')

    const extractor = new Extractor(config)
    extractor._getUsers()
    .catch((e) => {
      done()
    })
  })

  it('should get an specific user score', function(done) {
    const user = 'cloudhead'
    mockAPI.get(/\/search\/repositories.*/)
    .reply(200, usersRepos[user])

    const extractor = new Extractor(config)
    extractor._getUserScore(user)
    .then((score) => {
      score.should.eql(4385)
      done()
    })
    .catch((e) => done(e))
  })


  it('should handle 400 response for get score', function(done) {
    const user = 'cloudhead'
    mockAPI.get(/\/search\/repositories.*/)
    .reply(400, '')

    const extractor = new Extractor(config)
    extractor._getUserScore(user)
    .catch((e) => done())
  })

  it('should handle 400 response for get score', function(done) {
    mockAPI.get(/\/search\/repositories.*/)
    .times(5)
    .reply(200, function(uri, requestBody) {
      const user = /\+user:.*\&sort/.exec(uri)[0]
      .replace('+user:', '')
      .replace('&sort', '')
      return usersRepos[user]
    })

    mockAPI.get(/\/search\/users.*/)
    .reply(200, berlinUsers)

    const extractor = new Extractor(config)
    extractor.run()
    .then((topDevelopers) => {
      topDevelopers.length.should.eql(3)
      topDevelopers[0].should.eql('felixge')
      done()
    })
    .catch((e) => done(e))
  })
})
