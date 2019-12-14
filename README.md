![postalcode](https://user-images.githubusercontent.com/25874594/70855125-b7149400-1f08-11ea-9f08-c565c10c7db8.png)

Postal Code is an pplication for Japanese postal code made with Node.js(Express).
The postal code data is created as a NeDB database based on the postal code data published by Japan Post.

Post the postal code as a HTTP request, you can get the place name that is estimated.
You can add a postal code search to your websites.

<a href='README.ja.md'>Here</a> for Japanese guide.

### Demo

<a href='https://postalcode.netlify.com/'>https://postalcode.netlify.com/</a>

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
| ├&nbsp;postalCode | 郵便番号 |
| ├&nbsp;address | 住所全文 |
| └&nbsp;detail | 詳細情報 |
| &nbsp;&nbsp;├&nbsp;prefecture | 都道府県名 |
| &nbsp;&nbsp;├&nbsp;city | 市区町村名 |
| &nbsp;&nbsp;└&nbsp;town | 町域名 |

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

See <a href='client/index.html'>client/index.html</a>.  
You can check also <a href='https://postalcode.netlify.com/'>demo</a>.

## Update postal code database

Update the postal code database.
You work in the `asset` directory.

```
cd asset
rm -R database
```

### Download the CSV file

Postal code data can be obtained by <a href='https://www.post.japanpost.jp/zipcode/download.html'>download postal code data</a> from Japan Post website.
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

```
node make.js
```

The postal code data is updated every month, so you need to update the database each time.

## License

Mit license