# GIT GUIDELINE
## Issue
自分が担当する機能もしくはページに対するIssueを立てる。抽象的すぎるissue名は厳禁。  
× フロント、バック、クラスなど  
◎ issue「map class」(map classを実装する場合)

## Branch Name 
機能別,担当別にbranchを切り分ける。branch名は「**issue名/"issue"issue番号**」  
× shogura  
◎ map/issue1

## Commit Message
- 先頭に#issue番号を必ず付加（./git/hook/commit-msgで対応）
- 100文字以内で簡潔なメッセージ
- どんな変更を加えたのかのタイトルを付加([add],[fix],[rm],[update],[move],[rename],[improve])
- なぜ、なに、どのようになど変更点がわかるようなメッセージ
例）#X(what is the issue number) [add (what did you do change)] :[body (why did you change)]

## Pull Request
#### 十分小さくプルリクエストを作ろう
	プルリクが小さいと、レビューが簡単になり、変更がすばやく中央のブランチに取り込まれるため、レビューの精度が高くなり開発スピードも早くなる。

	タスクやIssueが一つで表現されていても、やりたいことを予めいくつかに分けて、それに対して一つプルリクを出しましょう
#### 全員もしくは過半数のレビューを行う
#### プルリクエストに必要な情報を入れよう
	このプルリクエストが何を実現したいためのプルリクエストなのか、レビュワーは何をレビューすればよいのか、このあたりがわかるように情報を書き込む。
	例) 目的, 達成条件, 実装の概要
