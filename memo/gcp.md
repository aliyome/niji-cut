# GCP メモ

## node.js でインスタンス作成・削除

## Container Registory

準備

```sh
gcloud auth configure-docker
```

```sh
# ローカルでタグ付け
docker tag [SOURCE_IMAGE] [HOSTNAME]/[PROJECT-ID]/[IMAGE]
```

docker tag aliyome/niji-cut asia.gcr.io/niji-cut/node

docker push asia.gcr.io/niji-cut/node:latest
