# Backend（Spring Boot）

## 目的

- このディレクトリ配下に Spring Boot アプリを作成します
- GitHub Actions で Docker イメージをビルドして ECR に push し、App Runner に反映します

## 前提（infra）

- `app-infra` 側で `${APP_NAME}-ecr`（ECRリポジトリ）がデプロイ済みであること
- `${APP_NAME}-be`（App Runner）は初回は後から作ってもOKですが、最終的には必要です

> 初回は「stub を ECR に push → infra で BE 作成（CREATE_BE_SERVICE=true）」が一番詰まりにくいです。

## 初期作成の方針

- `backend/Dockerfile.gradle` は `backend/` 直下に Gradle プロジェクトがある想定です
  - 例: `gradlew`, `gradle/`, `build.gradle` または `build.gradle.kts`, `settings.gradle*`, `src/`
- Spring Initializr で生成したプロジェクトを `backend/` 直下に配置してください（サブディレクトリに入れるとDockerfileのCOPYが合いません）

## ポート

- 8080 で待ち受ける前提です（Dockerfile/App Runnerともに 8080 を前提）
- 5005 でデバッガーを待ち受ける。

## Dockerfile について

- `Dockerfile.stub`:
  - 実習の最初に、BE未実装でもデプロイの流れだけ確認したいとき用
- `Dockerfile.gradle`:
  - Spring Boot の Gradle ビルド（`bootJar`）を実行して jar を起動します
- `docker-compose.db.yml`:
  - postgresqlのコンテナ
- `compose.app.yml`:
  - Spring BootのコンテナとDBコンテナを紐づけ
- `.env`:
  - DB接続PWなどの機微情報を記載(リポジトリには入っていない)

## よくある注意

- `Dockerfile.gradle` は `./gradlew dependencies` をキャッシュ目的で先に叩くため、`gradlew` と `gradle/` が必要です
- テストをスキップしています（`-x test`）。実習でテストを回したい場合は Dockerfile を調整してください

## デプロイ（GitHub Actions）

- GitHub Actions の `Build & Push backend image, then deploy to App Runner` を手動実行します
- App Runner が存在する場合は `start-deployment` が実行されます。存在しない場合はスキップされます

## IDEの設定

- IntelliJの「自動ビルド」をONにする
  - 開く: 設定（Ctrl+Alt+S）
    - Build, Execution, Deployment > Compiler
    - 「自動的にプロジェクトをビルド（Build project automatically）」にチェック
- IntelliJ のビルドをIDE側に委譲
  - 設定（Ctrl+Alt+S）
    - 「ビルドと実行」「テストの実行」を “IntelliJ IDEA” にする(既定:Gradle)

## ローカル実行

- 起動（前回すでに up 済みなら -d でデタッチに切り替え可）
  - docker compose -f docker-compose.db.yml -f compose.dev.yml up
  - またはバックグラウンド: docker compose -f docker-compose.db.yml -f compose.dev.yml up -d
- 稼働状況
  - docker compose -f docker-compose.db.yml -f compose.dev.yml ps
- 停止
  - docker compose -f docker-compose.db.yml -f compose.dev.yml down
- IntelliJ IDEA からデバッグ接続
  - 実行 > 構成の編集… > ＋ > リモート JVM デバッグ
    - ホスト: localhost
    - ポート: 5005