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

## Dockerfile について

- `Dockerfile.stub`:
  - 実習の最初に、BE未実装でもデプロイの流れだけ確認したいとき用
- `Dockerfile.gradle`:
  - Spring Boot の Gradle ビルド（`bootJar`）を実行して jar を起動します

## よくある注意

- `Dockerfile.gradle` は `./gradlew dependencies` をキャッシュ目的で先に叩くため、`gradlew` と `gradle/` が必要です
- テストをスキップしています（`-x test`）。実習でテストを回したい場合は Dockerfile を調整してください

## デプロイ（GitHub Actions）

- GitHub Actions の `Build & Push backend image, then deploy to App Runner` を手動実行します
- App Runner が存在する場合は `start-deployment` が実行されます。存在しない場合はスキップされます
