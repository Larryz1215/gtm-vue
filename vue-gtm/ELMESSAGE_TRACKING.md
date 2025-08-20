# ElMessage 監聽功能使用說明

## 🎯 功能概述

現在您的 Vue 應用程式具備了三種監聽 ElMessage 的方式：

1. **方案一：回調函數監聽** - 使用 ElMessage 的 `onClose` 回調
2. **方案二：DOM 監聽器** - 使用 MutationObserver 監聽所有 ElMessage
3. **方案三：包裝函數** - 統一管理 ElMessage 和 GTM 追蹤

## 📋 GTM 事件追蹤

### 使用包裝函數 (推薦)
```javascript
showTrackedMessage({
  message: 'Form submitted successfully!',
  type: 'success',
  context: 'form_submission'
})
```

### 自動追蹤的 GTM 事件：
- `tracked_message_show` - 訊息顯示時
- `tracked_message_close` - 訊息關閉時
- `ui_message_displayed` - DOM 監聽器偵測到訊息出現
- `ui_message_dismissed` - DOM 監聽器偵測到訊息消失

## 🧪 測試方法

1. 訪問 `http://localhost:5174/test1`
2. 填寫表單並點擊 Submit
3. 點擊 TestBtn 按鈕
4. 打開瀏覽器開發者工具查看：
   - **Console** - 看到監聽事件的 log
   - **Network** - 查看 GTM 請求
   - **Application > Local Storage** - 檢查 dataLayer

## 📊 監聽到的資料結構

```javascript
// 訊息顯示事件
{
  event: 'tracked_message_show',
  message: {
    content: '訊息內容',
    type: 'success|warning|info|error',
    context: '觸發來源',
    timestamp: '2025-08-20T...'
  }
}

// 訊息關閉事件
{
  event: 'tracked_message_close',
  message: {
    content: '訊息內容',
    type: 'success|warning|info|error', 
    context: '觸發來源',
    timestamp: '2025-08-20T...'
  }
}
```

## 🎨 自訂監聽

您可以在任何地方使用 `showTrackedMessage` 函數：

```javascript
// 成功訊息
showTrackedMessage({
  message: '操作成功！',
  type: 'success',
  context: 'user_action'
})

// 警告訊息
showTrackedMessage({
  message: '請注意！',
  type: 'warning',
  duration: 5000,
  context: 'validation_warning'
})

// 錯誤訊息
showTrackedMessage({
  message: '發生錯誤！',
  type: 'error',
  context: 'api_error'
})
```

所有訊息都會自動追蹤到 GTM，無需額外設定！
