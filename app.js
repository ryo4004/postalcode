const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

const compression = require('compression')
app.use(compression({
  threshold: 0,
  level: 9,
  memLevel: 9
}))

// CORSを許可する
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const path = require('path')
const NeDB = require('nedb')
const lib = require('./asset/library')

const showTime = () => {
  const time = new Date()
  const z = (v) => {
    const s = '00' + v
    return s.substr(s.length - 2, 2)
  }
  return time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + z(time.getHours()) + ':' + z(time.getMinutes()) + ':' + z(time.getSeconds())
}

const createDB = (id) => {
  return new NeDB({
    filename: path.join(__dirname, '/asset/database/' + lib.directory + '/' + id + '.db'),
    autoload: true
  })
}

app.post('/api', (req, res) => {
  const query = req.body.query
  console.log('[' + showTime() + '] /api: ' + query)
  if (query.match(/^[0-9]{3}-?[0-9]{4}$/g)) {
    const postalCode = query.replace(/-/g, '')
    createDB(postalCode.slice(0, -4)).findOne({postalCode}, (error, doc) => {
      console.log({error, doc})
      doc ? delete doc._id : false
      if (error || !doc) return res.json({error: {type: 'notFound'}})
      return res.json({post: doc})
    })
  } else {
    return res.json({error: {type: 'notMatch'}})
  }
})

app.listen(3000)