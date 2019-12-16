![postalcode](https://user-images.githubusercontent.com/25874594/70858752-59ee0200-1f4b-11ea-9a2a-510bcb91e398.png)

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
:---|:---|:---
| query | string | postal code |

The postal code can be hyphenated or unhyphenated.

### Response field

| parameter | value |
:---|:---
| post | |
| ├&nbsp;postalCode | postal code |
| ├&nbsp;address | full address |
| └&nbsp;detail | detail information |
| &nbsp;&nbsp;├&nbsp;prefecture | prefecture |
| &nbsp;&nbsp;├&nbsp;city | city |
| &nbsp;&nbsp;└&nbsp;town | town |

## Installation

Prepare an environment with Node.js installed.

Clone Repository and install dependencies.

```
git clone https://github.com/ryo4004/postalcode.git && cd postalcode && npm install
```

Run node app.

```
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

```
cd asset
rm -R database
```

### Download the CSV file

Postal code data can be obtained by [郵便番号データダウンロード](https://www.post.japanpost.jp/zipcode/download.html) from Japan Post website.
This project uses the "全国一括" file in "読み仮名データの促音・拗音を小書きで表記するもの".

Download and unzip with the following command.

```
wget https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip
unzip ken_all.zip
mv ken_all [download date]
```

### Creating the Database

Create new NeDB database from the downloaded CSV file.
It will take some time to complete.
Exclude some postal code data because public data contains some data that might not be needed.
The excluded data is placed in `database/except.db`.

```
node make.js
```

The postal code data is updated every month, so you need to update the database each time.

## License

Mit license