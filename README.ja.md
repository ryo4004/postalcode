![postalcode](https://user-images.githubusercontent.com/25874594/70855125-b7149400-1f08-11ea-9f08-c565c10c7db8.png)

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
:---|:---|:---
| query | string | 郵便番号 |

郵便番号はハイフンはあってもなくてもOKです。

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

```
cd asset
rm -R database
```

### CSVファイルのダウンロード

郵便番号データは日本郵便のWebサイト内の[郵便番号データダウンロード](https://www.post.japanpost.jp/zipcode/download.html)より取得できます。

このプロジェクトでは "読み仮名データの促音・拗音を小書きで表記するもの" 内の "全国一括" ファイルを使用しています。

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

## ライセンス

MITライセンス