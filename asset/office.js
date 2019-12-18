const fs = require('fs')
const path = require('path')
const NeDB = require('nedb')
const iconv = require('iconv-lite')
const lib = require('./library')
const postalCSV = iconv.decode(Buffer.from(fs.readFileSync('./' + lib.officeDirectory + '/JIGYOSYO.CSV', 'binary'), 'binary'), 'Shift_JIS')
const postalline = postalCSV.split('\n')
const amount = postalline.length
const rem = (text) => text.slice(0, -1).slice(1)

const createDB = (id) => {
  return new NeDB({
    filename: path.join(__dirname, '/database/' + id + '.db'),
    autoload: true
  })
}

const setItem = (id, item) => {
  return new Promise((resolve, reject) => {
    const db = createDB(id)
    db.insert(item, () => {
      resolve()
    })
  })
}

const exceptDB = new NeDB({
  filename: path.join(__dirname, '/database/except.db'),
  autoload: true
})

const setExceptItem = (except) => {
  return new Promise((resolve, reject) => {
    exceptDB.insert(except, () => resolve())
  })
}

const printEachLine = 1000
const padding = (v, a) => Array(String(a).length - String(v).length + 2).join(' ') + v
const print = (i, exceptCountEach, amount) => {
  if ((process.stdout.columns - (50 + String(amount).length + String(printEachLine).length + 2)) > 0) {
    if (i % printEachLine === 0) {
      if (i !== 0) console.log(padding(i, amount), padding(exceptCountEach, printEachLine))
    } else {
      if (i % 20 === 0) process.stdout.write('*')
    }
  } else {
    if (i % 100 === 0) console.log(padding(i, amount))
  }
}

const make = async () => {

  console.time('insert')
  console.log('start')
  console.log('total:', amount)
  console.log()

  let exceptCount = 0
  let exceptCountEach = 0

  for (let i = 0; i < amount; i++) {

    if (postalline[i] === '') break

    const list = postalline[i].split(',')

    const jisCode = rem(list[0])
    const nameKana = rem(list[1])
    const name = rem(list[2])
    const prefecture = rem(list[3])
    const city = rem(list[4])
    const town = rem(list[5])
    const place = rem(list[6])
    const postalCode = rem(list[7])
    const oldPostalCode = rem(list[8])
  
    const item = {
      type: 'office',
      postalCode,
      oldPostalCode,
      name: name.replace(/　/g, ' '),
      jisCode,
      fullAddress: prefecture + city + town + place,
      address: {
        prefecture, city, town, place
      }
    }
    await setItem(postalCode.slice(0, -4), item)

    print(i, exceptCountEach, amount)
    if (i % 1000 === 0) exceptCountEach = 0
  }

  console.log()
  console.timeEnd('insert')
  console.log('except:', exceptCount)
  console.log('finish')
}

make()