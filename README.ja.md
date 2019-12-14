![postalcode](https://user-images.githubusercontent.com/25874594/70844367-89d1d280-1e83-11ea-9e87-468357ca3ebf.png)

PostalCodeは、Express(Node.js)上で動作する郵便番号を検索するAPIです。  
日本郵便が公開している郵便番号データを元に、データベースを作成します。  
郵便番号をHTTPリクエストでPOSTすると住所を返します。  
お問い合わせフォームやECサイトなどに郵便番号検索機能をつけることができます。

## デモ

<a href='https://postalcode.netlify.com/'>こちら</a>で動作チェックができます。

## インストールと実行

Node.jsがインストールされた環境を用意します。
リポジトリをクローンします。

```
git clone https://github.com/ryo4004/postalcode.git && cd postalcode
```

必要なパッケージをインストールします。

```
npm install
```

実行します。

```
node app.js
```

Expressサーバが起動し、リクエストを待機します。
永続的に実行する場合はpm2などをご利用ください。

## 使い方

### リクエストパラメータ

POSTで送信します。

| パラメータ | 値 | 説明 |
:---|:---|:---
| query | string | 郵便番号(ハイフンはあってもなくてもよい) |

### レスポンスフィールド

| パラメータ | 値 |
:---|:---
| post | |
| ├&nbsp;postalCode | 郵便番号 |
| ├&nbsp;address | 住所全文 |
| └&nbsp;detail | 詳細情報 |
| &nbsp;&nbsp;├&nbsp;prefecture | 都道府県名 |
| &nbsp;&nbsp;├&nbsp;city | 市区町村名 |
| &nbsp;&nbsp;└&nbsp;town | 町域名 |

## 郵便番号データベースの更新

郵便番号データベースを作成します。
作業は`asset`ディレクトリで行います。

```
cd asset
```

### CSVファイルのダウンロード

郵便番号の一覧は日本郵便のWebサイト内の<a href='https://www.post.japanpost.jp/zipcode/download.html'>郵便番号データダウンロード</a>より取得できます。

このプロジェクトでは "読み仮名データの促音・拗音を小書きで表記するもの" 内の "全国一括" ファイルを使います。

以下のコマンドでダウンロードおよび解凍を行います。

```
wget https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip
unzip ken_all.zip
```

### データベースの作成

ダウンロードしたCSVファイルからNeDBのデータベースを作成します。
作成完了までしばらく時間がかかります。

```
node make.js
```

郵便番号データは毎月更新されますので、その都度データベースの更新が必要です。