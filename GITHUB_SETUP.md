# GitHub 연동을 위한 안내

## 1단계: GitHub에서 저장소 생성
1. https://github.com/new 로 이동
2. Repository name: `todoapp-vue-spring`
3. Description: `Modern Todo App with Vue.js 3 + Spring Boot 3 + TypeScript`
4. Public/Private 선택 (Public 추천)
5. "Add a README file", "Add .gitignore" 체크 해제
6. "Create repository" 클릭

## 2단계: 로컬 저장소 연동
GitHub에서 저장소 생성 후 나오는 안내에서 다음 명령어를 찾아 실행하세요:

```bash
git remote add origin https://github.com/YOUR_USERNAME/todoapp-vue-spring.git
git branch -M main
git push -u origin main
```

## 3단계: Personal Access Token (필요시)
2FA를 사용하거나 비밀번호 인증이 안될 경우:
1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" 클릭
3. 필요한 권한 선택 (repo 권한 필요)
4. 생성된 토큰 복사해서 비밀번호 대신 사용

## Alternative: GitHub CLI 설치 (권장)
```bash
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh

# 설치 후 인증
gh auth login
```

## 현재 상태
- 로컬 Git 저장소: ✅ 초기화됨
- 모든 파일 커밋됨: ✅ 
- 원격 저장소 연동: ⏳ 필요