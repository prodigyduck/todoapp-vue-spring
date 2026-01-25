#!/bin/bash

echo "🔑 GitHub Personal Access Token을 입력해주세요:"
echo "(GitHub Settings > Developer settings > Personal access tokens에서 생성)"
read -s GIT_TOKEN

echo ""
echo "🚀 원격 저장소 URL 설정..."
git remote set-url origin https://prodigyduck:$GIT_TOKEN@github.com/prodigyduck/todoapp-vue-spring.git

echo "📤 코드 푸시 중..."
git push origin main

echo "✅ GitHub에 성공적으로 푸시되었습니다!"
echo "🔗 https://github.com/prodigyduck/todoapp-vue-spring"