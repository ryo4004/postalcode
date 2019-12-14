# Postal Code

This is an API application for Japanese postal code made with Node.js.
Send the postal code as post request, you can get the place name that is estimated.

## Installation

Prepare an environment with Node.js installed.

Clone Repository.

```
git clone https://github.com/ryo4004/postalcode.git && cd postalcode
```

Install dependencies.

```
npm i
```

## Prepare

Prepare asset file.
From now on, you work in the asset directory.

```
cd asset
```

You have to get the CSV data for postal code from <a href='https://www.post.japanpost.jp/zipcode/download.html'>here</a>.
This project uses "読み仮名データの促音・拗音を小書きで表記するもの" > "全国一括" file.

```
wget https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip
unzip ken_all.zip
mv ken_all [download date]
```
