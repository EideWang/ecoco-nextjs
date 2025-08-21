# Ecoco 認證系統設定指南

## 功能概述

本專案使用 Auth.js (NextAuth.js) 實作完整的會員認證系統，支援以下功能：

### 註冊方式

1. **手機號碼註冊** - 傳統帳號密碼方式
2. **Google OAuth** - 快速註冊
3. **Line OAuth** - 快速註冊

### 登入方式

1. **手機號碼 + 密碼** - 傳統登入
2. **Google OAuth** - 快速登入
3. **Line OAuth** - 快速登入

### 特殊功能

- **手機號碼驗證狀態** - OAuth 用戶需要額外驗證手機號碼才能使用 IoT 設備
- **個人資料管理** - 完整的用戶資料編輯功能
- **密碼重置** - 透過簡訊驗證碼重置密碼

## 環境變數設定

創建 `.env.local` 檔案並設定以下變數：

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecoco_db"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Line OAuth
LINE_CLIENT_ID="your-line-client-id"
LINE_CLIENT_SECRET="your-line-client-secret"
```

## OAuth 設定

### Google OAuth

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用 Google+ API
4. 在「憑證」頁面創建 OAuth 2.0 客戶端 ID
5. 設定授權的重新導向 URI：`http://localhost:3000/api/auth/callback/google`

### Line OAuth

1. 前往 [Line Developers Console](https://developers.line.biz/)
2. 創建新 Channel 或選擇現有 Channel
3. 在 Channel 設定中獲取 Channel ID 和 Channel Secret
4. 設定 Callback URL：`http://localhost:3000/api/auth/callback/line`

## 資料庫設定

### 1. 啟動 PostgreSQL

```bash
# 使用 Docker
docker run --name postgres-ecoco -e POSTGRES_PASSWORD=password -e POSTGRES_DB=ecoco_db -p 5432:5432 -d postgres:15
```

### 2. 執行資料庫遷移

```bash
npx prisma migrate dev
```

### 3. 生成 Prisma Client

```bash
npx prisma generate
```

## 安裝依賴

```bash
npm install next-auth @auth/prisma-adapter @prisma/client bcryptjs
npm install -D @types/bcryptjs
```

## 功能說明

### 手機號碼驗證邏輯

- **手機號碼註冊用戶**：註冊時自動標記為已驗證
- **OAuth 註冊用戶**：手機號碼狀態為未驗證，需要在個人資料頁面手動綁定

### 登入流程

1. 用戶選擇註冊/登入方式
2. 系統驗證憑證
3. 創建或更新用戶資料
4. 設定預設頭像（新用戶）
5. 跳轉到個人資料頁面

### 個人資料管理

- 編輯基本資料（姓名、地址、性別、生日）
- 綁定/更新手機號碼
- 查看環保積分和幣值
- 查看手機號碼驗證狀態

## API 路由

### 認證相關

- `POST /api/auth/signin` - 登入
- `POST /api/auth/signout` - 登出
- `GET /api/auth/session` - 獲取當前會話

### 頁面路由

- `/login` - 登入頁面
- `/register` - 註冊頁面
- `/profile` - 個人資料頁面
- `/forgot-password` - 忘記密碼頁面
- `/reset-password` - 重置密碼頁面

## 安全考量

1. **密碼雜湊**：使用 bcryptjs 進行密碼雜湊
2. **JWT 策略**：使用 JWT 進行會話管理
3. **環境變數**：敏感資訊存放在環境變數中
4. **輸入驗證**：前端和後端都有輸入驗證
5. **手機號碼驗證**：OAuth 用戶需要額外驗證手機號碼

## 開發注意事項

1. **簡訊服務整合**：忘記密碼功能需要整合簡訊服務商 API
2. **錯誤處理**：所有 API 都有適當的錯誤處理
3. **類型安全**：使用 TypeScript 確保類型安全
4. **響應式設計**：所有頁面都支援響應式設計

## 測試

1. 測試手機號碼註冊流程
2. 測試 OAuth 註冊流程
3. 測試登入功能
4. 測試個人資料編輯
5. 測試手機號碼綁定
6. 測試登出功能

## 部署

1. 設定生產環境的環境變數
2. 更新 OAuth 重新導向 URI
3. 設定資料庫連接
4. 執行資料庫遷移
5. 部署應用程式

## 故障排除

### 常見問題

1. **OAuth 錯誤**：檢查 Client ID 和 Secret 是否正確
2. **資料庫連接錯誤**：檢查 DATABASE_URL 設定
3. **密碼雜湊錯誤**：確保 bcryptjs 版本相容
4. **會話問題**：檢查 NEXTAUTH_SECRET 設定

### 除錯模式

在開發環境中啟用除錯模式：

```env
NODE_ENV=development
```

這會在 auth.ts 中自動啟用 debug 模式。
