## Frontend structure
```sh
/src
|
+-- index.tsx         # ページ ルート
|
+-- components        # 共通コンポーネント
|
+-- features          # モジュールベースの機能（機能ごとにディレクトリ分割）
|
+-- styles            # UI関連
|
+-- types             # 共通タイプ
|
+-- utils             # 汎用的なユーティリティ関数
```


## Backend structure
```sh
/test                #テスト関連
|
/src
|
+-- main.ts          # feature root
|
+-- feature1(chat)   # 機能1
|
+-- feature2(game)   # 機能2
|
+-- feature3(auth)   # 機能3
```
