※ 日本語説明はページ下部にございます。

# Ask Professionals: A chat app framework

## About

## Get started

## Tech Stacks

## Firestore data structure
```
users collection
  ├ createTimestamp: timestamp
  ├ emoji: string
  ├ mentionedProblems: string
  ├ name: string
  ├ tags
    ├ name: string
    └ tagId: string
  └ updateTimestamp: timestamp

advisors collection
  ├ cardProfile: string
  ├ createTimestamp: timestamp
  ├ detail: string
  ├ imageUrl: string
  ├ isConfirmed: boolean
  ├ isRegistrationDone: boolean
  ├ name: string
  ├ tags: array of map
    ├ name: string
    └ tagId: string
  ├ twitterUrl: string
  └ updateTimestamp: timestamp
  
tags collection
  ├ category: string
  └ name: string
  
conversations collection
  ├ advisorId: string
  ├ advisorImageUrl: string
  ├ advisorName: string
  ├ createTimestamp: timestamp
  ├ isUnreadByAdvisor: boolean
  ├ isUnreadByUser: boolean
  ├ lastMessage: string
  ├ updateTimestamp: timestamp
  ├ userEmoji: string
  ├ userId: string
  ├ userMentionedProblems: string
  ├ userName: string
  ├ userTags: array of map
    ├ name: string
    └ tagId: string
  └ messages collection 👈 This is collection inside a collection
    ├ content: string
    ├ createTimestamp: timestamp
    ├ isUser: true
    ├ sendTimestamp: timestamp
    └ updateTimestamp: timestamp
```

## Before publication

---

# Ask Professionals: 専門家に相談できるチャットアプリテンプレート

## 概要
このレポジトリは、審査の通った専門家に対して質問ができるアプリケーションの React Native による実装例になります。  
レポジトリ内には2つのアプリがあり、それぞれ user_app が質問したい人向けのアプリで、advisor_app が質問に乗る専門家向けのアプリになっています。  

どのようなアプリになるのか動画にまとめましたので、詳しくはこちらをご覧ください。  
https://www.youtube.com/watch?v=6bmwj0eo70c

## スタートアップガイド
1. レポジトリをクローンする
2. Firebase プロジェクトを1つ立ち上げる
3. Firebase 各機能のセットアップを行う
    - Authentication
      1. 画面 Sign-in Method より、"Email/Password" と "Anonymous" を有効化する
    - Firestore
      1. こちらを参考に、セキュリティルール Test mode で立ち上げる https://firebase.google.com/docs/firestore/quickstart#test-mode
      2. セキュリティルールで、read, write に加え update 処理を許可する (参考: https://firebase.google.com/docs/firestore/security/rules-conditions )
    - Storage
      1. デフォルトの Storage バケットを作成する https://firebase.google.com/docs/storage/ios/start#create-default-bucket
      2. セキュリティルールで、read と write を許可する https://firebase.google.com/docs/storage/security/start#sample-rules
4. こちらのページを参考に、react-native-firebase のセットアップを行う (Android, iOS それぞれの user, advisor アプリに対して行うので、計4つの application が Firebase に作成されることになります) https://rnfirebase.io/
5. 下記4つのカテゴリーに属するタグを、それぞれ最低1つ Firestore の tags collection に追加する (下記 Firestore データ設計を参考になさって下さい)
    - home
    - school
    - future
    - other
6. ユーザーとアドバイザーを実機/エミュレーターから作成する (参考: https://www.youtube.com/watch?v=6bmwj0eo70c )
7. チャットを開始する🙌

## 技術スタックについて

### バックエンド
認証、データベース、ストレージと、バックエンドの実装に当たるものは全て Firebase の機能で実装されています。  
とりわけデータベースとして使っている Firestore は、一般的によく使われる RDBMS とは異なる NoSQL なので、実際に使用を始める際は、まず公式のドキュメントを読んで理解されることをおすすめします。  
https://firebase.google.com/  
https://firebase.google.com/docs/firestore

### デザイン
マテリアルデザインに準拠した実装にするため、全面的に react-native-paper を用いています。  
https://callstack.github.io/react-native-paper/index.html

### グローバル State の運用
このアプリケーションでは Redux のようなツールは用いていません。  
アプリケーション全体でグローバルに使うことの出来る変数及び関数は、React の Hooks API により宣言され、Context API によってアプリケーション中どこからでも呼び出せるように実装されています。  

実際に中身を理解するため、例えば下記3つのファイルの実装をまずは見て頂くことをおすすめします。  

- /user_app/App.tsx
- /user_app/globalHooks/useUser.ts
- /user_app/globalContexts/UserContext.ts

## Firestore データ設計
```
users コレクション
  ├ createTimestamp: timestamp
  ├ emoji: string
  ├ mentionedProblems: string
  ├ name: string
  ├ tags
    ├ name: string
    └ tagId: string
  └ updateTimestamp: timestamp

advisors コレクション
  ├ cardProfile: string
  ├ createTimestamp: timestamp
  ├ detail: string
  ├ imageUrl: string
  ├ isConfirmed: boolean
  ├ isRegistrationDone: boolean
  ├ name: string
  ├ tags: array of map
    ├ name: string
    └ tagId: string
  ├ twitterUrl: string
  └ updateTimestamp: timestamp
  
tags コレクション
  ├ category: string
  └ name: string
  
conversations コレクション
  ├ advisorId: string
  ├ advisorImageUrl: string
  ├ advisorName: string
  ├ createTimestamp: timestamp
  ├ isUnreadByAdvisor: boolean
  ├ isUnreadByUser: boolean
  ├ lastMessage: string
  ├ updateTimestamp: timestamp
  ├ userEmoji: string
  ├ userId: string
  ├ userMentionedProblems: string
  ├ userName: string
  ├ userTags: array of map
    ├ name: string
    └ tagId: string
  └ messages コレクション 👈 こちらはコレクションの中にあるコレクションです
    ├ content: string
    ├ createTimestamp: timestamp
    ├ isUser: true
    ├ sendTimestamp: timestamp
    └ updateTimestamp: timestamp
```

## アプリをリリースする前に
リリース前、必ず Firestore と Storage のセキュリティルール設定を行って下さい。

このレポジトリは実際にリリースするアプリの実装部分を抜き出したものなので、申し訳ないのですが例としてどのような設定がされているのかは載せることができません。  
なのでこちら等を参考に、各自設定を行って下さい。  
https://firebase.google.com/docs/firestore/security/get-started
