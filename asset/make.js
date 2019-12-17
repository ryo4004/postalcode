const fs = require('fs')
const path = require('path')
const NeDB = require('nedb')
const lib = require('./library')
const postalCSV = fs.readFileSync('./' + lib.prefDirectory + '/KEN_ALL.CSV', 'utf-8')
const postalline = postalCSV.split('\n')
const amount = postalline.length
const rem = (text) => text.slice(0, -1).slice(1)

const createDB = (id) => {
  return new NeDB({
    filename: path.join(__dirname, '/database/' + lib.prefDirectory + '/' + id + '.db'),
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
  filename: path.join(__dirname, '/database/' + lib.prefDirectory + '/except.db'),
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
  const term = {columns: process.stdout.columns, rows: process.stdout.rows}
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
  let pastPostalCode = ''

  for (let i = 0; i < amount; i++) {

    const list = postalline[i].split(',')
    let address = ''
    let detail = {}
    const postalCode = rem(list[2])
    const place = rem(list[8])
  
    if (pastPostalCode !== postalCode) {
      // update postal code
      pastPostalCode = postalCode
  
      if (place.match(/[（）]/g)) {
        if (place.match(/）/g)) {
          if (place.match(/（/g)) {
            // "（ ）" あり
            address = rem(list[6]) + rem(list[7]) + place.replace(/（.*/g, '')
            detail = {prefecture: rem(list[6]), city: rem(list[7]), town: place.replace(/（.*/g, '')}
          } else {
            // "）" のみ
            // 使用しない
          }
        } else {
          // "（" ではじまり閉じかっこなし
          address = rem(list[6]) + rem(list[7]) + place.replace(/（.*/g, '')
          detail = {prefecture: rem(list[6]), city: rem(list[7]), town: place.replace(/（.*/g, '')}
        }
      } else {
        // 通常
        if (!place.match(/^[０-９]/g)) {
          if (!place.match(/第?[０-９]/g)) {
            address = rem(list[6]) + rem(list[7]) + place.replace(/以下に掲載がない場合/g, '').replace(/.*の次に番地がくる場合/g, '').replace(/.*一円/g, '')
            detail = {prefecture: rem(list[6]), city: rem(list[7]), town: place.replace(/以下に掲載がない場合/g, '').replace(/.*の次に番地がくる場合/g, '').replace(/.*一円/g, '')}
          } else {
            // 岩手県和賀郡西和賀町
            // 岩手県九戸郡洋野町種市
            if (place.match(/、/g)) {
              address = rem(list[6]) + rem(list[7]) + place.replace(/[０-９].*/g, '')
              detail = {prefecture: rem(list[6]), city: rem(list[7]), town: place.replace(/[０-９].*/g, '')}
            } else if (place.match(/地割/g)) {
              address = rem(list[6]) + rem(list[7]) + place.replace(/[０-９].*/g, '')
              detail = {prefecture: rem(list[6]), city: rem(list[7]), town: place.replace(/[０-９].*/g, '')}
            } else {
              address = rem(list[6]) + rem(list[7]) + place.replace(/以下に掲載がない場合/g, '').replace(/.*の次に番地がくる場合/g, '').replace(/.*一円/g, '')
              detail = {prefecture: rem(list[6]), city: rem(list[7]), town: place.replace(/以下に掲載がない場合/g, '').replace(/.*の次に番地がくる場合/g, '').replace(/.*一円/g, '')}
            }
          }
        } else {
          address = rem(list[6]) + rem(list[7]) + place.replace(/以下に掲載がない場合/g, '').replace(/.*の次に番地がくる場合/g, '').replace(/.*一円/g, '')
          detail = {prefecture: rem(list[6]), city: rem(list[7]), town: place.replace(/以下に掲載がない場合/g, '').replace(/.*の次に番地がくる場合/g, '').replace(/.*一円/g, '')}
        }
      }
  
      if (address !== '') {
        const item = {postalCode, address, detail}
        await setItem(postalCode.slice(0, -4), item)
      } else {
        // console.log(rem(list[2]), rem(list[6]), rem(list[7]), rem(list[8]))
        console.log('error')
      }
  
    } else {
      exceptCount++
      exceptCountEach++
      await setExceptItem({postalCode, address: rem(list[6]) + rem(list[7]) + rem(list[8]), detail: {prefecture: rem(list[6]), city: rem(list[7]), town: rem(list[8])}})
    }

    print(i, exceptCountEach, amount)
    if (i % 1000 === 0) exceptCountEach = 0

    if (amount - 1 === i) {
      console.log()
      console.timeEnd('insert')
      console.log('total', i)
      console.log('except:', exceptCount)
      console.log('finish')
    }
  }
}

make()