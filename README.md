![postalcode](https://user-images.githubusercontent.com/25874594/71135740-d3386e00-2245-11ea-855e-5178bc7c0069.png)

Postal Code is an pplication for Japanese postal code made with Node.js(Express).
The postal code data is created as a NeDB database based on the postal code data published by Japan Post.

Post the postal code as a HTTP request, you can get the place name that is estimated.
You can add a postal code search to your websites.

[Here](README.ja.md) for Japanese guide.

### Demo

[https://postalcode.netlify.com](https://postalcode.netlify.com)

## Usage

### Request parameter

Send request as POST.

| parameter | value | description |
|:--|:--|:--|
| query | string | postal code |

The postal code can be hyphenated or unhyphenated.

### Response field

The result is an array of matching postal codes.
There is a difference between the data in general and office data.
The data type can be determined by `type` parameter.

#### General data

| parameter | value |
|:--|:--|
| type | `general` |
| postalCode | postal code |
| fullAddress | full address |
| address | detail information |
| kana | yomigana(full-width kana) |
| oldPostalCode | old postal code(5 digit) |
| jisCode | jis code |

`address` and `kana` are configured as follows:

| parameter | value |
|:--|:--|
| prefecture | prefecture |
| city | city |
| town | town |

##### Sample response

Example requested in `1000001`.

```json
{
  "postalCode": "1000001",
  "address": [
    {
      "type": "normal",
      "postalCode": "1000001",
      "fullAddress": "東京都千代田区千代田",
      "address": {
        "prefecture": "東京都",
        "city": "千代田区",
        "town": "千代田"
      },
      "kana": {
        "prefecture": "トウキョウト",
        "city": "チヨダク",
        "town": "チヨダ"
      },
      "jisCode": "310",
      "oldPostalCode": "100 "
    }
  ]
}
```

#### Office data

| parameter | value |
|:--|:--|
| type | `office` |
| postalCode | postal code |
| oldPostalCode | old postal code(5 digit) |
| name | name |
| jisCode | jis code |
| fullAddress | full address |
| address | detail information |

The configuration of `address` is as follows:

| parameter | value |
|:--|:--|
| prefecture | prefecture |
| city | city |
| town | town |
| town | detail |

###### Sample response

Example requested in `1008066`.

```json
{
  "postalCode": "1008066",
  "address": [
    {
      "type": "office",
      "postalCode": "1008066",
      "oldPostalCode": "100 ",
      "name": "株式会社 日本経済新聞社",
      "jisCode": "310",
      "fullAddress": "東京都千代田区大手町１丁目３－７",
      "address": {
        "prefecture": "東京都",
        "city": "千代田区",
        "town": "大手町",
        "place": "１丁目３－７"
      }
    }
  ]
}
```

## Installation

Prepare an environment with Node.js installed.

Clone Repository and install dependencies.

```shell
git clone https://github.com/ryo4004/postalcode.git && cd postalcode && npm install
```

Run node app.

```shell
node app.js
```

The Express server starts and listens for requests on port 3000.  
If you want to run it permanently, use pm2 or something.

## Client sample

See [client/index.html](client/index.html).  
You can check also my [demo](https://postalcode.netlify.com).

## Update postal code database

Update the postal code database.
You work in the `asset` directory.

```shell
cd asset
rm -R database
```

### Download the CSV file

Postal code data can be obtained by [郵便番号データダウンロード](https://www.post.japanpost.jp/zipcode/download.html) from Japan Post website.
This project uses the "全国一括" file in "読み仮名データの促音・拗音を小書きで表記するもの" and "最新データのダウンロード" file in "事業所の個別郵便番号".

Download and unzip with the following command.

```shell
wget https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip
wget https://www.post.japanpost.jp/zipcode/dl/jigyosyo/zip/jigyosyo.zip
unzip ken_all.zip
unzip jigyosyo.zip
```

### Creating the Database

Create new NeDB database from the downloaded CSV file.
It will take some time to complete.
Exclude some postal code data because public data contains some data that might not be needed.
The excluded data is placed in `database/except.db`.
All office data is added to the database.

```shell
node make.js; node office.js
```

The postal code data is updated every month, so you need to update the database each time.

## License

Mit license