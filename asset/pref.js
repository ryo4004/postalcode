const fs = require('fs')
const path = require('path')
const NeDB = require('nedb')
const iconv = require('iconv-lite')
const lib = require('./library')
const postalCSV = iconv.decode(Buffer.from(fs.readFileSync('./' + lib.prefDirectory + '/KEN_ALL.CSV', 'binary'), 'binary'), 'Shift_JIS')
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

const toFullKana = (str) => {
  const mapDakuon = {
    'ｶﾞ':'ガ','ｷﾞ':'ギ','ｸﾞ':'グ','ｹﾞ':'ゲ','ｺﾞ':'ゴ',
    'ｻﾞ':'ザ','ｼﾞ':'ジ','ｽﾞ':'ズ','ｾﾞ':'ゼ','ｿﾞ':'ゾ',
    'ﾀﾞ':'ダ','ﾁﾞ':'ヂ','ﾂﾞ':'ヅ','ﾃﾞ':'デ','ﾄﾞ':'ド',
    'ﾊﾞ':'バ','ﾋﾞ':'ビ','ﾌﾞ':'ブ','ﾍﾞ':'ベ','ﾎﾞ':'ボ',
    'ﾊﾟ':'パ','ﾋﾟ':'ピ','ﾌﾟ':'プ','ﾍﾟ':'ペ','ﾎﾟ':'ポ',
    'ﾜﾞ':'ヷ','ｳﾞ':'ヴ','ｦﾞ':'ヺ'
  }
  const mapFull = [
    '。','「','」','、','・','ヲ','ァ','ィ','ゥ','ェ','ォ','ャ','ュ','ョ','ッ',
    'ー','ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ',
    'タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ',
    'ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ン','゛','゜'
  ]
  return str.replace(/[ｳｶ-ﾄﾊ-ﾎﾜｦ]ﾞ|[ﾊ-ﾎ]ﾟ/g, (match) => mapDakuon[match]).replace(/[｡-ﾟ]/g, (match) => mapFull[match.charCodeAt(0) - 0xFF61])
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
  let pastPostalCode = ''

  for (let i = 0; i < amount; i++) {
    if (postalline[i] === '') break

    const list = postalline[i].split(',')

    const jisCode = rem(list[0])
    const oldPostalCode = rem(list[1])
    const postalCode = rem(list[2])
    const kana = {
      prefecture: rem(list[3]),
      city: rem(list[4]),
      town: rem(list[5])
    }
    const address = {
      prefecture: rem(list[6]),
      city: rem(list[7]),
      town: rem(list[8])
    }
    let newAddress = {}
    let newKana = {}

    if (pastPostalCode !== postalCode) {
      // update postal code
      pastPostalCode = postalCode

      if (address.town.match(/[（）]/g)) {
        if (address.town.match(/）/g) && address.town.match(/（/g)) {
          // "（ ）" あり
          newAddress = {...address, town: address.town.replace(/（.*(、|～|－|・|[０-９]丁|丁目|番地|以上|以降|全域|次のビルを除く|地階・階層不明|その他|[０-９]線|[０-９]^区).*）/g, '').replace(/（.*[０-９]{1,}）/g, '').replace(/（/g, '').replace(/）/g, '')}
          newKana = {...kana, town: kana.town.replace(/\(.*(､|-|－|･|[0-9]ﾁｮｳ|ﾁｮｳﾒ|ﾊﾞﾝﾁ|ｲｼﾞｮｳ|ｲｺｳ|ｾﾞﾝｲｷ|ﾂｷﾞﾉﾋﾞﾙｦﾉｿﾞｸ|ﾁｶｲ･ｶｲｿｳﾌﾒｲ|ｿﾉﾀ|[0-9]ｾﾝ|[0-9]^ｸ).*\)/g, '').replace(/（.*[０-９]{1,}）/g, '').replace(/（/g, '').replace(/）/g, '')}
        } else {
          // "（" ではじまり閉じかっこなし
          newAddress = {...address, town: address.town.replace(/（.*/g, '')}
          newKana = {...kana, town: kana.town.replace(/\(.*/g, '')}
        }
      } else {
        // 通常
        newAddress = {...address, town: address.town.replace(/以下に掲載がない場合/g, '').replace(/.*の次に番地がくる場合/g, '').replace(/(^[^一].*)一円$/g, '$1')}
        newKana = {...kana, town: kana.town.replace(/ｲｶﾆｹｲｻｲｶﾞﾅｲﾊﾞｱｲ/g, '').replace(/.*ﾉﾂｷﾞﾆﾊﾞﾝﾁｶﾞｸﾙﾊﾞｱｲ/g, '').replace(/^[^ｲ].*ｲﾁｴﾝ$/g, '')}
      }

      if (newAddress.town.match(/地割/g)) {
        newAddress = {...newAddress, town: newAddress.town.replace(/第?[０-９]*地割.*/g, '')}
        newKana = {...newKana, town: newKana.town.replace(/(ﾀﾞｲ)?[0-9]*ﾁﾜﾘ.*/g, '')}
      }

      const item = {
        type: 'general',
        postalCode,
        fullAddress: newAddress.prefecture + newAddress.city + newAddress.town,
        address: newAddress,
        kana: {
          prefecture: toFullKana(newKana.prefecture),
          city: toFullKana(newKana.city),
          town: toFullKana(newKana.town)
        },
        jisCode,
        oldPostalCode
      }
      await setItem(postalCode.slice(0, -4), item)

    } else {
      exceptCount++
      exceptCountEach++
      const exceptItem = {
        type: 'general',
        postalCode,
        fullAddress: address.prefecture + address.city + address.town,
        address,
        kana: {
          prefecture: toFullKana(kana.prefecture),
          city: toFullKana(kana.city),
          town: toFullKana(kana.town)
        }
      }
      await setExceptItem(exceptItem)
    }

    print(i, exceptCountEach, amount)
    if (i % 1000 === 0) exceptCountEach = 0
  }

  console.log()
  console.timeEnd('insert')
  console.log('except:', exceptCount)
  console.log('finish')
}

make()