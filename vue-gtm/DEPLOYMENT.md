# GitHub Pages 部署說明

## 自動部署設置

這個專案已經配置了 GitHub Actions 來自動部署到 GitHub Pages。

### 設置步驟

1. **推送代碼到 GitHub**
   ```bash
   git add .
   git commit -m "設置 GitHub Pages 部署"
   git push origin main
   ```

2. **啟用 GitHub Pages**
   - 前往 GitHub 倉庫的 Settings
   - 點擊左側的 "Pages"
   - 在 "Source" 下選擇 "GitHub Actions"
   - 保存設置

3. **部署**
   - 每次推送到 `main` 分支時，會自動觸發部署
   - 部署完成後，網站將在 `https://<你的用戶名>.github.io/gtm-vue/` 可訪問

### 手動部署 (可選)

如果需要手動部署，可以安裝 gh-pages：

```bash
npm install --save-dev gh-pages
npm run deploy
```

### 重要注意事項

- 確保 GitHub 倉庫名稱與 `vite.config.ts` 中的 base path 一致
- 如果倉庫名稱不是 `gtm-vue`，請修改 `vite.config.ts` 中的 base 設置
- 首頁路由需要重定向，因為 GitHub Pages 預設不支援 SPA 路由

### 故障排除

1. **404 錯誤**：檢查 base path 設置
2. **路由問題**：確保使用 `createWebHistory` 並正確設置 BASE_URL
3. **靜態資源加載失敗**：檢查 public 資料夾中的檔案路徑
