'use strict'
const pkgInfo = require('./package.json')
const Extractor = require('./lib/extractor')
const config = require('rc')(pkgInfo.name, {})

const args = require('commander')
.description(pkgInfo.description)
.version(pkgInfo.version)
.option('-c, --city <s>', 'City to get the users from')
.parse(process.argv)

if (typeof args.city !== 'string') {
  console.error('please provide city name, for help use --help argument')
  process.exit(-1)
}

config.city = args.city

const extractor = new Extractor(config)
extractor.run()
.then((list) => list.map((dev) => console.log(dev)))
.catch((e) => console.error(e))
