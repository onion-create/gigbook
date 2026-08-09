// 跑单记 API 配置模板 — v3.4.0
// 复制此文件为 config.js，填入你的配置
// config.js 已被 .gitignore 忽略，不会提交到 Git

window.GIGBOOK_CONFIG = {
  // === API 代理（推荐） ===
  // 部署 api-proxy/ 到腾讯云 SCF，填入函数 URL
  apiProxyUrl: 'https://你的SCF函数ID.ap-guangzhou.tencentscf.com',

  // === 直连模式（不推荐，Key 会暴露在前端） ===
  // 如果不用代理，删掉 apiProxyUrl，填入以下字段：
  deepseekApiKey: 'YOUR_DEEPSEEK_API_KEY',
  deepseekApiUrl: 'https://api.deepseek.com/v1/chat/completions',
  qweatherKey: 'YOUR_QWEATHER_KEY',
  qweatherHost: 'YOUR_QWEATHER_HOST'
};
