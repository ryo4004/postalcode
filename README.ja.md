![postalcode](https://user-images.githubusercontent.com/25874594/70858752-59ee0200-1f4b-11ea-9a2a-510bcb91e398.png)

Postal Codeは、Express(Node.js)で動作する郵便番号を検索するAPIを作成できます。  
郵便番号データは日本郵便が公開している[郵便番号データ](https://www.post.japanpost.jp/zipcode/download.html)を元に[NeDB](https://github.com/louischatriot/nedb)データベースを作成します。

郵便番号をHTTPリクエストでPOSTすると住所を返します。  
お問い合わせフォームやECサイトなどに郵便番号検索機能をつけることができます。

英語の解説は[こちら](README.md)。

### デモ

[https://postalcode.netlify.com](https://postalcode.netlify.com)

## 使い方

### リクエストパラメータ

POSTでパラメータを送信します。  

| パラメータ | 値 | 説明 |
|:--|:--|:--|
| query | string | 郵便番号 |

郵便番号のハイフンはあってもなくてもOKです。

### レスポンスフィールド

郵便番号が合致する住所データが結果として配列で返されます。  
一般と事業所で含まれるデータが異なります。  
データタイプは`type`パラメータで判別できます。

#### 一般データ

| パラメータ | 値 |
|:--|:--|
| type | `general` |
| postalCode | 郵便番号 |
| fullAddress | 住所全文 |
| address | 住所詳細 |
| kana | よみがな(全角カナ) |
| oldPostalCode | 旧郵便番号(5桁) |
| jisCode | 全国地方公共団体コード |

`address`および`kana`の構成は以下のとおりです。

| パラメータ | 値 |
|:--|:--|
| prefecture | 都道府県名 |
| city | 市区町村名 |
| town | 町域名 |

###### レスポンス例

`1000001`でリクエストした例

```
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

#### 事業所データ

| パラメータ | 値 |
|:--|:--|
| type | `office` |
| postalCode | 郵便番号 |
| oldPostalCode | 旧郵便番号(5桁) |
| name | 名称 |
| jisCode | 全国地方公共団体コード |
| fullAddress | 住所全文 |
| address | 住所詳細 |

`address`の構成は以下のとおりです。

| パラメータ | 値 |
|:--|:--|
| prefecture | 都道府県名 |
| city | 市区町村名 |
| town | 町域名 |
| town | 小字名、丁目、番地等 |

###### レスポンス例

`1008066`でリクエストした例

```
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

`address`の構成は以下のとおりです。

| パラメータ | 値 |
|:--|:--|
| prefecture | 都道府県名 |
| city | 市区町村名 |
| town | 町域名 |
| place | 小字名、丁目、番地等 |

## インストールと実行

Node.jsがインストールされた環境を用意します。

リポジトリをクローンし、必要なパッケージをインストールします。

```
git clone https://github.com/ryo4004/postalcode.git && cd postalcode && npm install
```

実行します。

```
node app.js
```

Expressサーバが起動し、3000番ポートでリクエストを待機します。  
永続的に実行する場合はpm2などをご利用ください。

## クライアントサンプル

[client/index.html](client/index.html)参照ください。  
動作は[デモ](https://postalcode.netlify.com)で確認できます。

## 郵便番号データベースの更新

郵便番号データベースを更新します。
作業は`asset`ディレクトリで行います。
古いデータを削除します。

```
cd asset
rm -R database
```

### CSVファイルのダウンロード

郵便番号データは日本郵便のWebサイト内の[郵便番号データダウンロード](https://www.post.japanpost.jp/zipcode/download.html)より取得できます。

このプロジェクトでは「読み仮名データの促音・拗音を小書きで表記するもの」内の「全国一括」ファイルおよび「事業所の個別郵便番号」内の「最新データのダウンロード」を使用しています。

以下のコマンドでダウンロードおよび解凍を行います。

```
wget https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip
wget https://www.post.japanpost.jp/zipcode/dl/jigyosyo/zip/jigyosyo.zip
unzip ken_all.zip
unzip jigyosyo.zip
```

### データベースの作成

ダウンロードしたCSVファイルからNeDBのデータベースを作成します。
作成完了までしばらく時間がかかります。  
公開されている郵便番号データには不要と思われるデータも含むため、それらを除外したデータベースを作成します。  
除外したデータは`database/except.db`に配置されます。
事業所データは全てデータベースに追加されます。

```
node make.js; node office.js
```

郵便番号データは毎月更新されるので、その都度データベースの更新が必要です。

## ライセンス

MITライセンス