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

const fs = require('fs')
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

const checkDB = (id) => {
  try {
    fs.statSync(path.join(__dirname, '/asset/database/' + id + '.db'))
    return true
  } catch (error) {
    if (error.code === 'ENOENT') return false
  }
}

const createDB = (id) => {
  return new NeDB({
    filename: path.join(__dirname, '/asset/database/' + id + '.db'),
    autoload: true
  })
}

app.get('/', function(req, res) {	
  res.send('Demo: https://postalcode.netlify.com')	
})

app.post('/api', (req, res) => {
  const query = req.body.query
  console.log('[' + showTime() + '] /api: ' + query)
  if (query.match(/^[0-9]{3}-?[0-9]{4}$/g)) {
    const postalCode = query.replace(/-/g, '')
    if (!checkDB(postalCode.slice(0, -4))) return res.json({error: {type: 'notFound'}})
    createDB(postalCode.slice(0, -4)).find({postalCode}, (error, doc) => {
      doc.map((each) => delete each._id)
      if (error || doc.length === 0) return res.json({error: {type: 'notFound'}})
      return res.json({postalCode, address: doc})
    })
  } else {
    return res.json({error: {type: 'notMatch'}})
  }
})

app.listen(process.env.PORT || 3000)