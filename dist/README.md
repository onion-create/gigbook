<p align="center">
  <img src="icon-192x192.png" alt="跑单记" width="96" />
</p>

<h1 align="center">跑单记 · Gigbook</h1>

<p align="center">
  <strong>每一单都算数。每一条路都清楚。</strong><br />
  <em>Multi-platform income tracking · Smart dashboard · AI worker advice · Offline PWA</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/PWA-ready-brightgreen.svg" alt="PWA" />
  <img src="https://img.shields.io/badge/AI-DeepSeek-08c.svg" alt="DeepSeek" />
  <img src="https://img.shields.io/badge/works%20offline-yes-success.svg" alt="Offline" />
  <img src="https://img.shields.io/badge/zero%20dependencies-yes-brightgreen.svg" alt="Zero Deps" />
</p>

> **中文摘要** — 跑单记是一款专为**外卖骑手、快递员、网约车司机、配送员**等灵活就业者设计的**日结记账工具**。支持**美团、饿了么、闪送、顺丰同城、货拉拉、滴滴**等多平台收入追踪，内置 **AI 收入分析**和**深色模式**，离线可用（PWA），数据本地存储（localStorage + IndexedDB 双写），零框架依赖。已在 GitHub Pages 部署，可安装到手机主屏幕使用。

---

## Why This Exists

China has over **84 million gig workers** — delivery riders, couriers, ride-hail drivers. They log every ride, every delivery, every expense in their head or on scraps of paper. The accounting apps that exist — 随手记, 鲨鱼记账, 挖财 — were all built for *consumer spending*. "Where did my money go?" is not a gig worker's question.

Their question is: **"How much did I make today? Across which platforms? After costs, am I on track for this month's goal?"**

No app answered that. So I built one.

跑单记 is a daily-settlement tracker purpose-built for multi-platform gig workers. Not a skin on a consumer app. Not a demo. A real tool — with a time-windowed dashboard, platform cost tracking, AI-powered worker advice, and a design system that treats the user like a professional, not a consumer.

**Built solo, end-to-end, without a design team or engineering team.** Every pixel placed through AI-assisted development (WorkBuddy + Claude Code). Deployed on GitHub Pages + Tencent Cloud SCF. From idea to production — one person, zero frameworks, 100% original.

---

## Product Preview

### Home · Smart Dashboard
<p align="center">
  <img src="screenshots/01-dashboard.png" width="45%" alt="Home Dashboard" />
  &nbsp;
  <img src="screenshots/02-dashboard-target.png" width="45%" alt="Monthly Goal Tracker" />
</p>

### Record · Platform & Category
<p align="center">
  <img src="screenshots/03-record-income.png" width="30%" alt="Record Income" />
  &nbsp;
  <img src="screenshots/04-record-expense.png" width="30%" alt="Record Expense" />
  &nbsp;
  <img src="screenshots/05-history.png" width="30%" alt="Transaction History" />
</p>

### Analytics & Settings
<p align="center">
  <img src="screenshots/06-stats.png" width="45%" alt="Analytics Dashboard" />
  &nbsp;
  <img src="screenshots/07-profile.png" width="45%" alt="Settings & Profile" />
</p>

---

## Features

| Category | What You Get |
|----------|--------------|
| 📊 **智能仪表盘** | 三张时间窗口卡片：今日净收入 / 本周汇总 / 本月目标。每个数字自带时间标注，不再混淆统计口径。收入、支出、工时一目了然。 |
| 💰 **多平台收入追踪** | 美团、饿了么、闪送、顺丰同城、货拉拉、滴滴、跑腿 — 内置 8 个收入平台，支持无限自定义分类。每个平台独立图标和颜色标识，自动生成平台分布图。 |
| 🤖 **AI 工友建议** | DeepSeek 驱动的上下文建议。不是聊天机器人——是懂你跑单规律的工友。数据满 5 天后给出个性化运营建议，不输出数字避免幻觉。数据不足时自动切换鼓励模式。 |
| 📈 **四维数据统计** | 收入趋势折线图、平台分布环形图、收支对比柱状图、工时×时薪混合图。Chart.js 渲染，渐变色柱体、彩色 tooltip、自适应深色模式。 |
| 🌓 **深色模式** | 完整深色模式覆盖 100+ CSS 变量。卡片、标题、按钮、输入框、图表——全元素适配。JavaScript 强制 header 渐变，彻底解决缓存导致的渲染异常。 |
| ⏱ **出工打卡** | 上班/下班打卡，自动计算工时。HH:MM 字符串解析，无 Date 对象转换 bug。连续出勤天数追踪。 |
| 🎯 **月目标追踪** | 月收入目标和成本控制，实时进度条 + 动态日均计算：「剩余 24 天 · 需 ¥189/天 才能达标」。周目标自动拆解（月目标 ÷ 4.3）。 |
| 📱 **PWA 离线可用** | 可安装到手机主屏幕，无网络也能使用。Service Worker + localStorage + IndexedDB 三层持久化。无需注册账号、无需服务器。 |
| 📤 **数据导入导出** | CSV 导出（兼容 Excel），CSV 恢复备份。你的数据你做主。 |
| 🎨 **设计系统** | 暖白色调（Linear/Arc 风格），5 层阴影深度系统，毛玻璃 header，渐变色进度条。所有交互元素使用 cubic-bezier 过渡动画。零硬编码颜色——100% CSS 变量驱动。 |
| 🔧 **Engineering** | Pure vanilla JS, zero framework dependencies. CSS variable design system. Modular source → single `bundle.js` build. Responsive to 720px max-width for tablet-friendly layout. |

---

## The AI-Assisted Development Story

*This project is a case study in AI-native product development for a non-engineer creator.*

跑单记 was conceived, designed, and built by **袁铭 (Yuan Ming)** — with no formal software engineering background. The development stack: **WorkBuddy + Claude Code** as AI engineering partners, **DeepSeek API** for the AI worker advice engine, and **GitHub Pages + Tencent Cloud SCF** for zero-infrastructure deployment.

The methodology: design-first iteration. Every UI decision was debated with the AI — card layout, color palette, time-window grouping, information hierarchy. Bugs were traced through console logs, CSS specificity wars, and HTML div mismatches. The result: a production-grade PWA with platform analytics, AI worker insights, dark mode, and a warm, professional design — built by a solo creator.

**If you're evaluating this project:** it demonstrates product thinking, design taste, user empathy, and the persistence to ship a complete product end-to-end — the exact skill set that AI-augmented teams need in 2026.

---

## Project Structure

```
gigbook/
├── index.html              # Production build — 500 lines, CSS variable-driven
├── dist/
│   └── bundle.js           # Bundled application logic (2,500 lines)
├── styles.css              # Complete design system (1,600 lines)
├── sw.js                   # Service Worker (offline cache)
├── manifest.json           # PWA manifest
├── chart.umd.min.js        # Chart.js CDN (visualization library)
├── config.example.js       # API config template — copy to config.js
├── icon-192x192.png        # App icon (small)
├── icon-512x512.png        # App icon (large)
├── screenshots/            # Product screenshots
├── .gitignore              # Excludes config.js (API keys), build tools
├── LICENSE                 # MIT License
└── README.md               # This file
```

---

## Quick Start

```bash
# Clone and open — no build step needed
git clone https://github.com/yourusername/gigbook.git
cd gigbook
python3 -m http.server 8080  # → http://localhost:8080

# Or serve via any static file server
npx serve -l 8080

# file:// protocol also works (caching quirks apply)
open index.html
```

### API Configuration (Optional)

For AI worker advice (DeepSeek), set up an API proxy:

```bash
cp config.example.js config.js
# Edit config.js — add your SCF proxy URL or DeepSeek API key
```

Without config.js, the app still runs fully — AI advice falls back to offline encouragement mode.

Add to your phone's home screen for a native app experience — works offline.

---

## Architecture

```
┌─ User Data Layer ─────────────────────────────────────────┐
│  Records → localStorage + IndexedDB (dual-write)          │
│  Work Shifts → Time calculation → Dashboard stats         │
└──────────────────────┬────────────────────────────────────┘
                       │
┌─ Stats Engine ───────┼────────────────────────────────────┐
│  Platform aggregation · Daily totals · Moving averages    │
│  Hourly rates · Streak tracking · Goal progress           │
│  → KPI cards · Chart.js visualization · AI prompt context │
└──────────────────────┬────────────────────────────────────┘
                       │
┌─ External (SCF Proxy) ┴───────────────────────────────────┐
│  /api/ai/chat → DeepSeek (contextual worker advice)       │
│  API keys in SCF env vars — invisible to frontend         │
└───────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI Framework | Vanilla JS — zero dependencies |
| Design System | CSS custom properties (100+ variables) |
| Charts | Chart.js (UMD bundle) |
| Storage | localStorage + IndexedDB dual-write |
| Offline | Service Worker (network-first strategy) |
| AI | DeepSeek Chat API via Tencent Cloud SCF proxy |
| Deployment | GitHub Pages (static) + Tencent SCF (API proxy) |
| Responsive | 720px max-width · iPhone safe-area · PWA manifest |

---

## Attribution

- **Chart.js** — Used under MIT license for statistical visualization.
- **DeepSeek API** — Powers the AI worker advice engine.
- **All application logic, visual design, and product thinking** — original work by 袁铭 (Yuan Ming).

---

## License

**MIT License.** See [LICENSE](LICENSE) for full terms.

- ✅ Use, modify, and distribute freely
- ✅ Use commercially
- ✅ Use privately
- ℹ️ Attribution appreciated but not required

---

<p align="center">
  <sub>Designed, engineered, and shipped by <strong>袁铭 (Yuan Ming)</strong><br/>
  AI-Assisted Development · WorkBuddy + Claude Code<br/>
  © 2026 All rights reserved</sub>
</p>
