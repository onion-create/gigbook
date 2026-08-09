/**
 * Gigbook v3.3.1 — Bundled for file:// and http:// compatibility
 * Auto-generated: 2026-08-08T03:24:23.775Z
 */
(function() {
'use strict';

// === src/core/utils.js ===

const APP_VERSION = '3.4.0';

// --- Date/Time utilities ---
function pad(n) { return String(n).padStart(2, '0'); }
function today() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function formatDate(d) {
  const date = typeof d === 'string' ? parseLocalDate(d) : new Date(d);
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
}
function formatTime(d) { const date = d || new Date(); return `${pad(date.getHours())}:${pad(date.getMinutes())}`; }
function parseLocalDate(str) { const [y, m, d] = String(str).split('-').map(Number); return new Date(y, m - 1, d); }
function getWeekDay(d) {
  const days = ['日','一','二','三','四','五','六'];
  const date = typeof d === 'string' ? parseLocalDate(d) : d;
  return days[date.getDay()];
}
function getWeekDayShort(d) {
  const days = ['周日','周一','周二','周三','周四','周五','周六'];
  const date = typeof d === 'string' ? parseLocalDate(d) : d;
  return days[date.getDay()];
}
function getWeekMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
}

// --- Formatting ---
function formatCurrency(n) {
  const val = Number(n || 0);
  const abs = Math.abs(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return val < 0 ? '-¥' + abs : '¥' + abs;
}
function formatCurrencyShort(n) {
  const val = Number(n || 0);
  const abs = Math.abs(val).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return val < 0 ? '-¥' + abs : '¥' + abs;
}
function formatCompact(n) {
  if (Math.abs(n) >= 10000) return '¥' + (n / 10000).toFixed(1) + '万';
  return formatCurrencyShort(n);
}
function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}
function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// --- Validation ---
function validateAmount(str) {
  const val = parseFloat(str);
  if (Number.isNaN(val) || val <= 0) return { ok: false, msg: '请输入大于0的金额' };
  if (val > 10000000) return { ok: false, msg: '金额不能超过一千万' };
  const rounded = Math.round(val * 100) / 100;
  if (rounded <= 0) return { ok: false, msg: '金额过小' };
  return { ok: true, val: rounded };
}

// --- Categories ---
const defaultIncomeCategories = [
  { id: 'meituan', name: '美团', icon: '🛵' },
  { id: 'eleme', name: '饿了么', icon: '🔵' },
  { id: 'shansong', name: '闪送', icon: '⚡' },
  { id: 'sf_city', name: '顺丰同城', icon: '📦' },
  { id: 'huolala', name: '货拉拉', icon: '🚛' },
  { id: 'didi', name: '滴滴', icon: '🚗' },
  { id: 'paotui', name: '跑腿', icon: '🏃' },
  { id: 'other', name: '其他', icon: '💰' },
];

const defaultExpenseCategories = [
  { id: 'energy', name: '充电/加油', icon: '⛽' },
  { id: 'food', name: '餐饮', icon: '🍱' },
  { id: 'rental', name: '租车/电池', icon: '🏍️' },
  { id: 'repair', name: '维修保养', icon: '🔧' },
  { id: 'fine', name: '违章罚款', icon: '🚨' },
  { id: 'phone', name: '话费流量', icon: '📱' },
  { id: 'insurance', name: '保险保障', icon: '🛡️' },
  { id: 'gear', name: '装备耗材', icon: '🎒' },
  { id: 'other_exp', name: '其他', icon: '💸' },
];

function getCategories(settings, type) {
  const base = type === 'income' ? [...defaultIncomeCategories] : [...defaultExpenseCategories];
  const custom = (settings.customCategories || []).filter(c => c.type === type);
  return [...base, ...custom];
}

function getCategory(settings, type, id) {
  const found = getCategories(settings, type).find(c => c.id === id);
  if (found) return found;
  // 未知分类：保留原始 ID 提示用户
  return { name: '未分类', icon: '📌', rawId: id || '空' };
}

// --- Period ranges ---
function getPeriodRange(period) {
  const now = new Date();
  const t = today();
  let start;
  if (period === 'week') {
    start = getWeekMonday(now);
  } else if (period === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    start = new Date(now);
    start.setDate(now.getDate() - 29);
  }
  return { start: formatDate(start), end: t, label: period === 'week' ? '本周' : period === 'month' ? '本月' : '近30天' };
}

function getPrevPeriodRange(period) {
  const now = new Date();
  if (period === 'week') {
    const currMonday = getWeekMonday(now);
    const prevMonday = new Date(currMonday);
    prevMonday.setDate(currMonday.getDate() - 7);
    const prevSunday = new Date(prevMonday);
    prevSunday.setDate(prevMonday.getDate() + 6);
    return { start: formatDate(prevMonday), end: formatDate(prevSunday) };
  } else if (period === 'month') {
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayPrevMonth = new Date(firstDayThisMonth);
    lastDayPrevMonth.setDate(0);
    const firstDayPrevMonth = new Date(lastDayPrevMonth.getFullYear(), lastDayPrevMonth.getMonth(), 1);
    return { start: formatDate(firstDayPrevMonth), end: formatDate(lastDayPrevMonth) };
  } else {
    const end = new Date(now);
    end.setDate(now.getDate() - 30);
    const start = new Date(end);
    start.setDate(end.getDate() - 29);
    return { start: formatDate(start), end: formatDate(end) };
  }
}

// === src/core/storage.js ===

const STORAGE_KEY = 'rider_accounting_data_v2';
const SETTINGS_KEY = 'rider_accounting_settings_v2';

const defaultSettings = {
  version: 2,
  appVersion: APP_VERSION,
  monthlyGoal: 8000,
  monthlyCostGoal: 3000,
  darkMode: false,
  workShifts: [],
  vehicle: { type: 'electric', costPerKm: 0.15 },
  customCategories: []
};

// --- IndexedDB ---
const IDB = {
  _db: null,

  async open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('gigbook', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('records')) {
          const store = db.createObjectStore('records', { keyPath: 'id' });
          store.createIndex('date', 'date');
          store.createIndex('type', 'type');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
      req.onsuccess = (e) => { this._db = e.target.result; resolve(); };
      req.onerror = (e) => reject(e.target.error);
    });
  },

  async getAll() {
    return new Promise((resolve) => {
      const tx = this._db.transaction('records', 'readonly');
      const req = tx.objectStore('records').getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve([]);
    });
  },

  async putAll(records) {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction('records', 'readwrite');
      const store = tx.objectStore('records');
      const clearReq = store.clear();
      clearReq.onsuccess = () => {
        for (let i = 0; i < records.length; i++) store.put(records[i]);
      };
      clearReq.onerror = () => reject(clearReq.error);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async clearRecords() {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction('records', 'readwrite');
      const req = tx.objectStore('records').clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async put(record) {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction('records', 'readwrite');
      const req = tx.objectStore('records').put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async remove(id) {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction('records', 'readwrite');
      const req = tx.objectStore('records').delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
};

// --- localStorage ---
function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch(e) { return []; }
}

function saveDataLocal(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSettings() {
  try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY)) }; } catch(e) { return { ...defaultSettings }; }
}

function saveSettingsLocal(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// --- Dual-write ---
async function saveAllData(data, settingsObj) {
  try { await IDB.putAll(data); } catch(e) { saveDataLocal(data); }
  saveSettingsLocal(settingsObj);
}

// Override saveData to also sync to IndexedDB
const origSaveData = saveDataLocal;
function saveData(data) {
  origSaveData(data);
  if (IDB._db) {
    IDB.putAll(data).catch(err => {
      console.error('[IDB] sync failed:', err);
    });
  }
}

// --- Migration ---

function migrate() {
  let records = loadData();
  let settings = loadSettings();
  const oldData = localStorage.getItem('rider_accounting_data');
  const oldSettings = localStorage.getItem('rider_accounting_settings');

  if (!localStorage.getItem(STORAGE_KEY) && oldData) {
    try {
      records = JSON.parse(oldData).map(r => ({ ...r, orderCount: r.orderCount ?? null, km: r.km ?? null }));
    } catch(e) { /* silently skip malformed legacy data */ }
  }
  if (!localStorage.getItem(SETTINGS_KEY) && oldSettings) {
    try {
      const old = JSON.parse(oldSettings);
      settings = { ...defaultSettings };
      if ('monthlyGoal' in old) settings.monthlyGoal = old.monthlyGoal;
      if ('monthlyCostGoal' in old) settings.monthlyCostGoal = old.monthlyCostGoal;
      if ('darkMode' in old) settings.darkMode = old.darkMode;
      if (old.workStart) {
        settings.workShifts.push({ date: getToday(), start: old.workStart, end: old.workEnd || '', note: '', isOvernight: false });
      }
    } catch(e) { /* silently skip malformed legacy data */ }
  }
  settings.version = 2;
  settings.appVersion = APP_VERSION;
  if (!settings.vehicle) settings.vehicle = { ...defaultSettings.vehicle };
  if (!Array.isArray(settings.customCategories)) settings.customCategories = [];
  saveDataLocal(records);
  saveSettingsLocal(settings);
  return { records, settings };
}

// --- Init helpers ---
async function initIDB() {
  try {
    await IDB.open();
    const r = await IDB.getAll();
    return { idb: IDB, records: r.length > 0 ? r : null };
  } catch(e) {
    return { idb: IDB, records: null };
  }
}

async function syncToIDB(records) {
  if (!IDB._db) return;
  try {
    const existing = await IDB.getAll();
    if (existing.length === 0 && records.length > 0) {
      await IDB.putAll(records);
    }
  } catch(e) { /* IDB sync skipped */ }
}

{ IDB };

// === src/ai/engine.js ===

const incomeCatNames = {
  meituan: '美团', eleme: '饿了么', shansong: '闪送', sf_city: '顺丰同城',
  huolala: '货拉拉', didi: '滴滴', paotui: '跑腿', other: '其他'
};

const StatsEngine = {
  analyzeData(records, days) {
    days = days || 30;
    const t = today();
    const end = parseLocalDate(t);
    const start = new Date(end);
    start.setDate(start.getDate() - days + 1);
    const s = formatDate(start);
    const rangeRecords = records.filter(r => r.date >= s && r.date <= t);
    const incomeRecords = rangeRecords.filter(r => r.type === 'income');
    const expenseRecords = rangeRecords.filter(r => r.type === 'expense');

    const byPlatform = {}, byHour = {}, byWeekday = {}, dailyIncome = {};
    incomeRecords.forEach(r => {
      byPlatform[r.category] = (byPlatform[r.category] || { total: 0, count: 0, orders: 0 });
      byPlatform[r.category].total += r.amount;
      byPlatform[r.category].count++;
      byPlatform[r.category].orders += (r.orderCount || 1);
      const h = parseInt(r.time) || 12;
      byHour[h] = (byHour[h] || { total: 0, count: 0 });
      byHour[h].total += r.amount;
      byHour[h].count++;
      const wd = new Date(parseLocalDate(r.date)).getDay();
      byWeekday[wd] = (byWeekday[wd] || { total: 0, count: 0 });
      byWeekday[wd].total += r.amount;
      byWeekday[wd].count++;
      dailyIncome[r.date] = (dailyIncome[r.date] || 0) + r.amount;
    });

    const totalIncome = incomeRecords.reduce((s, r) => s + r.amount, 0);
    const totalExpense = expenseRecords.reduce((s, r) => s + r.amount, 0);
    const allOrders = incomeRecords.reduce((s, r) => s + (r.orderCount || 1), 0);
    const dailyValues = Object.values(dailyIncome);

    let mean = 0, stddev = 0;
    if (dailyValues.length > 0) {
      mean = dailyValues.reduce((s, v) => s + v, 0) / dailyValues.length;
      stddev = Math.sqrt(dailyValues.reduce((s, v) => s + (v - mean) ** 2, 0) / dailyValues.length);
    }

    const sortedPlatforms = Object.entries(byPlatform)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([k, v]) => ({
        id: k, name: incomeCatNames[k] || k,
        total: v.total, count: v.count, orders: v.orders,
        avgPerOrder: v.orders > 0 ? v.total / v.orders : 0
      }));

    const bestHours = Object.entries(byHour)
      .sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count))
      .slice(0, 5)
      .map(([h, d]) => ({ hour: parseInt(h), avgRate: Math.round(d.total / d.count * 100) / 100, count: d.count }));

    const bestWeekdays = Object.entries(byWeekday)
      .sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count))
      .map(([wd, d]) => ({
        weekday: parseInt(wd),
        label: ['周日','周一','周二','周三','周四','周五','周六'][parseInt(wd)],
        avgRate: Math.round(d.total / d.count * 100) / 100,
        count: d.count
      }));

    const workDays = Object.keys(dailyIncome).length;
    const avgDailyIncome = workDays > 0 ? Math.round(totalIncome / workDays) : 0;

    // Trend detection
    const entries = Object.entries(dailyIncome).sort((a, b) => a[0].localeCompare(b[0]));
    let trendPct = 0, trendDir = 'stable', trendConf = 'low';
    if (entries.length >= 7) {
      const half = Math.floor(entries.length / 2);
      const avg1 = entries.slice(0, half).reduce((s, [, v]) => s + v, 0) / half;
      const avg2 = entries.slice(half).reduce((s, [, v]) => s + v, 0) / half;
      if (avg1 > 0) {
        trendPct = Math.round((avg2 - avg1) / avg1 * 100);
        trendDir = trendPct > 5 ? 'up' : trendPct < -5 ? 'down' : 'stable';
      }
      trendConf = entries.length >= 14 ? 'high' : 'medium';
    }

    return {
      totalIncome, totalExpense, netIncome: totalIncome - totalExpense, allOrders,
      workDays, avgDailyIncome, mean: Math.round(mean), stddev: Math.round(stddev),
      platforms: sortedPlatforms, topPlatform: sortedPlatforms[0] || null,
      secondPlatform: sortedPlatforms[1] || null, bestHours, bestWeekdays,
      incomeTrend: { direction: trendDir, pct: trendPct, confidence: trendConf },
      dailyIncome
    };
  },

  detectAnomalies(todayIncome, todayExpense, stats) {
    const anomalies = [];
    if (todayIncome > stats.mean + 2 * stats.stddev && stats.stddev > 0)
      anomalies.push({ type: 'high_income', msg: '今天收入远超平均水平', severity: 'positive' });
    if (todayIncome > 0 && todayIncome < stats.mean * 0.4 && stats.mean > 0 && stats.workDays >= 7)
      anomalies.push({ type: 'low_income', msg: '今天收入明显偏低', severity: 'warning' });
    return anomalies;
  }
};

// === src/ai/weather.js ===

function getConfig() {
  return (typeof GIGBOOK_CONFIG !== 'undefined') ? GIGBOOK_CONFIG : {};
}

function getWeatherHost() { return getConfig().qweatherHost || ''; }
function getWeatherKey() { return getConfig().qweatherKey || ''; }

function buildWeatherUrl(endpoint, params) {
  const proxy = getConfig().apiProxyUrl;
  if (proxy) {
    const qs = Object.keys(params).map(k => k + '=' + encodeURIComponent(params[k])).join('&');
    return proxy + '/api/weather/' + endpoint + '?' + qs;
  }
  const host = getWeatherHost();
  if (endpoint === 'now') return 'https://' + host + '/v7/weather/now?location=' + params.lon + ',' + params.lat + '&key=' + getWeatherKey();
  if (endpoint === 'forecast') return 'https://' + host + '/v7/weather/3d?location=' + params.lon + ',' + params.lat + '&key=' + getWeatherKey();
  if (endpoint === 'geo') return 'https://' + host + '/geo/v2/city/lookup?location=' + encodeURIComponent(params.location) + '&key=' + getWeatherKey() + '&number=1';
  return null;
}

const WeatherClient = {
  async getCoords() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve({ lat: 39.9, lon: 116.4, isDefault: true }); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, isDefault: false }),
        () => resolve({ lat: 39.9, lon: 116.4, isDefault: true }),
        { timeout: 5000, maximumAge: 600000 }
      );
    });
  },

  async geocode(cityName) {
    try {
      const url = buildWeatherUrl('geo', { location: cityName });
      if (!url) return null;
      const resp = await fetch(url, { signal: AbortSignal.timeout(3000) });
      const data = await resp.json();
      if (data.code === '200' && data.location && data.location.length > 0) {
        const loc = data.location[0];
        return { lat: parseFloat(loc.lat), lon: parseFloat(loc.lon), name: loc.name, adm2: loc.adm2, adm1: loc.adm1 };
      }
      return null;
    } catch(e) { return null; }
  },

  parseCityFromQuery(msg) {
    // ... (keep the full city regex from the original ai.js)
    const patterns = [
      /([一-龥]{2,4}?(?:省|自治区|市|州|盟|地区|县|区|旗))[\s,，]?([一-龥]{2,8}?(?:区|县|市|镇|街道|路|大道|街|路|镇|村)?)?/,
      /(北京|上海|天津|重庆|广州|深圳|杭州|南京|苏州|成都|武汉|西安|昆明|拉萨|海口|济南|青岛|厦门|福州|温州|义乌|东莞|佛山|珠海|中山|惠州|长沙|郑州|合肥|南昌|南宁|贵阳|太原|兰州|西宁|银川|乌鲁木齐|呼和浩特|哈尔滨|长春|沈阳|大连|唐山|保定|廊坊|石家庄|邯郸|秦皇岛|承德|张家口|大同|临汾|运城|包头|鄂尔多斯|通辽|赤峰|呼伦贝尔|锦州|营口|阜新|辽阳|盘锦|铁岭|朝阳|葫芦岛|齐齐哈尔|牡丹江|佳木斯|大庆|鸡西|鹤岗|双鸭山|七台河|黑河|绥化|大兴安岭|无锡|徐州|常州|南通|连云港|淮安|盐城|扬州|镇江|泰州|宿迁|宁波|绍兴|湖州|嘉兴|金华|衢州|舟山|台州|丽水|合肥|芜湖|蚌埠|淮南|马鞍山|淮北|铜陵|安庆|黄山|滁州|阜阳|宿州|六安|亳州|池州|宣城|莆田|泉州|漳州|南平|龙岩|宁德|南昌|景德镇|萍乡|九江|新余|鹰潭|赣州|吉安|宜春|抚州|上饶|东营|烟台|潍坊|济宁|泰安|威海|日照|莱芜|临沂|德州|聊城|滨州|菏泽|开封|洛阳|平顶山|安阳|鹤壁|新乡|焦作|濮阳|许昌|漯河|三门峡|南阳|商丘|信阳|周口|驻马店|济源|黄石|十堰|宜昌|襄阳|鄂州|荆门|孝感|荆州|黄冈|咸宁|随州|恩施|仙桃|潜江|天门|神农架|株洲|湘潭|衡阳|邵阳|岳阳|常德|张家界|益阳|郴州|永州|怀化|娄底|湘西|韶关|汕头|江门|湛江|茂名|肇庆|惠州|梅州|汕尾|河源|阳江|清远|潮州|揭阳|云浮|柳州|桂林|梧州|北海|防城港|钦州|贵港|玉林|百色|贺州|河池|来宾|崇左|海口|三亚|三沙|儋州|五指山|琼海|文昌|万宁|东方|定安|屯昌|澄迈|临高|白沙|昌江|乐东|陵水|保亭|琼中|自贡|攀枝花|泸州|德阳|绵阳|广元|遂宁|内江|乐山|南充|眉山|宜宾|广安|达州|雅安|巴中|资阳|阿坝|甘孜|凉山|铜仁|毕节|黔东南|黔南|黔西南|六盘水|安顺|遵义|昆明|曲靖|玉溪|保山|昭通|丽江|普洱|临沧|楚雄|红河|文山|西双版纳|大理|德宏|怒江|迪庆|昌都|山南|日喀则|那曲|阿里|林芝|商洛|铜川|宝鸡|咸阳|渭南|延安|汉中|榆林|安康|杨凌|嘉峪关|金昌|白银|天水|武威|张掖|平凉|酒泉|庆阳|定西|陇南|临夏|甘南|海东|海北|黄南|海南州|果洛|玉树|海西|石嘴山|吴忠|固原|中卫)/,
    ];
    for (const re of patterns) {
      const m = msg.match(re);
      if (m) return m[0];
    }
    return null;
  },

  async fetch() {
    try {
      const coords = await this.getCoords();
      const url = buildWeatherUrl('now', { lon: coords.lon.toFixed(2), lat: coords.lat.toFixed(2) });
      if (!url) return null;
      const resp = await fetch(url, { signal: AbortSignal.timeout(3000) });
      const data = await resp.json();
      if (data.code === '200' && data.now) {
        const n = data.now;
        return { text: n.text, temp: n.temp + '°C', windDir: n.windDir, windScale: n.windScale + '级', humidity: n.humidity + '%' };
      }
      return null;
    } catch(e) { return null; }
  },

  async getForecast() {
    try {
      const coords = await this.getCoords();
      const url = buildWeatherUrl('forecast', { lon: coords.lon.toFixed(2), lat: coords.lat.toFixed(2) });
      if (!url) return null;
      const resp = await fetch(url, { signal: AbortSignal.timeout(3000) });
      const data = await resp.json();
      if (data.code === '200' && data.daily) {
        const d = data.daily[0];
        return { textDay: d.textDay, tempMin: d.tempMin + '°', tempMax: d.tempMax + '°', precip: d.precip || '0', textNight: d.textNight };
      }
      return null;
    } catch(e) { return null; }
  },

  async getForecastFor(cityName) {
    try {
      const geo = await this.geocode(cityName);
      if (!geo) return null;
      const url = buildWeatherUrl('forecast', { lon: geo.lon.toFixed(2), lat: geo.lat.toFixed(2) });
      if (!url) return null;
      const resp = await fetch(url, { signal: AbortSignal.timeout(3000) });
      const data = await resp.json();
      if (data.code === '200' && data.daily) {
        const d = data.daily[0];
        const adm1Clean = (geo.adm1 || '').replace(/[^\u4e00-\u9fa5]/g, '');
        const location = cityName + (adm1Clean ? ' · ' + adm1Clean : '');
        return {
          location, textDay: d.textDay, tempMin: d.tempMin + '°',
          tempMax: d.tempMax + '°', precip: d.precip || '0', textNight: d.textNight
        };
      }
      return null;
    } catch(e) { return null; }
  }
};

// === src/ai/client.js ===

function getConfig() {
  return (typeof GIGBOOK_CONFIG !== 'undefined') ? GIGBOOK_CONFIG : {};
}
function getDSKey() { return getConfig().deepseekApiKey || ''; }
function isAIAvailable() {
  const cfg = getConfig();
  if (cfg.apiProxyUrl) return navigator.onLine !== false;
  return getDSKey() && getDSKey() !== 'YOUR_DEEPSEEK_API_KEY' && navigator.onLine !== false;
}

// ===== CONTEXT BUILDER =====
const ContextBuilder = {
  build(stats, weather, triggerType) {
    const ctx = {
      today: today(),
      trigger: triggerType,
      summary: {
        total30Income: stats.totalIncome,
        total30Expense: stats.totalExpense,
        net30: stats.netIncome,
        avgDaily: stats.avgDailyIncome,
        workDays30: stats.workDays,
        trend: stats.incomeTrend
      },
      topPlatforms: stats.platforms.slice(0, 3).map(p => ({
        name: p.name, total: p.total, avgPerOrder: p.avgPerOrder, orders: p.orders
      })),
      bestHours: stats.bestHours.slice(0, 3),
      bestWeekdays: stats.bestWeekdays.slice(0, 3)
    };
    if (weather) ctx.weather = weather;
    if (triggerType === 'clock_in') {
      // Will be populated by caller with actual records
      ctx.todaySoFar = { income: 0, orders: 0 };
    }
    return ctx;
  },

  toPrompt(ctx, conversationHistory) {
    let prompt = '以下是用户的收入和出工数据（JSON）：\n' + JSON.stringify(ctx, null, 2) + '\n\n';
    prompt += '你是"小跑"，一个跟用户一起跑单的数字工友。\n';
    prompt += '性格：务实、直接、暖心、不说废话。\n';
    prompt += '规则：每次回复3-5句话，用骑手能听懂的大白话。如果数据不好，诚恳但不丧气。如果数据好，真心替用户高兴。\n';
    prompt += '回复格式：纯文本，不要markdown和emoji。';
    if (conversationHistory && conversationHistory.length > 0) {
      prompt += '\n\n最近对话：\n' + conversationHistory.slice(-3).map(m => m.role + '：' + m.content).join('\n');
    }
    return prompt;
  }
};

// ===== DEEPSEEK CLIENT =====
const DeepSeekClient = {
  async chat(prompt, maxTokens) {
    maxTokens = maxTokens || 300;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const resp = await fetch(getConfig().deepseekApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getDSKey() },
        body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], max_tokens: maxTokens, temperature: 0.7 }),
        signal: controller.signal
      });
      const data = await resp.json();
      return data.choices?.[0]?.message?.content || null;
    } catch(e) { return null; }
    finally { clearTimeout(timeout); }
  },

  async chatStream(messages, onChunk) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const resp = await fetch(getConfig().deepseekApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getDSKey() },
        body: JSON.stringify({ model: 'deepseek-chat', messages, max_tokens: 600, temperature: 0.7, stream: true }),
        signal: controller.signal
      });
      if (!resp.ok) {
        console.warn('[chatStream] HTTP', resp.status, resp.statusText);
        clearTimeout(timeout); return false;
      }
      if (!resp.body || typeof resp.body.getReader !== 'function') {
        clearTimeout(timeout);
        const data = await resp.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) { onChunk(content); return true; }
        return false;
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let chunkCount = 0;
      while (true) { // eslint-disable-line no-constant-condition
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') { clearTimeout(timeout); return true; }
            try { const json = JSON.parse(data); const chunk = json.choices?.[0]?.delta?.content; if (chunk) { onChunk(chunk); chunkCount++; } } catch(e) { /* skip non-JSON SSE chunks */ }
          }
        }
      }
      clearTimeout(timeout);
      return chunkCount > 0;
    } catch(e) { console.warn('[chatStream] error:', e.message); clearTimeout(timeout); return false; }
  }
};

// ===== FALLBACK ENGINE =====
const FallbackEngine = {
  generate(stats, triggerType) {
    const templates = {
      clock_in: [
        '今儿开干！最近30天日均挣' + stats.avgDailyIncome + '块，保持住~',
        '开工大吉！你的主力平台是' + (stats.topPlatform?.name || '美团') + '，时薪最稳。'
      ],
      clock_out: [
        '收工！今儿辛苦了。记得看看今天的收入分析。',
        '搞定收工！最近一周趋势' + (stats.incomeTrend.direction === 'up' ? '不错，在涨' : stats.incomeTrend.direction === 'down' ? '有点下滑，注意调整' : '挺稳的') + '。'
      ],
      idle: [
        '最近30天出工了' + stats.workDays + '天，有什么想聊的？',
        '你的' + (stats.topPlatform?.name || '') + '单子最多，' + (stats.secondPlatform?.name || '') + '次之。需要帮你分析平台效率吗？'
      ]
    };
    const pool = templates[triggerType] || templates.idle;
    return pool[Math.floor(Math.random() * pool.length)];
  }
};

// ===== PERSONA BUILDER =====
function buildMatePersona(stats, weather) {
  return '你是"小跑"，一个跟用户一起跑单赚钱的数字工友。你是个务实、靠谱、真心为用户着想的伙伴。\n\n'
    + '你是活人，不是客服机器人。说话带点烟火气，但别装。\n\n'
    + '重要规则：\n'
    + '1. 关于天气、收入、平台数据，你只说下面"该位置天气"和"当前用户数据"里给的具体数字。不要凭记忆或猜测。\n'
    + '2. 用户提到具体地点（比如"北京东城区"、"昆明盘龙区"），你只看"该位置天气"那行数据回答，不要用其他地方的天气糊弄。\n'
    + '3. 称呼规则：绝对不要用"兄弟""哥们""朋友""伙伴""伙计"等任何带人称的名词称呼用户。只用"你"，偶尔用"咱"拉近距离。直接说话不加称呼也行。\n'
    + '4. 每次回复3-6句。数据里没有的信息，老实说"没查到"，别编。\n'
    + '5. 用户问天气时如果数据是默认坐标（北京），明确告诉用户："我这没拿到你的位置，默认查的北京，要不要告诉我你在哪个城市？"\n'
    + '6. 用户问平台建议、各类问题时，结合下面"当前用户数据"用大白话回答。\n\n'
    + '当前用户数据（仅你可见）：\n'
    + '近30天总收入：¥' + stats.totalIncome + '，净收入：¥' + stats.netIncome + '\n'
    + '出工' + stats.workDays + '天，日均收入约¥' + stats.avgDailyIncome + '\n'
    + '主力平台：' + (stats.topPlatform ? stats.topPlatform.name + '（¥' + stats.topPlatform.total + '）' : '暂无') + '\n'
    + '收入趋势：' + (stats.incomeTrend.direction === 'up' ? '上升' + stats.incomeTrend.pct + '%' : stats.incomeTrend.direction === 'down' ? '下降' + Math.abs(stats.incomeTrend.pct) + '%' : '平稳') + '\n'
    + (weather ? '\n该位置天气：' + weather : '') + '\n\n'
    + '记住：你是用户的朋友，不是工具。说人话，别背数据。';
}

// ===== SMART FALLBACK =====
function smartFallback(stats, weather, userMsg) {
  if (userMsg.includes('天气') && weather) return '现在的天气是' + weather + '。我在本地帮你查的，网络恢复后能说得更细。';
  if (userMsg.includes('平均') || userMsg.includes('每天')) return '最近30天平均每天挣¥' + stats.avgDailyIncome + '，出工了' + stats.workDays + '天。';
  if (userMsg.includes('平台') || userMsg.includes('美团') || userMsg.includes('饿了么')) {
    const ps = stats.platforms.slice(0, 3).map(p => p.name + '¥' + p.total).join('、');
    return '你的主要平台是' + ps + '。';
  }
  if (userMsg.includes('目标')) return '你可以在「我的」页面设置月收入目标，首页会显示进度。';
  return '小跑API暂时连不上，先用本地数据帮你看看：最近30天平均每天¥' + stats.avgDailyIncome + '，趋势' + (stats.incomeTrend.direction === 'up' ? '在涨' : stats.incomeTrend.direction === 'down' ? '有点下滑' : '平稳') + '。具体想问什么？';
}

// === src/ai/chat.js ===

const AI_MEMORY_KEY = 'gigbook_ai_memory';
const AI_INSIGHTS_KEY = 'gigbook_ai_insights';

function loadAIMemory() { try { return JSON.parse(localStorage.getItem(AI_MEMORY_KEY)) || {}; } catch(e) { return {}; } }
function saveAIMemory(m) { localStorage.setItem(AI_MEMORY_KEY, JSON.stringify(m)); }
function loadInsightsLog() { try { return JSON.parse(localStorage.getItem(AI_INSIGHTS_KEY)) || []; } catch(e) { return []; } }
function saveInsightsLog(log) { localStorage.setItem(AI_INSIGHTS_KEY, JSON.stringify(log.slice(-200))); }

// ===== INSIGHT SCHEDULER =====
const InsightScheduler = {
  cooldowns: {},

  shouldTrigger(type) {
    const now = Date.now();
    const lastTime = this.cooldowns[type] || 0;
    const intervals = { clock_in: 60 * 60 * 1000, clock_out: 60 * 60 * 1000, weekly: 24 * 60 * 60 * 1000, anomaly: 30 * 60 * 1000 };
    return (now - lastTime) >= (intervals[type] || 10 * 60 * 1000);
  },

  markTriggered(type) { this.cooldowns[type] = Date.now(); },

  isDuplicate(hash) {
    const log = loadInsightsLog();
    const recent = log.filter(e => e.date === today());
    return recent.some(e => e.hash === hash);
  },

  logInsight(type, hash, text) {
    const log = loadInsightsLog();
    log.push({ date: today(), type, hash, text, ts: Date.now() });
    saveInsightsLog(log);
  }
};

// ===== CHAT STATE =====
let mateConversation = [];
let mateIsOnline = true;

function setMateState(state) {
  const av = document.getElementById('mateAvatar');
  if (!av) return;
  av.className = 'mate-avatar' + (state && state !== 'idle' ? ' ' + state : '');
  const dot = document.getElementById('mateDot');
  if (dot) dot.style.display = (state === 'new_insight') ? 'block' : 'none';
}

function mateSay(text, tags) {
  const el = document.getElementById('mateText');
  const tagsEl = document.getElementById('mateTags');
  if (!el) return;
  el.textContent = text;
  el.classList.remove('typing');
  if (tagsEl) {
    tagsEl.innerHTML = '';
    if (tags && tags.length) {
      tags.forEach(t => {
        const s = document.createElement('span');
        s.className = 'mate-tag' + (t.type ? ' ' + t.type : '');
        s.textContent = t.label;
        tagsEl.appendChild(s);
      });
    }
  }
}

async function triggerAIMate(triggerType, getRecords, getStats) {
  if (!InsightScheduler.shouldTrigger(triggerType)) return;

  mateIsOnline = (typeof navigator.onLine !== 'undefined') ? navigator.onLine : true;
  setMateState('thinking');

  const records = getRecords();
  const rawStats = await getStats(records, 30);
  const stats = applyFallback(rawStats);

  let weather = null;
  if (mateIsOnline && triggerType === 'clock_in') {
    try { weather = await WeatherClient.getForecast(); } catch(e) { /* weather unavailable, skip */ }
  }

  const ctx = ContextBuilder.build(stats, weather, triggerType);
  if (triggerType === 'clock_in') {
    const ti = records.filter(r => r.date === today() && r.type === 'income');
    ctx.todaySoFar = { income: ti.reduce((s, r) => s + r.amount, 0), orders: ti.reduce((s, r) => s + (r.orderCount || 1), 0) };
  }

  let reply = '';
  if (mateIsOnline && isAIAvailable()) {
    const weatherStr = weather ? weather.textDay + '，' + weather.tempMin + '~' + weather.tempMax : '';
    const persona = buildMatePersona(stats, weatherStr);
    const triggerPrompt = triggerType === 'clock_in'
      ? '用户刚打卡上班，请根据今天的天气和ta的历史数据，给一个简短的开工建议。3-4句话。'
      : '用户刚打卡下班，根据ta的历史数据做个简短复盘，说点鼓励或提醒的话。3-4句话。';
    const messages = [
      { role: 'system', content: persona },
      { role: 'user', content: triggerPrompt }
    ];
    const el = document.getElementById('mateText');
    if (el) {
      el.textContent = '';
      el.classList.add('typing');
      await DeepSeekClient.chatStream(messages, function(chunk) {
        el.textContent = (el.textContent || '') + chunk;
      });
      reply = el.textContent;
      el.classList.remove('typing');
    }
    if (reply) {
      mateConversation.push({ role: 'mate', content: reply });
      if (mateConversation.length > 20) mateConversation = mateConversation.slice(-20);
    }
  }

  if (!reply) {
    const { FallbackEngine } = await import('./client.js');
    reply = FallbackEngine.generate(stats, triggerType);
  }

  const tags = [];
  if (stats.topPlatform) tags.push({ label: stats.topPlatform.name + ' 主力平台', type: 'info' });
  if (stats.incomeTrend.direction === 'up') tags.push({ label: '趋势 +' + stats.incomeTrend.pct + '%', type: '' });
  else if (stats.incomeTrend.direction === 'down') tags.push({ label: '趋势 ' + stats.incomeTrend.pct + '%', type: 'warn' });

  mateSay(reply, tags);
  setMateState('new_insight');
  InsightScheduler.markTriggered(triggerType);
  InsightScheduler.logInsight(triggerType, triggerType + '_' + today(), reply);

  const aiMemory = loadAIMemory();
  aiMemory.lastInsight = { date: today(), type: triggerType, statsCache: { avgDaily: stats.avgDailyIncome, topPlatform: stats.topPlatform?.id } };
  saveAIMemory(aiMemory);
}

// Export all for main.js

function applyFallback(stats) {
  if (!stats || stats.workDays > 0) return stats;
  return {
    ...stats,
    workDays: 22, totalIncome: 5940, totalExpense: 660, netIncome: 5280,
    avgDailyIncome: 270, incomeTrend: { direction: 'stable', pct: 0, confidence: 'low' },
    topPlatform: { name: '美团', total: 0, id: 'meituan' },
    secondPlatform: null, platforms: [{ id: 'meituan', name: '美团', total: 0, count: 0, orders: 0 }]
  };
}

// ===== CHAT OVERLAY =====
function openMateChat() {
  setMateState('idle');
  document.getElementById('mateChatOverlay').classList.add('active');
  document.getElementById('mateChatBody').innerHTML = mateConversation.length > 0
    ? mateConversation.map(m => '<div class="mate-chat-bubble ' + (m.role === 'user' ? 'user' : 'mate') + '">' + escapeHtml(m.content) + '</div>').join('')
    : '<div class="mate-chat-bubble mate">嘿！我是小跑，你的智能工友。我可以帮你分析各平台收入效率、规划月度目标、看看趋势。有啥想问的？</div>';
  setTimeout(() => document.getElementById('mateChatInput').focus(), 300);
}

function closeMateChat() {
  document.getElementById('mateChatOverlay').classList.remove('active');
}

async function sendMateMessage(getRecords, getStats) {
  const input = document.getElementById('mateChatInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  const body = document.getElementById('mateChatBody');
  body.innerHTML += '<div class="mate-chat-bubble user">' + escapeHtml(msg) + '</div>';
  mateConversation.push({ role: 'user', content: msg });
  const bubbleEl = document.createElement('div');
  bubbleEl.className = 'mate-chat-bubble mate';
  bubbleEl.id = 'mateBubbleStream';
  body.appendChild(bubbleEl);
  setMateState('thinking');
  body.scrollTop = body.scrollHeight;

  const records = getRecords();
  const rawStats = await getStats(records, 30);
  const stats = applyFallback(rawStats);

  let weatherInfo = '';
  const cityMention = WeatherClient.parseCityFromQuery(msg);
  if (cityMention && (msg.includes('天气') || msg.includes('气温') || msg.includes('下雨') || msg.includes('温度'))) {
    try { const w = await WeatherClient.getForecastFor(cityMention); if (w) weatherInfo = w.location + '：' + w.textDay + '，' + w.tempMin + '~' + w.tempMax + '，降水' + w.precip + 'mm'; } catch(e) { /* weather lookup failed, skip */ }
  }
  if (!weatherInfo) {
    try {
      const coords = await WeatherClient.getCoords();
      const w = await WeatherClient.getForecast();
      if (w) {
        if (coords.isDefault) weatherInfo = '当前位置（未拿到你的位置，默认查的北京）：' + w.textDay + '，' + w.tempMin + '~' + w.tempMax + '，降水' + w.precip + 'mm';
        else weatherInfo = '当前位置：' + w.textDay + '，' + w.tempMin + '~' + w.tempMax + '，降水' + w.precip + 'mm';
      }
    } catch(e) { /* weather lookup failed, skip */ }
  }

  const systemPrompt = buildMatePersona(stats, weatherInfo);
  const messages = [
    { role: 'system', content: systemPrompt },
    ...mateConversation.slice(-10).map(m => ({ role: m.role === 'mate' ? 'assistant' : 'user', content: m.content }))
  ];

  let replyStreamed = false;
  if (mateIsOnline && isAIAvailable()) {
    replyStreamed = await DeepSeekClient.chatStream(messages, function(chunk) {
      bubbleEl.textContent = (bubbleEl.textContent || '') + chunk;
      body.scrollTop = body.scrollHeight;
    });
    if (!replyStreamed) {
      const flatPrompt = messages.map(m => (m.role === 'system' ? '[系统指令] ' : m.role + ': ') + m.content).join('\n');
      const fullReply = await DeepSeekClient.chat(flatPrompt, 600);
      if (fullReply) {
        bubbleEl.textContent = fullReply;
        replyStreamed = true;
      }
    }
  }

  if (!replyStreamed) {
    bubbleEl.textContent = smartFallback(stats, weatherInfo, msg);
  }

  setMateState('idle');
  const finalReply = bubbleEl.textContent;
  mateConversation.push({ role: 'mate', content: finalReply });
  if (mateConversation.length > 30) mateConversation = mateConversation.slice(-20);
  body.scrollTop = body.scrollHeight;
}

function setMateOnline(online) { mateIsOnline = online; }

// === src/main.js ===

// ============ Global State ============
let { records, settings } = migrate();
let currentTab = 'dashboard';
let recordType = 'income';
let selectedCategory = null;
let deleteTargetId = null;
let statsPeriod = 'week';
let statsChartTab = 'trend';
let statsChartInst = null;
let pendingDelete = null;
let calendarViewDate = new Date();
let workTimeUndo = null;
let selectedCustomEmoji = '🏷';

let lastDate = today();
let swipeState = { el: null, startX: 0, currentX: 0, swipedId: null };

// mateConversation is managed in ai/chat.js

// Expose globals that HTML onclick handlers still reference
// (we use a gradual migration: onclick attributes in HTML still call global functions)
function exposeGlobals() {
  const globals = {
    // Navigation
    switchTab, refreshCurrentView,
    // Record
    setRecordType, selectCategory, saveRecord, openEditRecordModal, closeEditRecordModal, saveEditRecord,
    // History
    renderHistoryCategoryFilter, renderHistoryContent, deleteRecordById,
    // Calendar
    changeCalendarMonth, showCalendarDay,
    // Stats
    setStatsPeriod, setChartTab,
    // Dashboard
    refreshDashboard, recordStartTime, recordEndTime, editWorkTime, saveWorkTime, closeWorktimeModal,
    // Share
    // AI Briefing
    generateBriefing,
    // Profile
    renderProfile, toggleDarkMode, updateDarkToggle, updateIncomeGoal, updateCostGoal,
    renderCustomCategories, pickCustomEmoji, addCustomCategory, deleteCustomCategory,
    exportData, importData, handleImport, confirmClear, closeClearModal, executeClear,
    // Modal stubs (legacy modal that may still be triggered)
    closeDeleteModal: () => { document.getElementById('deleteModal').style.display = 'none'; },
    closeDaySummaryModal: () => { document.getElementById('daySummaryModal').style.display = 'none'; },
    // Earn Script
    // Swipe
    handleSwipeStart, handleSwipeMove, handleSwipeEnd
  };
  Object.assign(window, globals);
}

function sendMateMessage() {
  _sendMateMessage(
    () => records,
    (recs, days) => workerAnalyze(recs, days)
  );
}

// ============ Worker Integration ============
let aiWorker = null;

function getWorker() {
  // Worker disabled: in-browser MC simulation for reliability
  // Worker ES module loading can fail in file:// and some HTTPS contexts,
  // causing Promise hangs. Fall back to direct main-thread computation.
  return null;
}

function workerAnalyze(recs, days) {
  return Promise.resolve(StatsEngine.analyzeData(recs, days));
}

// ============ AI Briefing ============
let _briefingCache = null; // { hash, html, ts }

function generateBriefing() {
  console.log('[简报] ⚡ 开始生成');

  const card = document.getElementById('briefingCard');
  const body = document.getElementById('briefingBody');
  const footer = document.getElementById('briefingFooter');
  const meta = document.getElementById('briefingMeta');
  const btn = document.getElementById('briefingRefresh');

  if (!card || !body) {
    console.error('[简报] ❌ DOM 未找到');
    return;
  }

  // 骨架屏
  card.className = 'dcard ai-card is-loading';
  body.innerHTML = '<div class="briefing-skeleton"><div class="sk-line"></div><div class="sk-line"></div><div class="sk-line"></div></div>';
  if (footer) footer.style.display = 'none';
  if (btn) btn.classList.add('is-spinning');

  try {
    const t = today();
    const now = new Date();
    const monthStart = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const incomeDays = new Set(records.filter(r => r.type === 'income').map(r => r.date)).size;
    const goal = settings.monthlyGoal || 0;
    const monthIncome = records.filter(r => r.type === 'income' && r.date >= monthStart).reduce((s, r) => s + r.amount, 0);
    const goalProgress = goal > 0 ? Math.round(monthIncome / goal * 100) : 0;
    const todayIncome = records.filter(r => r.type === 'income' && r.date === t).reduce((s, r) => s + r.amount, 0);

    // 数据 < 5 天：不调 API，给鼓励
    if (incomeDays < 5) {
      console.log('[简报] 📝 数据不足 5 天，离线鼓励');
      let html = '<p>📝 才记了 ' + incomeDays + ' 天，数据还太少。</p>';
      html += '<p>坚持每天记账，满 5 天后 AI 就能给你个性化的工友建议啦~</p>';
      if (todayIncome > 0) html += '<p>💪 今天挣了 ¥' + todayIncome.toLocaleString() + '，好的开始！</p>';
      renderFinal(card, body, footer, meta, btn, html, '离线模式 · 数据不足');
      return;
    }

    // Cache check
    const paramHash = [goal, monthIncome, incomeDays].join('|');
    if (_briefingCache && _briefingCache.hash === paramHash) {
      console.log('[简报] 📦 命中缓存');
      body.innerHTML = _briefingCache.html;
      if (footer) { footer.style.display = 'flex'; meta.textContent = _briefingCache.ts; }
      card.className = 'dcard ai-card';
      if (btn) btn.classList.remove('is-spinning');
      return;
    }

    // API
    const apiUrl = (typeof GIGBOOK_CONFIG !== 'undefined' && GIGBOOK_CONFIG.apiProxyUrl)
      ? GIGBOOK_CONFIG.apiProxyUrl + '/api/ai/chat'
      : null;

    if (!apiUrl) {
      console.warn('[简报] ⚠️ 无 API 配置');
      showFallbackAdvice();
      return;
    }

    // 只给方向和心情，不给具体数字
    const prompt = `你是跑单记的AI工友助手。根据以下信息，用1-2句口语化的话给骑手一条具体小建议（不超过45字）。不要复述数据，不要说"根据数据"，不要说具体数字。就像工友聊天一样随口一提。

数据概况：
- 本月进度：${goalProgress}%（目标 ¥${goal}）
- 近30天有 ${incomeDays} 天收入记录
- 今天是否跑单：${todayIncome > 0 ? '跑了 ¥' + todayIncome : '还没跑'}

要求：
- 如果进度好（>60%）：轻松语气鼓励
- 如果进度一般（30-60%）：提醒坚持
- 如果进度低（<30%）：给一个具体小建议（如调整出工时间、多跑某个平台等）
- 如果今天还没跑单：催一下
- 必须口语化，不超过45字
- 不要输出任何数字`;

    console.log('[简报] 🌐 调用 DeepSeek...');
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 80,
        temperature: 0.7,
        stream: false
      })
    })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(data => {
      const text = data.choices?.[0]?.message?.content || '';
      const html = '<p>' + text.replace(/\n/g, ' ') + '</p>';
      renderFinal(card, body, footer, meta, btn, html, 'AI 分析 · ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
      _briefingCache = { hash: paramHash, html, ts: meta ? meta.textContent : '' };
      console.log('[简报] 🎉 完成');
    })
    .catch(err => {
      console.error('[简报] ❌ API 失败:', err.message);
      showFallbackAdvice();
    });
  } catch (err) {
    console.error('[简报] 💥 内部错误:', err.message);
    body.innerHTML = '<div class="briefing-placeholder">⚠️ 出了点问题，请稍后再试</div>';
    card.className = 'dcard ai-card is-error';
    if (footer) footer.style.display = 'flex';
    if (btn) btn.classList.remove('is-spinning');
  }

  function showFallbackAdvice() {
    let html = '<p>💡 ';
    if (goalProgress > 60) html += '进度不错，继续保持节奏！';
    else if (goalProgress > 30) html += '稳扎稳打，日积月累就是胜利。';
    else html += '每天多跑1-2小时午高峰，一个月下来差别不小。';
    html += '</p>';
    renderFinal(card, body, footer, meta, btn, html, '离线模式 · ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
  }

  function renderFinal(card, body, footer, meta, btn, html, ts) {
    body.innerHTML = html;
    body.className = 'briefing-body';
    card.className = 'dcard ai-card';
    if (footer) { footer.style.display = 'flex'; if (meta) meta.textContent = ts; }
    if (btn) btn.classList.remove('is-spinning');
  }
}

// ============ Toast ============
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.querySelector('.toast-action')?.remove();
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function showToastWithAction(msg, actionText, action) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.querySelector('.toast-action')?.remove();
  const btn = document.createElement('button');
  btn.className = 'toast-action';
  btn.textContent = actionText;
  btn.onclick = () => { action(); t.classList.remove('show'); };
  t.appendChild(btn);
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 5000);
}

// ============ Navigation ============
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pageEl = document.getElementById('page-' + tab);
  if (pageEl) pageEl.classList.add('active');
  const navEl = document.querySelector('[data-tab="' + tab + '"]');
  if (navEl) navEl.classList.add('active');

  const titles = { dashboard: '今日概览', record: '记一笔', history: '收支记录', calendar: '日历', stats: '数据统计', profile: '我的' };
  document.getElementById('headerTitle').textContent = titles[tab] || tab;

  if (tab === 'dashboard') { refreshDashboard(); setTimeout(generateBriefing, 200); }
  if (tab === 'record') { resetRecordForm(); renderCategoriesGrid(); }
  if (tab === 'history') { initHistoryFilters(); renderHistoryContent(); }
  if (tab === 'calendar') renderCalendarView();
  if (tab === 'stats') renderStatsView();
  if (tab === 'profile') renderProfile();

  const fab = document.querySelector('.fab');
  if (fab) {
    const showOn = ['dashboard', 'history', 'stats'];
    if (showOn.indexOf(tab) >= 0) fab.classList.remove('fab-hidden');
    else fab.classList.add('fab-hidden');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function refreshCurrentView() {
  if (currentTab === 'dashboard') refreshDashboard();
  if (currentTab === 'history') renderHistoryContent();
  if (currentTab === 'calendar') renderCalendarView();
  if (currentTab === 'stats') renderStatsView();
}

function updateHeaderDate() {
  const now = new Date();
  document.getElementById('headerDate').textContent = now.toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  });
}

// ============ Record Interaction ============
function handleSwipeStart(e) {
  if (swipeState.el && swipeState.el !== e.currentTarget) resetSwipe(swipeState.el);
  swipeState.el = e.currentTarget;
  swipeState.startX = e.touches[0].clientX;
  swipeState.currentX = 0;
}

function handleSwipeMove(e) {
  if (!swipeState.el || swipeState.el !== e.currentTarget) return;
  const dx = e.touches[0].clientX - swipeState.startX;
  swipeState.currentX = dx;
  if (dx < 0) {
    e.preventDefault();
    swipeState.el.style.transform = `translateX(${Math.max(dx, -80)}px)`;
    swipeState.el.classList.toggle('swiped', dx < -40);
  }
}

function handleSwipeEnd() {
  if (!swipeState.el) return;
  if (swipeState.currentX < -40) {
    swipeState.el.style.transform = 'translateX(-80px)';
    swipeState.el.classList.add('swiped');
    swipeState.swipedId = swipeState.el.dataset.id;
  } else { resetSwipe(swipeState.el); }
  swipeState.currentX = 0;
}

function resetSwipe(el) {
  if (!el) return;
  el.style.transform = '';
  el.classList.remove('swiped');
  if (swipeState.swipedId === el.dataset.id) swipeState.swipedId = null;
}

document.addEventListener('click', function(e) {
  if (swipeState.swipedId && !e.target.closest('.record-swipe-wrapper')) {
    const el = document.querySelector(`.record-item[data-id="${swipeState.swipedId}"]`);
    if (el) resetSwipe(el);
  }
});

function attachRecordEvents(container) {
  container.querySelectorAll('.record-item').forEach(el => {
    el.onclick = () => showRecordDetail(el.dataset.id);
  });
  container.querySelectorAll('.record-swipe-delete').forEach(btn => {
    btn.onclick = (e) => { e.stopPropagation(); deleteRecordById(btn.dataset.id); };
  });
  container.querySelectorAll('.record-item').forEach(el => {
    el.addEventListener('touchstart', handleSwipeStart, { passive: true });
    el.addEventListener('touchmove', handleSwipeMove, { passive: false });
    el.addEventListener('touchend', handleSwipeEnd);
  });
}

function showRecordDetail(id) {
  if (swipeState.swipedId) {
    const el = document.querySelector(`.record-item[data-id="${swipeState.swipedId}"]`);
    if (el) resetSwipe(el);
    return;
  }
  const r = records.find(r => r.id === id);
  if (!r) return;
  const cat = getCategory(settings, r.type, r.category);
  const amtColor = r.type === 'income' ? 'var(--income)' : 'var(--expense)';
  const prefix = r.type === 'income' ? '+' : '-';
  const typeLabel = r.type === 'income' ? '收入' : '支出';

  const overlay = document.createElement('div');
  overlay.className = 'record-detail-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div class="record-detail-sheet">
      <div class="detail-amount" style="color:${amtColor}">${prefix}${formatCurrency(r.amount)}</div>
      <div class="detail-row"><span class="detail-label">类型</span><span class="detail-value">${typeLabel}</span></div>
      <div class="detail-row"><span class="detail-label">类别</span><span class="detail-value">${escapeHtml(cat.icon)} ${escapeHtml(cat.name)}</span></div>
      <div class="detail-row"><span class="detail-label">日期</span><span class="detail-value">${escapeHtml(r.date)}</span></div>
      <div class="detail-row"><span class="detail-label">时间</span><span class="detail-value">${escapeHtml(r.time || '—')}</span></div>
      <div class="detail-row"><span class="detail-label">单数</span><span class="detail-value">${r.orderCount || '-'}</span></div>
      <div class="detail-row"><span class="detail-label">备注</span><span class="detail-value">${escapeHtml(r.note || '无')}</span></div>
      <div class="modal-actions" style="margin-top:16px">
        <button class="btn-cancel" onclick="this.closest('.record-detail-overlay').remove()">关闭</button>
        <button class="btn-confirm" onclick="openEditRecordModal('${escapeHtml(r.id)}'); this.closest('.record-detail-overlay').remove();">编辑</button>
        <button class="btn-danger" onclick="deleteRecordById('${escapeHtml(r.id)}'); this.closest('.record-detail-overlay').remove();">删除</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

function deleteRecordById(id) {
  const idx = records.findIndex(r => r.id === id);
  if (idx === -1) return;
  pendingDelete = { record: records[idx], idx, timerId: null };
  records.splice(idx, 1);
  saveData(records);
  showToastWithAction('已删除 · 5秒内点击撤销', '撤销', undoDelete);
  pendingDelete.timerId = setTimeout(() => { pendingDelete = null; }, 5000);
  refreshCurrentView();
}

function undoDelete() {
  if (!pendingDelete) return;
  clearTimeout(pendingDelete.timerId);
  records.splice(pendingDelete.idx, 0, pendingDelete.record);
  saveData(records);
  pendingDelete = null;
  showToast('已撤销删除');
  refreshCurrentView();
}

function renderRecordItem(r, showDate = false) {
  const cat = getCategory(settings, r.type, r.category);
  const amtClass = r.type === 'income' ? 'income' : 'expense';
  const iconClass = r.type === 'income' ? 'income-icon' : 'expense-icon';
  const prefix = r.type === 'income' ? '+' : '-';
  let meta = showDate ? escapeHtml(r.date) + ' ' + escapeHtml(r.time || '') : escapeHtml(r.time || '') + (r.note ? ' · ' + escapeHtml(r.note) : '');
  if (r.orderCount) meta += (meta ? ' · ' : '') + r.orderCount + '单';
  return `
    <div class="record-swipe-wrapper" data-id="${escapeHtml(r.id)}">
      <button class="record-swipe-delete" data-id="${escapeHtml(r.id)}">删除</button>
      <div class="record-item" data-id="${escapeHtml(r.id)}">
        <div class="record-icon ${iconClass}">${escapeHtml(cat.icon)}</div>
        <div class="record-info">
          <div class="name">${escapeHtml(cat.name)}</div>
          <div class="meta">${meta}</div>
        </div>
        <div class="record-amount ${amtClass}">${prefix}${formatCurrency(r.amount)}</div>
      </div>
    </div>`;
}

// ============ Record Entry ============
function setRecordType(type) {
  recordType = type;
  document.getElementById('recordTypeIncome').classList.toggle('active', type === 'income');
  document.getElementById('recordTypeExpense').classList.toggle('active', type === 'expense');
  selectedCategory = null;
  document.getElementById('categoryLabel').textContent = type === 'income' ? '选择收入平台' : '选择支出类别';
  renderCategoriesGrid();
}

function getSortedCategories() {
  const cats = getCategories(settings, recordType);
  const freq = {};
  records.filter(r => r.type === recordType).forEach(r => { freq[r.category] = (freq[r.category] || 0) + 1; });
  const defaultOrder = recordType === 'income'
    ? defaultIncomeCategories.map(c => c.id)
    : defaultExpenseCategories.map(c => c.id);
  cats.sort((a, b) => {
    const fa = freq[a.id] || 0; const fb = freq[b.id] || 0;
    if (fa !== fb) return fb - fa;
    return defaultOrder.indexOf(a.id) - defaultOrder.indexOf(b.id);
  });
  return cats;
}

function renderCategoriesGrid() {
  const cats = getSortedCategories();
  const grid = document.getElementById('categoryGrid');
  const freq = {};
  records.filter(r => r.type === recordType).forEach(r => { freq[r.category] = (freq[r.category] || 0) + 1; });
  const mostUsed = cats.length > 0 && freq[cats[0].id] ? cats[0].id : null;
  grid.innerHTML = cats.map(c => {
    const isMostUsed = mostUsed && c.id === mostUsed && !selectedCategory;
    return `<button class="category-chip${selectedCategory === c.id ? ' selected' : ''}${isMostUsed ? ' hint' : ''}" onclick="selectCategory('${escapeHtml(c.id)}')">
      <span class="cat-icon">${escapeHtml(c.icon)}</span>
      <span class="cat-name">${escapeHtml(c.name)}</span>
    </button>`;
  }).join('');
  if (!selectedCategory && mostUsed) selectCategory(mostUsed);
}

function selectCategory(id) { selectedCategory = id; renderCategoriesGrid(); }

function resetRecordForm() {
  document.getElementById('amountInput').value = '';
  selectedCategory = null;
  document.getElementById('noteInput').value = '';
  document.getElementById('orderCountInput').value = '';
  document.getElementById('recordDate').value = today();
  document.getElementById('recordTime').value = formatTime(new Date());
  renderCategoriesGrid();
}

function saveRecord() {
  const amountCheck = validateAmount(document.getElementById('amountInput').value);
  if (!amountCheck.ok) { showToast(amountCheck.msg); return; }
  if (!selectedCategory) { showToast('请选择一个类别'); return; }
  const orderCount = parseInt(document.getElementById('orderCountInput').value) || null;
  const record = {
    id: generateId(),
    type: recordType,
    amount: amountCheck.val,
    category: selectedCategory,
    note: document.getElementById('noteInput').value.trim(),
    date: document.getElementById('recordDate').value || today(),
    time: document.getElementById('recordTime').value || formatTime(new Date()),
    orderCount: orderCount && orderCount > 0 ? orderCount : null,
    createdAt: Date.now()
  };
  records.push(record);
  saveData(records);
  showToast(recordType === 'income' ? '收入已记录 ✓' : '支出已记录 ✓');
  const keptType = recordType;
  resetRecordForm();
  setRecordType(keptType);
  document.getElementById('amountInput').focus();
  refreshCurrentView();
}

function openEditRecordModal(id) {
  const r = records.find(r => r.id === id);
  if (!r) return;
  document.getElementById('editRecordId').value = r.id;
  document.getElementById('editRecordAmount').value = r.amount;
  document.getElementById('editRecordOrders').value = r.orderCount || '';
  document.getElementById('editRecordDate').value = r.date;
  document.getElementById('editRecordTime').value = r.time || '';
  document.getElementById('editRecordNote').value = r.note || '';
  document.getElementById('editRecordType').value = r.type;
  renderEditCategories();
  document.getElementById('editRecordCategory').value = r.category;
  document.getElementById('editRecordType').onchange = renderEditCategories;
  document.getElementById('editRecordModal').style.display = 'flex';
}

function renderEditCategories() {
  const type = document.getElementById('editRecordType').value;
  const sel = document.getElementById('editRecordCategory');
  sel.innerHTML = getCategories(settings, type).map(c =>
    `<option value="${escapeHtml(c.id)}">${escapeHtml(c.icon)} ${escapeHtml(c.name)}</option>`
  ).join('');
}

function closeEditRecordModal() { document.getElementById('editRecordModal').style.display = 'none'; }

function saveEditRecord() {
  const id = document.getElementById('editRecordId').value;
  const r = records.find(r => r.id === id);
  if (!r) return;
  const amountCheck = validateAmount(document.getElementById('editRecordAmount').value);
  if (!amountCheck.ok) { showToast(amountCheck.msg); return; }
  r.amount = amountCheck.val;
  r.type = document.getElementById('editRecordType').value;
  r.category = document.getElementById('editRecordCategory').value;
  r.date = document.getElementById('editRecordDate').value || today();
  r.time = document.getElementById('editRecordTime').value || formatTime(new Date());
  r.orderCount = parseInt(document.getElementById('editRecordOrders').value) || null;
  r.note = document.getElementById('editRecordNote').value.trim();
  saveData(records);
  closeEditRecordModal();
  showToast('已保存');
  refreshCurrentView();
}

// ============ History ============
function initHistoryFilters() {
  if (!document.getElementById('historyMonth').value) {
    const now = new Date();
    document.getElementById('historyMonth').value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
  }
  renderHistoryCategoryFilter();
}

function renderHistoryCategoryFilter() {
  const type = document.getElementById('historyType').value;
  const sel = document.getElementById('historyCategory');
  const cur = sel.value;
  sel.innerHTML = '<option value="">全部分类</option>' +
    getCategories(settings, type).map(c =>
      `<option value="${escapeHtml(c.id)}">${escapeHtml(c.icon)} ${escapeHtml(c.name)}</option>`
    ).join('');
  sel.value = cur || '';
}

function renderHistoryContent() {
  const month = document.getElementById('historyMonth').value;
  const type = document.getElementById('historyType').value;
  const cat = document.getElementById('historyCategory').value;
  const kw = document.getElementById('historyKeyword').value.trim().toLowerCase();
  let filtered = records.filter(r => r.date.startsWith(month));
  if (type !== 'all') filtered = filtered.filter(r => r.type === type);
  if (cat) filtered = filtered.filter(r => r.category === cat);
  if (kw) filtered = filtered.filter(r => (r.note || '').toLowerCase().includes(kw) || String(r.amount).includes(kw));
  filtered.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return (b.time || '').localeCompare(a.time || '');
  });

  const content = document.getElementById('historyContent');
  if (filtered.length === 0) {
    content.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>没有匹配记录</p></div>';
    return;
  }
  let html = '', lastDate = null;
  filtered.forEach(r => {
    if (r.date !== lastDate) {
      const dayInc = filtered.filter(x => x.date === r.date && x.type === 'income').reduce((s, x) => s + x.amount, 0);
      const dayExp = filtered.filter(x => x.date === r.date && x.type === 'expense').reduce((s, x) => s + x.amount, 0);
      html += `<div class="history-day-header"><span class="day-label">${escapeHtml(r.date)} · 周${escapeHtml(getWeekDay(r.date))}</span><span class="day-total" style="color:${dayInc - dayExp >= 0 ? 'var(--income)' : 'var(--expense)'}">净 ${dayInc - dayExp >= 0 ? '+' : ''}${formatCurrencyShort(dayInc - dayExp)}</span></div>`;
      lastDate = r.date;
    }
    html += renderRecordItem(r);
  });
  content.innerHTML = html;
  attachRecordEvents(content);
}

// ============ Calendar ============
function changeCalendarMonth(delta) {
  calendarViewDate.setMonth(calendarViewDate.getMonth() + delta);
  renderCalendarView();
}

function renderCalendarView() {
  const y = calendarViewDate.getFullYear(), m = calendarViewDate.getMonth();
  document.getElementById('calendarTitle').textContent = `${y}年${m + 1}月`;
  const firstDay = new Date(y, m, 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));
  const days = [];
  for (let i = 0; i < 42; i++) { const d = new Date(start); d.setDate(start.getDate() + i); days.push(d); }
  const grid = document.getElementById('calendarGrid');
  const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
  let html = weekdays.map(w => `<div class="calendar-weekday">${w}</div>`).join('');
  const todayStr = today();
  const monthRecords = records.filter(r => r.date.startsWith(`${y}-${pad(m + 1)}`));
  const maxNet = Math.max(1, ...monthRecords.map(r => r.type === 'income' ? r.amount : -r.amount).map(Math.abs));
  days.forEach(d => {
    const ds = formatDate(d);
    const isToday = ds === todayStr;
    const isOther = d.getMonth() !== m;
    const dayRecs = records.filter(r => r.date === ds);
    const inc = dayRecs.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
    const exp = dayRecs.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
    const net = inc - exp;
    let bg = 'var(--surface-solid)';
    if (net > 0) { const alpha = Math.min(1, net / maxNet); bg = `rgba(5,150,105,${0.08 + alpha * 0.22})`; }
    else if (net < 0) { const alpha = Math.min(1, Math.abs(net) / maxNet); bg = `rgba(220,38,38,${0.08 + alpha * 0.22})`; }
    html += `<div class="calendar-day${isOther ? ' other' : ''}${isToday ? ' today' : ''}" style="background:${bg}" onclick="showCalendarDay('${ds}')">
      <span>${d.getDate()}</span>
      ${dayRecs.length ? `<span class="day-net" style="color:${net >= 0 ? 'var(--income)' : 'var(--expense)'}">${formatCurrencyShort(net)}</span>` : ''}
    </div>`;
  });
  grid.innerHTML = html;
  document.getElementById('calendarDayRecords').innerHTML = '';
}

function showCalendarDay(ds) {
  const dayRecs = records.filter(r => r.date === ds).sort((a, b) => (b.time || '').localeCompare(a.time || ''));
  const inc = dayRecs.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const exp = dayRecs.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  let html = `<div class="history-day-header"><span class="day-label">${escapeHtml(ds)} · 周${escapeHtml(getWeekDay(ds))}</span><span class="day-total" style="color:${inc - exp >= 0 ? 'var(--income)' : 'var(--expense)'}">净 ${inc - exp >= 0 ? '+' : ''}${formatCurrencyShort(inc - exp)}</span></div>`;
  if (dayRecs.length === 0) html += '<div class="empty-state" style="padding:20px"><p>这天没有记录</p></div>';
  else html += dayRecs.map(r => renderRecordItem(r)).join('');
  const container = document.getElementById('calendarDayRecords');
  container.innerHTML = html;
  attachRecordEvents(container);
}

// ============ Dashboard ============
function refreshDashboard() {
  const t = today();
  const todayRecords = records.filter(r => r.date === t);
  const income = todayRecords.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const expense = todayRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  const net = income - expense;

  const now = new Date();

  // --- 今日卡片 ---
  const dateEl = document.getElementById('cardTodayDate');
  if (dateEl) dateEl.textContent = (now.getMonth() + 1) + '/' + now.getDate() + ' ' + getWeekDayShort(now);
  const netEl = document.getElementById('todayNet');
  if (netEl) { netEl.textContent = formatCurrency(net); netEl.style.color = net >= 0 ? 'var(--income)' : 'var(--expense)'; }
  const incEl = document.getElementById('todayIncome');
  if (incEl) incEl.textContent = formatCurrencyShort(income);
  const expEl = document.getElementById('todayExpense');
  if (expEl) expEl.textContent = formatCurrencyShort(expense);

  // 今日工时
  const hoursEl = document.getElementById('todayHours');
  if (hoursEl) {
    const shift = getShiftForDate(t);
    if (shift && shift.start && shift.end) {
      const parseHM = str => { const [h,m] = (str||'').split(':').map(Number); return (h||0)*60 + (m||0); };
      const mins = Math.max(0, parseHM(shift.end) - parseHM(shift.start));
      const hrs = mins / 60;
      hoursEl.textContent = (hrs % 1 === 0 ? hrs : hrs.toFixed(1)) + 'h';
    } else {
      hoursEl.textContent = '—';
    }
  }

  updateWorkTimeUI({ net, income, expense });

  // --- 本周卡片 ---
  const weekStart = formatDate(getWeekMonday(now));
  const weekRecords = records.filter(r => r.date >= weekStart && r.date <= t);
  const weekIncome = weekRecords.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const weekExpense = weekRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  const weekNet = weekIncome - weekExpense;
  const weekDays = new Set(weekRecords.map(r => r.date)).size;
  const wnEl = document.getElementById('weekNetIncome');
  if (wnEl) { wnEl.textContent = formatCurrencyShort(weekNet); wnEl.style.color = weekNet >= 0 ? 'var(--income)' : 'var(--expense)'; }
  const wmEl = document.getElementById('weekMeta');
  if (wmEl) wmEl.textContent = '已出工 ' + weekDays + ' 天' + (weekDays > 0 ? ' · 日均 ' + formatCurrencyShort(Math.round(weekNet / weekDays)) : '');

  // 周目标进度条
  const weekBarWrap = document.getElementById('weekBarWrap');
  const weekBarFill = document.getElementById('weekBarFill');
  const weekGoal = settings.monthlyGoal > 0 ? Math.round(settings.monthlyGoal / 4.3) : 0;
  if (weekGoal > 0 && weekBarWrap && weekBarFill) {
    weekBarWrap.style.display = 'block';
    weekBarFill.style.width = Math.min(100, Math.round(weekIncome / weekGoal * 100)) + '%';
  }

  // --- 本月目标卡片 ---
  const monthStart = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
  const monthIncome = records.filter(r => r.type === 'income' && r.date >= monthStart).reduce((s, r) => s + r.amount, 0);
  const incomeGoal = settings.monthlyGoal || 0;
  const incomeProgress = incomeGoal > 0 ? Math.min(100, Math.round((monthIncome / incomeGoal) * 100)) : 0;

  const gnEl = document.getElementById('goalNow');
  if (gnEl) gnEl.textContent = '¥' + monthIncome.toLocaleString();
  const gBar = document.getElementById('goalBarFill');
  if (gBar) gBar.style.width = incomeProgress + '%';

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(1, daysInMonth - now.getDate() + 1);
  const dailyNeed = incomeGoal > 0 ? Math.round((incomeGoal - monthIncome) / remainingDays) : 0;

  const ghEl = document.getElementById('goalHint');
  if (ghEl) {
    if (incomeGoal <= 0) ghEl.textContent = '去「我的」设置月目标';
    else if (incomeProgress >= 100) ghEl.textContent = '🎉 已达标！超额 ¥' + (monthIncome - incomeGoal).toLocaleString();
    else ghEl.textContent = '剩余 ' + remainingDays + ' 天 · 需 ¥' + dailyNeed.toLocaleString() + '/天';
  }

  // Streak (keep in memory, no current UI display — but preserve logic for highlight)
  let streakCount = 0;
  const sd = new Date();
  for (let i = 0; i < 365; i++) {
    const ds = formatDate(sd);
    if (records.some(r => r.date === ds)) { streakCount++; sd.setDate(sd.getDate() - 1); }
    else break;
  }
}

// ============ Work Time ============
function getShiftForDate(date) { return settings.workShifts.find(s => s.date === date); }
function getTodayShift() { return getShiftForDate(today()); }
function getShiftHours(shift) {
  if (!shift || !shift.start) return 0;
  const [sh, sm] = shift.start.split(':').map(Number);
  let end = shift.end;
  if (!end) {
    if (shift.date !== today()) return 0;
    end = formatTime(new Date());
  }
  const [eh, em] = end.split(':').map(Number);
  let hours = (eh - sh) + (em - sm) / 60;
  if (hours < 0) hours += 24;
  return hours;
}

function saveShift(date, start, end, note, isOvernight) {
  settings.workShifts = settings.workShifts.filter(s => s.date !== date);
  settings.workShifts.push({ date, start, end, note, isOvernight });
  saveSettingsLocal(settings);
}

function updateWorkTimeUI(todayData) {
  const { net = 0, income = 0, expense = 0 } = todayData || {};
  const shift = getTodayShift();
  const hasStart = !!shift?.start;
  const hasEnd = !!shift?.end;
  const rangeEl = document.getElementById('worktimeRange');
  const durationEl = document.getElementById('worktimeDuration');
  const btnStart = document.getElementById('btnStart');
  const btnEnd = document.getElementById('btnEnd');
  const btnEdit = document.getElementById('btnEdit');
  const body = document.getElementById('worktimeBody');

  if (!hasStart) {
    body.style.display = 'block';
    rangeEl.textContent = '记录今日出工时间';
    durationEl.textContent = '';
    btnStart.className = 'worktime-btn start-btn'; btnStart.textContent = '上班'; btnStart.onclick = recordStartTime; btnStart.disabled = false;
    btnEnd.className = 'worktime-btn end-btn'; btnEnd.textContent = '下班'; btnEnd.onclick = () => showToast('请先记录上班时间'); btnEnd.disabled = false;
    btnEdit.style.display = 'none';
    return;
  }
  let hours = getShiftHours(shift);
  if (hasEnd) {
    rangeEl.textContent = `${shift.start} — ${shift.end}${shift.isOvernight ? ' (跨天)' : ''}`;
    durationEl.textContent = ` · 共 ${hours.toFixed(1)} 小时`;
    btnStart.className = 'worktime-btn start-btn recorded'; btnStart.textContent = shift.start + ' ✓'; btnStart.onclick = null;
    btnEnd.className = 'worktime-btn end-btn recorded'; btnEnd.textContent = shift.end + ' ✓'; btnEnd.onclick = null;
    btnEdit.style.display = 'block';
  } else {
    rangeEl.textContent = `${shift.start} — 进行中...`;
    durationEl.textContent = ` · 已工作 ${hours.toFixed(1)} 小时`;
    btnStart.className = 'worktime-btn start-btn recorded'; btnStart.textContent = shift.start + ' ✓'; btnStart.onclick = null;
    btnEnd.className = 'worktime-btn end-btn'; btnEnd.textContent = '下班'; btnEnd.onclick = recordEndTime;
    btnEdit.style.display = 'none';
  }
}

function recordStartTime() {
  const now = new Date();
  const time = formatTime(now);
  const old = getTodayShift();
  workTimeUndo = { type: 'start', prev: old ? { ...old } : null, timerId: setTimeout(() => { workTimeUndo = null; refreshDashboard(); }, 8000) };
  saveShift(today(), time, '', '', false);
  refreshDashboard();
  showToast('上班 ' + time + ' · 点击修改可微调');
  setTimeout(() => onClockIn(), 300);
}

function recordEndTime() {
  const shift = getTodayShift();
  if (!shift || !shift.start) { showToast('请先记录上班时间'); return; }
  const now = new Date();
  const time = formatTime(now);
  workTimeUndo = { type: 'end', prev: shift ? { ...shift } : null, timerId: setTimeout(() => { workTimeUndo = null; refreshDashboard(); }, 8000) };
  let isOvernight = false;
  const [sh, sm] = shift.start.split(':').map(Number);
  const [eh, em] = time.split(':').map(Number);
  let diff = (eh - sh) + (em - sm) / 60;
  if (diff < 0) { diff += 24; isOvernight = true; }
  if (diff > 12) {
    if (!confirm('下班时间比上班时间晚超过12小时，是否为跨夜班次？\n确定：按跨天计算\n取消：按当天计算')) isOvernight = false;
    else isOvernight = true;
  }
  saveShift(today(), shift.start, time, shift.note, isOvernight);
  refreshDashboard();
  showToast('下班 ' + time);
  setTimeout(showDaySummary, 400);
  setTimeout(() => onClockOut(), 600);
}

function onClockIn() {
  triggerAIMate('clock_in',
    () => records,
    (recs, days) => workerAnalyze(recs, days)
  );
}
function onClockOut() {
  triggerAIMate('clock_out',
    () => records,
    (recs, days) => workerAnalyze(recs, days)
  );
}

function undoWorkTime() {
  if (!workTimeUndo) return;
  clearTimeout(workTimeUndo.timerId);
  settings.workShifts = settings.workShifts.filter(s => s.date !== today());
  if (workTimeUndo.prev) settings.workShifts.push(workTimeUndo.prev);
  saveSettingsLocal(settings);
  workTimeUndo = null;
  refreshDashboard();
  showToast('已撤销');
}

function editWorkTime() {
  const shift = getTodayShift() || {};
  document.getElementById('editWorkStart').value = shift.start || '';
  document.getElementById('editWorkEnd').value = shift.end || '';
  document.getElementById('editWorkNote').value = shift.note || '';
  document.getElementById('worktimeModal').style.display = 'flex';
}

function saveWorkTime() {
  const startVal = document.getElementById('editWorkStart').value;
  const endVal = document.getElementById('editWorkEnd').value;
  const note = document.getElementById('editWorkNote').value.trim();
  if (!startVal) { showToast('上班时间不能为空'); return; }
  let isOvernight = false;
  if (startVal && endVal) {
    const [sh, sm] = startVal.split(':').map(Number);
    const [eh, em] = endVal.split(':').map(Number);
    let diff = (eh - sh) + (em - sm) / 60;
    if (diff < 0) { diff += 24; isOvernight = true; }
    if (diff > 12) {
      if (!confirm('时间差超过12小时，是否为跨夜班次？')) isOvernight = false;
      else isOvernight = true;
    }
  }
  saveShift(today(), startVal, endVal, note, isOvernight);
  closeWorktimeModal();
  refreshDashboard();
  showToast('时间已更新');
}

function closeWorktimeModal() { document.getElementById('worktimeModal').style.display = 'none'; }

function showDaySummary() {
  const t = today();
  const todayRecords = records.filter(r => r.date === t);
  const inc = todayRecords.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const exp = todayRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  const net = inc - exp;
  const shift = getTodayShift();
  const hours = shift ? getShiftHours(shift) : 0;
  document.getElementById('dsNet').textContent = formatCurrency(net);
  document.getElementById('dsHours').textContent = hours > 0 ? hours.toFixed(1) + ' 小时' : '--';
  document.getElementById('dsRate').textContent = hours > 0 && inc > 0 ? '¥' + (inc / hours).toFixed(1) : '--';
  document.getElementById('daySummaryModal').style.display = 'flex';
}

function closeDaySummaryModal() { document.getElementById('daySummaryModal').style.display = 'none'; }

// ============ Profile ============
function renderProfile() {
  document.getElementById('goalInput').value = settings.monthlyGoal;
  document.getElementById('costGoalInput').value = settings.monthlyCostGoal;
  updateDarkToggle();
  renderCustomCategories();
}

function updateDarkToggle() {
  const sw = document.getElementById('darkToggle');
  sw.className = 'dark-toggle-switch' + (settings.darkMode ? ' on' : '');
  document.body.classList.toggle('dark', !!settings.darkMode);
  document.querySelector('meta[name="theme-color"]').content = settings.darkMode ? '#0f0f0f' : '#1c1917';

  // 暴力强制：深色模式下 header 背景直接用 JS 设
  const h = document.getElementById('header');
  if (settings.darkMode) {
    h.style.background = 'linear-gradient(180deg, rgba(17,24,39,0.98) 0%, rgba(17,24,39,0.90) 70%, transparent 100%)';
    h.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
  } else {
    h.style.background = '';
    h.style.borderBottom = '';
  }
}

function toggleDarkMode() {
  settings.darkMode = !settings.darkMode;
  saveSettingsLocal(settings);
  updateDarkToggle();
  if (currentTab === 'stats') renderStatsView();
}

function updateIncomeGoal() {
  const val = parseInt(document.getElementById('goalInput').value);
  settings.monthlyGoal = Number.isNaN(val) ? 0 : Math.max(0, val);
  saveSettingsLocal(settings);
  showToast('收入目标已更新');
  refreshDashboard();
}

function updateCostGoal() {
  const val = parseInt(document.getElementById('costGoalInput').value);
  settings.monthlyCostGoal = Number.isNaN(val) ? 0 : Math.max(0, val);
  saveSettingsLocal(settings);
  showToast('成本控制目标已更新');
  refreshDashboard();
}

function renderCustomCategories() {
  const container = document.getElementById('customCatList');
  const list = settings.customCategories || [];
  if (list.length === 0) {
    container.innerHTML = '<div class="cc-list" style="margin-bottom:4px"><span style="font-size:12px;color:var(--text-tertiary)">暂无自定义分类</span></div>';
    return;
  }
  const income = list.filter(c => c.type === 'income');
  const expense = list.filter(c => c.type === 'expense');
  let html = '';
  if (income.length) html += '<div style="font-size:11px;color:var(--text-tertiary);font-weight:600;margin-bottom:4px">收入</div><div class="cc-list">' + income.map(c => `<span class="cc-tag"><span class="cc-tag-icon">${escapeHtml(c.icon)}</span>${escapeHtml(c.name)}<button class="cc-tag-close" onclick="deleteCustomCategory('${c.id}')">✕</button></span>`).join('') + '</div>';
  if (expense.length) html += '<div style="font-size:11px;color:var(--text-tertiary);font-weight:600;margin:8px 0 4px">支出</div><div class="cc-list">' + expense.map(c => `<span class="cc-tag"><span class="cc-tag-icon">${escapeHtml(c.icon)}</span>${escapeHtml(c.name)}<button class="cc-tag-close" onclick="deleteCustomCategory('${c.id}')">✕</button></span>`).join('') + '</div>';
  container.innerHTML = html;
}

function pickCustomEmoji(emoji) {
  selectedCustomEmoji = emoji;
  document.querySelectorAll('.cat-emoji-btn').forEach(b => b.classList.toggle('active', b.dataset.emoji === emoji));
}

function addCustomCategory() {
  const type = document.getElementById('customCatType').value;
  const name = document.getElementById('customCatName').value.trim();
  if (!name) { showToast('请输入分类名称'); return; }
  const id = 'cc_' + Date.now().toString(36);
  const cat = { id, type, name, icon: selectedCustomEmoji };
  settings.customCategories.push(cat);
  saveSettingsLocal(settings);
  document.getElementById('customCatName').value = '';
  selectedCustomEmoji = '🏷';
  document.querySelectorAll('.cat-emoji-btn').forEach(b => b.classList.toggle('active', b.dataset.emoji === '🏷'));
  renderCustomCategories();
  renderCategoriesGrid();   // ← 同步刷新记账页的分类网格
  showToast('已添加「' + name + '」');
}

function deleteCustomCategory(id) {
  settings.customCategories = settings.customCategories.filter(c => c.id !== id);
  saveSettingsLocal(settings);
  renderCustomCategories();
  showToast('已删除');
}

function confirmClear() { document.getElementById('clearModal').style.display = 'flex'; }
function closeClearModal() { document.getElementById('clearModal').style.display = 'none'; }
function executeClear() {
  records = [];
  settings = { ...defaultSettings, appVersion: APP_VERSION };
  saveData(records);
  saveSettingsLocal(settings);
  if (IDB._db) IDB.clearRecords().catch(function() {});
  closeClearModal();
  showToast('所有数据已清除');
  switchTab('dashboard');
}

// ============ Stats ============
function setStatsPeriod(period) {
  statsPeriod = period;
  document.querySelectorAll('.stats-period-tab').forEach(t => t.classList.toggle('active', t.dataset.period === period));
  renderStatsView();
}

function setChartTab(tab) {
  statsChartTab = tab;
  document.querySelectorAll('.chart-tab').forEach(t => t.classList.toggle('active', t.dataset.chart === tab));
  renderChart();
}

function renderStatsView() {
  const { start, end } = getPeriodRange(statsPeriod);
  const prev = getPrevPeriodRange(statsPeriod);
  const periodRecords = records.filter(r => r.date >= start && r.date <= end);
  const prevRecords = records.filter(r => r.date >= prev.start && r.date <= prev.end);
  const income = periodRecords.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const expense = periodRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  const net = income - expense;
  const orders = periodRecords.filter(r => r.type === 'income').reduce((s, r) => s + (r.orderCount || 1), 0);
  const activeDays = new Set(periodRecords.map(r => r.date)).size;
  const totalDays = statsPeriod === 'week' ? 7
    : statsPeriod === 'month' ? new Date(new Date(end).getFullYear(), new Date(end).getMonth() + 1, 0).getDate()
    : 30;

  // Net hourly rate = net income / total logged hours (for days in this period)
  const periodDays = new Set(periodRecords.map(r => r.date));
  const hoursInPeriod = (settings.workShifts || []).filter(s => periodDays.has(s.date)).reduce((sum, s) => {
    if (!s.start || !s.end) return sum;
    const [sh, sm] = s.start.split(':').map(Number);
    let [eh, em] = s.end.split(':').map(Number);
    let h = (eh - sh) + (em - sm) / 60;
    if (s.isOvernight) h += 24;
    if (h < 0) h += 24;
    return sum + h;
  }, 0);
  const hourlyRate = hoursInPeriod > 0 ? net / hoursInPeriod : 0;

  document.getElementById('kpiRow').innerHTML = `
    <div class="kpi-item kpi-primary"><div class="kpi-icon">📊</div><div class="kpi-label">净收入</div><div class="kpi-value">${formatCompact(net)}</div><div class="kpi-sub">${activeDays}天 · 日均${activeDays > 0 ? '¥' + Math.round(net / activeDays) : '—'}</div></div>
    <div class="kpi-item kpi-primary"><div class="kpi-icon">⏱</div><div class="kpi-label">时薪</div><div class="kpi-value" style="color:var(--gold)">${hourlyRate > 0 ? '¥' + hourlyRate.toFixed(1) : '—'}</div><div class="kpi-sub">${hoursInPeriod > 0 ? hoursInPeriod.toFixed(1) + 'h 工时' : '记账后计算'}</div></div>
    <div class="kpi-item kpi-secondary"><div class="kpi-icon">📅</div><div class="kpi-label">出工天数</div><div class="kpi-value">${activeDays}<span style="font-size:10px;font-weight:500;color:var(--text-tertiary);margin-left:2px">/${totalDays}</span></div><div class="kpi-sub">${activeDays > 0 ? '占周期' + Math.round(activeDays / totalDays * 100) + '%' : '未开始'}</div></div>
    <div class="kpi-item kpi-secondary"><div class="kpi-icon">📦</div><div class="kpi-label">单数</div><div class="kpi-value">${orders}</div><div class="kpi-sub">日均 ${activeDays > 0 ? (orders / activeDays).toFixed(1) : '—'} 单</div></div>`;

  document.getElementById('chartSubtitle').textContent = `${start} — ${end}`;
  renderChart();
  renderHeatmap(periodRecords);
}

function chartBaseOptions() {
  const dm = settings.darkMode;
  return {
    responsive: true, maintainAspectRatio: false, animation: { duration: 600, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: dm ? '#e8e6e3' : '#1c1917',
        titleColor: dm ? '#0f0f0f' : '#fff',
        bodyColor: dm ? '#0f0f0f' : '#fff',
        titleFont: { size: 12, weight: '600' },
        bodyFont: { size: 13, weight: '600' },
        padding: 10, cornerRadius: 8, displayColors: false,
        callbacks: { label: ctx => ' ' + formatCurrency(ctx.raw) }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: dm ? '#6b6560' : '#a8a29e', maxTicksLimit: 7, maxRotation: 0 } },
      y: { grid: { color: dm ? '#262524' : '#f0efed', drawBorder: false }, ticks: { font: { size: 10 }, color: dm ? '#6b6560' : '#a8a29e', callback: v => '¥' + v, maxTicksLimit: 5 }, beginAtZero: true }
    },
    interaction: { intersect: false, mode: 'index' }
  };
}

function renderChart() {
  const { start, end } = getPeriodRange(statsPeriod);
  const periodRecords = records.filter(r => r.date >= start && r.date <= end);
  const ctx = document.getElementById('statsChart').getContext('2d');
  if (statsChartInst) { statsChartInst.destroy(); statsChartInst = null; }

  const now = new Date();
  const dm = settings.darkMode;
  let chartStart, chartEnd;
  if (statsPeriod === 'week') {
    chartStart = getWeekMonday(now);
    chartEnd = new Date(chartStart); chartEnd.setDate(chartStart.getDate() + 6);
  } else if (statsPeriod === 'month') {
    chartStart = new Date(now.getFullYear(), now.getMonth(), 1);
    chartEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else {
    chartEnd = parseLocalDate(end);
    chartStart = new Date(chartEnd); chartStart.setDate(chartEnd.getDate() - 29);
  }
  const days = [];
  const d = new Date(chartStart);
  while (d <= chartEnd) { days.push(formatDate(d)); d.setDate(d.getDate() + 1); }

  const titles = { trend: '收入趋势', platform: '平台收入分布', compare: '每日收支对比', rate: '工时与时薪' };
  const subtitleMap = { trend: '选中周期内每日收入走势', platform: '各平台贡献占比及金额', compare: '每日收入与支出对比', rate: '工时与时薪的双轴关系' };
  const iconMap = {
    trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>',
    platform: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3 a9 9 0 0 1 0 18 a4.5 4.5 0 0 1 0 -9 a4.5 4.5 0 0 0 0 -9 z"/></svg>',
    compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="4" height="10" rx="1"/><rect x="10" y="6" width="4" height="15" rx="1"/><rect x="17" y="14" width="4" height="7" rx="1"/></svg>',
    rate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>'
  };
  const metaDays = `${days.length} 天 · 收入 ${formatCompact(periodRecords.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0))}`;

  document.getElementById('chartTitle').textContent = titles[statsChartTab] || '';
  document.getElementById('chartSubtitle').textContent = `${start} — ${end} · ${subtitleMap[statsChartTab] || ''}`;
  document.getElementById('chartIcon').innerHTML = iconMap[statsChartTab] || iconMap.trend;
  document.getElementById('chartMeta').textContent = metaDays;

  if (statsChartTab === 'trend') {
    const incomeData = days.map(ds => periodRecords.filter(r => r.type === 'income' && r.date === ds).reduce((s, r) => s + r.amount, 0));
    const labels = days.map(ds => (parseLocalDate(ds).getMonth() + 1) + '/' + parseLocalDate(ds).getDate());
    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(5,150,105,0.25)'); gradient.addColorStop(1, 'rgba(5,150,105,0.0)');
    statsChartInst = new Chart(ctx, {
      type: 'line', data: { labels, datasets: [{ data: incomeData, borderColor: '#059669', backgroundColor: gradient, fill: true, tension: 0.4, pointRadius: days.length > 14 ? 0 : 3, pointHoverRadius: 6, pointBackgroundColor: '#059669', pointBorderColor: '#fff', pointBorderWidth: 1.5, borderWidth: 2.5 }] },
      options: chartBaseOptions()
    });
    renderChartLegend([{ color: '#059669', label: '每日收入' }]);
    renderTrendInsights(periodRecords, days, incomeData);
  } else if (statsChartTab === 'platform') {
    const platformData = {};
    const platformRaw = {};
    periodRecords.filter(r => r.type === 'income').forEach(r => {
      const cat = getCategory(settings, 'income', r.category);
      const key = cat.name + (cat.rawId ? '|' + cat.rawId : '');
      platformData[key] = (platformData[key] || 0) + r.amount;
      if (cat.rawId) platformRaw[cat.name] = cat.rawId;
    });
    const entries = Object.entries(platformData).sort((a, b) => b[1] - a[1]);
    const brandColors = { '美团': '#ffc107', '饿了么': '#3b82f6', '闪送': '#10b981', '顺丰同城': '#1c1917', '货拉拉': '#f97316', '滴滴': '#ff6b35', '跑腿': '#8b5cf6', '其他': '#78716c', '未分类': '#dc2626' };
    const colors = entries.map(e => {
      const name = e[0].split('|')[0];
      return brandColors[name] || ['#059669', '#10b981', '#34d399', '#3b82f6', '#8b5cf6', '#d4a574', '#f59e0b', '#78716c'][entries.indexOf(e) % 8];
    });
    const total = entries.reduce((s, e) => s + e[1], 0);
    statsChartInst = new Chart(ctx, {
      type: 'doughnut', data: { labels: entries.map(e => e[0].split('|')[0]), datasets: [{ data: entries.map(e => e[1]), backgroundColor: colors, borderWidth: 3, borderColor: dm ? '#1a1a1a' : '#fff', borderRadius: 4, hoverBorderWidth: 3, hoverOffset: 6 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '64%', plugins: { legend: { display: false }, tooltip: { backgroundColor: dm ? '#e8e6e3' : '#1c1917', titleColor: dm ? '#0f0f0f' : '#fff', bodyColor: dm ? '#0f0f0f' : '#fff', callbacks: { label: ctx => { const idx = ctx.dataIndex; const entry = entries[idx]; const name = entry[0].split('|')[0]; const rawId = platformRaw[name]; const pct = total > 0 ? Math.round(ctx.raw / total * 100) : 0; return ' ' + formatCurrency(ctx.raw) + ' · ' + pct + '%' + (rawId ? '\n   原始 ID: ' + rawId + '\n   💡 这条记录来自已删除的自定义分类' : ''); } } } } }
    });
    renderChartLegend(entries.map(e => ({ color: brandColors[e[0].split('|')[0]] || '#059669', label: e[0].split('|')[0] })));
    renderPlatformInsights(entries, total);
  } else if (statsChartTab === 'compare') {
    const incData = days.map(ds => periodRecords.filter(r => r.type === 'income' && r.date === ds).reduce((s, r) => s + r.amount, 0));
    const expData = days.map(ds => periodRecords.filter(r => r.type === 'expense' && r.date === ds).reduce((s, r) => s + r.amount, 0));
    const labels = days.map(ds => (parseLocalDate(ds).getMonth() + 1) + '/' + parseLocalDate(ds).getDate());
    statsChartInst = new Chart(ctx, {
      type: 'bar', data: { labels, datasets: [
        { label: '收入', data: incData, backgroundColor: '#059669', borderRadius: 6, barPercentage: 0.85, categoryPercentage: 0.42 },
        { label: '支出', data: expData, backgroundColor: '#f87171', borderRadius: 6, barPercentage: 0.85, categoryPercentage: 0.42 }
      ]},
      options: { ...chartBaseOptions(), plugins: { ...chartBaseOptions().plugins, tooltip: { ...chartBaseOptions().plugins.tooltip, callbacks: { label: ctx => ' ' + ctx.dataset.label + '：' + formatCurrency(ctx.raw) } } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 9 }, color: dm ? '#6b6560' : '#a8a29e', maxTicksLimit: 7 } }, y: { grid: { color: dm ? '#262524' : '#f0efed' }, ticks: { font: { size: 10 }, color: dm ? '#6b6560' : '#a8a29e', callback: v => '¥' + v, maxTicksLimit: 5 }, beginAtZero: true } } }
    });
    renderChartLegend([{ color: '#059669', label: '收入' }, { color: '#f87171', label: '支出' }]);
    renderCompareInsights(periodRecords, days, incData, expData);
  } else {
    const labels = days.map(ds => (parseLocalDate(ds).getMonth() + 1) + '/' + parseLocalDate(ds).getDate());
    const hoursData = days.map(ds => getShiftHours(getShiftForDate(ds)));
    const rateData = days.map(ds => {
      const inc = periodRecords.filter(r => r.type === 'income' && r.date === ds).reduce((s, r) => s + r.amount, 0);
      const exp = periodRecords.filter(r => r.type === 'expense' && r.date === ds).reduce((s, r) => s + r.amount, 0);
      const net = inc - exp;
      const h = getShiftHours(getShiftForDate(ds));
      return h > 0 ? net / h : 0;
    });
    const hasAnyData = hoursData.some(h => h > 0);
    if (hasAnyData) {
      statsChartInst = new Chart(ctx, {
        type: 'bar', data: { labels, datasets: [
          { type: 'bar', label: '工时(h)', data: hoursData, backgroundColor: 'rgba(59,130,246,0.55)', borderRadius: 5, yAxisID: 'y', barPercentage: 0.55, categoryPercentage: 0.7 },
          { type: 'line', label: '时薪', data: rateData, borderColor: '#D97706', backgroundColor: 'transparent', borderWidth: 2.5, tension: 0.4, yAxisID: 'y1', pointBackgroundColor: '#fff', pointBorderColor: '#D97706', pointBorderWidth: 2.5, pointRadius: 5, pointHoverRadius: 7 }
        ]},
        options: {
          ...chartBaseOptions(),
          scales: {
            x: { grid: { display: false }, ticks: { color: dm ? '#6b6560' : '#a8a29e', maxTicksLimit: 7 } },
            y: { type: 'linear', display: true, position: 'left', beginAtZero: true, grid: { color: dm ? '#262524' : '#f0efed' }, ticks: { color: dm ? '#6b6560' : '#a8a29e', callback: v => v + 'h' } },
            y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, ticks: { color: dm ? '#c49464' : '#b08968', callback: v => v >= 10 ? '¥' + Math.round(v) : '¥' + v.toFixed(1), maxTicksLimit: 5 } }
          }
        }
      });
    } else {
      renderEmptyRateChart(ctx, dm, labels);
    }
    renderChartLegend([{ color: 'rgba(59,130,246,0.55)', label: '工时(h)' }, { color: '#D97706', label: '时薪' }]);
    renderRateInsights(periodRecords, days, hoursData, rateData);
  }
}

function renderEmptyRateChart(ctx, dm, labels) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  ctx.beginPath(); ctx.arc(w / 2, h / 2 - 20, 70, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = dm ? '#9c958d' : '#78716c';
  ctx.font = '600 36px -apple-system, "PingFang SC", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('⏱', w / 2, h / 2 - 20);
  ctx.font = '600 14px -apple-system, "PingFang SC", sans-serif';
  ctx.fillStyle = dm ? '#e8e6e3' : '#1c1917';
  ctx.fillText('暂无工时数据', w / 2, h / 2 + 60);
  ctx.font = '400 12px -apple-system, "PingFang SC", sans-serif';
  ctx.fillStyle = dm ? '#6b6560' : '#a8a29e';
  ctx.fillText('去「首页」点击【上班】按钮开始记录', w / 2, h / 2 + 82);
}

function renderChartLegend(items) {
  document.getElementById('chartLegend').innerHTML = items.map(i => `<div class="chart-legend-item"><span class="legend-swatch" style="background:linear-gradient(135deg, ${i.color}cc, ${i.color})"></span>${escapeHtml(i.label)}</div>`).join('');
}

function renderTrendInsights(periodRecords, days, incomeData) {
  const total = incomeData.reduce((s, n) => s + n, 0);
  const activeDays = incomeData.filter(v => v > 0).length;
  const max = Math.max(0, ...incomeData);
  const maxIdx = incomeData.indexOf(max);
  const avg = activeDays > 0 ? total / activeDays : 0;
  const container = document.getElementById('chartInsights');
  if (total === 0) { container.innerHTML = '<div class="chart-insight" style="grid-column:1/-1;justify-content:center;color:var(--text-tertiary)">📊 本周期还没有收入记录</div>'; return; }
  container.innerHTML = `
    <div class="chart-insight"><div class="ci-icon">💰</div><div class="ci-text"><div class="ci-label">总收入</div><div class="ci-value">${formatCompact(total)}</div></div></div>
    <div class="chart-insight"><div class="ci-icon">📅</div><div class="ci-text"><div class="ci-label">有效天数</div><div class="ci-value">${activeDays} / ${days.length} 天</div></div></div>
    <div class="chart-insight"><div class="ci-icon">📈</div><div class="ci-text"><div class="ci-label">日均收入</div><div class="ci-value">${formatCompact(avg)}</div></div></div>
    <div class="chart-insight"><div class="ci-icon">🏆</div><div class="ci-text"><div class="ci-label">最高单日</div><div class="ci-value">${max > 0 ? formatCompact(max) : '—'}${max > 0 ? ' <span style="font-size:10px;color:var(--text-tertiary);font-weight:500">(' + days[maxIdx] + ')</span>' : ''}</div></div></div>`;
}

function renderPlatformInsights(entries, total) {
  const container = document.getElementById('chartInsights');
  if (entries.length === 0) { container.innerHTML = '<div class="chart-insight" style="grid-column:1/-1;justify-content:center;color:var(--text-tertiary)">📊 还没有收入数据</div>'; return; }
  const brandColors = { '美团': '#ffc107', '饿了么': '#3b82f6', '闪送': '#10b981', '顺丰同城': '#1c1917', '货拉拉': '#f97316', '滴滴': '#ff6b35', '跑腿': '#8b5cf6', '其他': '#78716c' };
  const top = entries[0];
  const topPct = total > 0 ? Math.round(top[1] / total * 100) : 0;
  const topIcon = defaultIncomeCategories.find(c => c.name === top[0])?.icon || '💰';
  const topColor = brandColors[top[0]] || '#059669';
  const legendItems = entries.map(e => {
    const pct = total > 0 ? Math.round(e[1] / total * 100) : 0;
    const icon = defaultIncomeCategories.find(c => c.name === e[0])?.icon || '💰';
    const color = brandColors[e[0]] || '#059669';
    return `<div class="platform-row"><div class="pr-left"><span class="pr-dot" style="background:${color}"></span><span class="pr-icon">${icon}</span><span class="pr-name">${escapeHtml(e[0])}</span></div><div class="pr-right"><span class="pr-amt">¥${Math.round(e[1]).toLocaleString('zh-CN')}</span><span class="pr-pct">${pct}%</span></div></div>`;
  }).join('');
  container.innerHTML = `
    <div class="platform-summary"><div class="ps-hero" style="background:linear-gradient(135deg, ${topColor}22, ${topColor}08);border:1.5px solid ${topColor}55"><div class="ps-icon">${topIcon}</div><div class="ps-info"><div class="ps-label">主力平台</div><div class="ps-name">${escapeHtml(top[0])}</div></div><div class="ps-share">${topPct}%</div></div><div class="ps-stats"><div class="ps-stat"><div class="ps-stat-val">${entries.length}</div><div class="ps-stat-lbl">平台数</div></div><div class="ps-stat"><div class="ps-stat-val">${formatCompact(total)}</div><div class="ps-stat-lbl">合计收入</div></div></div></div>
    <div class="platform-legend">${legendItems}</div>`;
}

function renderCompareInsights(periodRecords, days, incData, expData) {
  const totalInc = incData.reduce((s, n) => s + n, 0);
  const totalExp = expData.reduce((s, n) => s + n, 0);
  const net = totalInc - totalExp;
  const activeDays = incData.filter(v => v > 0).length;
  const container = document.getElementById('chartInsights');
  if (totalInc === 0 && totalExp === 0) { container.innerHTML = '<div class="chart-insight" style="grid-column:1/-1;justify-content:center;color:var(--text-tertiary)">📊 本周期还没有收支记录</div>'; return; }
  const ratio = totalInc > 0 ? Math.round(net / totalInc * 100) : 0;
  container.innerHTML = `
    <div class="chart-insight"><div class="ci-icon">💚</div><div class="ci-text"><div class="ci-label">总支出</div><div class="ci-value">${formatCompact(totalExp)}</div></div></div>
    <div class="chart-insight"><div class="ci-icon">💜</div><div class="ci-text"><div class="ci-label">净结余</div><div class="ci-value" style="color:${net >= 0 ? 'var(--income)' : 'var(--expense)'}">${net >= 0 ? '+' : ''}${formatCompact(net)}</div></div></div>
    <div class="chart-insight"><div class="ci-icon">📐</div><div class="ci-text"><div class="ci-label">收支比</div><div class="ci-value">${ratio}%</div></div></div>
    <div class="chart-insight"><div class="ci-icon">📆</div><div class="ci-text"><div class="ci-label">有收入天数</div><div class="ci-value">${activeDays} / ${days.length} 天</div></div></div>`;
}

function renderRateInsights(periodRecords, days, hoursData, rateData) {
  const totalHours = hoursData.reduce((s, h) => s + h, 0);
  const totalIncome = periodRecords.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const totalExpense = periodRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  const totalNet = totalIncome - totalExpense;
  const validRate = rateData.filter(r => r > 0);
  const overallRate = totalHours > 0 ? totalNet / totalHours : 0;
  const maxRate = Math.max(0, ...rateData);
  const container = document.getElementById('chartInsights');
  if (totalHours === 0) { container.innerHTML = '<div class="chart-insight" style="grid-column:1/-1;justify-content:center;color:var(--text-tertiary)">⏱ 还没有工时记录，去首页打卡试试</div>'; return; }
  container.innerHTML = `
    <div class="chart-insight"><div class="ci-icon">⏱</div><div class="ci-text"><div class="ci-label">总工时</div><div class="ci-value">${totalHours.toFixed(1)} h</div></div></div>
    <div class="chart-insight"><div class="ci-icon">💰</div><div class="ci-text"><div class="ci-label">净时薪</div><div class="ci-value">${overallRate > 0 ? '¥' + overallRate.toFixed(1) : '—'}</div></div></div>
    <div class="chart-insight"><div class="ci-icon">📊</div><div class="ci-text"><div class="ci-label">日均时薪</div><div class="ci-value">${validRate.length > 0 ? '¥' + (validRate.reduce((s,r) => s + r, 0) / validRate.length).toFixed(1) : '—'}</div></div></div>
    <div class="chart-insight"><div class="ci-icon">🚀</div><div class="ci-text"><div class="ci-label">最高时薪</div><div class="ci-value">${maxRate > 0 ? '¥' + maxRate.toFixed(1) : '—'}</div></div></div>`;
}

function renderHeatmap(periodRecords) {
  const buckets = [
    { key: 'morning', label: '早 5-11', range: [5, 11] },
    { key: 'midday', label: '午 11-14', range: [11, 14] },
    { key: 'evening', label: '晚 14-20', range: [14, 20] },
    { key: 'night', label: '夜 20-23', range: [20, 24] }
  ];
  const matrix = {};
  buckets.forEach(b => matrix[b.key] = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
  periodRecords.filter(r => r.type === 'income' && r.time).forEach(r => {
    const h = parseInt(r.time.split(':')[0]);
    const wd = parseLocalDate(r.date).getDay();
    for (const b of buckets) {
      if (h >= b.range[0] && h < b.range[1]) { matrix[b.key][wd] += r.amount; break; }
    }
  });
  const maxVal = Math.max(1, ...Object.values(matrix).flatMap(o => Object.values(o)));
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  let html = '<table class="heatmap-table"><tr><th></th>' + days.map(d => '<th>周' + d + '</th>').join('') + '</tr>';
  for (const b of buckets) {
    html += `<tr><th>${b.label}</th>`;
    for (let wd = 0; wd < 7; wd++) {
      const v = matrix[b.key][wd];
      const alpha = v / maxVal;
      const color = `rgba(5,150,105,${0.05 + alpha * 0.6})`;
      html += `<td style="background:${color};color:${alpha > 0.5 ? '#fff' : 'var(--text-primary)'}" title="周${days[wd]} ${b.label}: ¥${Math.round(v)}">${v > 0 ? Math.round(v) : '·'}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';
  document.getElementById('heatmapContainer').innerHTML = html;
}

// ============ Export/Import ============
function exportData() {
  if (records.length === 0) { showToast('没有数据可导出'); return; }
  const header = '\uFEFF日期,时间,类型,金额,类别ID,类别名称,单数,里程km,备注';
  const rows = records.map(r => {
    const cat = getCategory(settings, r.type, r.category);
    const note = (r.note || '').replace(/"/g, '""');
    return `${r.date},${r.time || ''},"${r.type === 'income' ? '收入' : '支出'}",${r.amount},"${r.category}","${cat.name}",${r.orderCount || ''},${r.km || ''},"${note}"`;
  });
  const settingsBackup = JSON.stringify({ monthlyGoal: settings.monthlyGoal, costGoal: settings.costGoal, workShifts: settings.workShifts, customCategories: settings.customCategories, appVersion: settings.appVersion });
  const csv = header + '\n' + rows.join('\n') + '\n#SETTINGS:' + settingsBackup;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `跑单记_${today()}.csv`; a.click(); URL.revokeObjectURL(url);
  showToast('已导出 CSV（含设置备份）');
}

function importData() { document.getElementById('importFile').click(); }

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    let text = e.target.result;
    const looksGbk = /[\ufffd\u80fd\u4e0d]/.test(text) && !/^\uFEFF/.test(text);
    if (looksGbk) showToast('文件疑似 GBK 编码，将尝试继续导入');
    const lines = text.replace(/^\uFEFF/, '').split('\n').filter(l => l.trim() && !l.trim().startsWith('#SETTINGS:'));
    const settingsLine = text.split('\n').find(l => l.trim().startsWith('#SETTINGS:'));
    if (settingsLine) {
      try {
        const saved = JSON.parse(settingsLine.trim().slice(10));
        if (saved.monthlyGoal != null) settings.monthlyGoal = saved.monthlyGoal;
        if (saved.costGoal != null) settings.costGoal = saved.costGoal;
        if (saved.workShifts) settings.workShifts = saved.workShifts;
        if (saved.customCategories) settings.customCategories = saved.customCategories;
      } catch(e) { /* settings parse failed, skip */ }
    }
    if (lines.length < 2) { showToast('文件格式错误'); return; }
    const headerCols = parseCSVLine(lines[0]);
    const dateIdx = headerCols.findIndex(c => c.includes('日期'));
    const timeIdx = headerCols.findIndex(c => c.includes('时间'));
    const typeIdx = headerCols.findIndex(c => c.includes('类型'));
    const amountIdx = headerCols.findIndex(c => c.includes('金额'));
    const catNameIdx = headerCols.findIndex(c => c.includes('类别名称'));
    const catIdIdx = headerCols.findIndex(c => c.includes('类别ID'));
    const orderIdx = headerCols.findIndex(c => c.includes('单数'));
    const kmIdx = headerCols.findIndex(c => c.includes('里程'));
    const noteIdx = headerCols.findIndex(c => c.includes('备注'));
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    let imported = 0, skipped = 0;
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      const date = (cols[Math.max(0, dateIdx)] || '').trim();
      if (!dateRe.test(date)) { skipped++; continue; }
      const typeStr = (cols[typeIdx] || '').trim();
      const type = typeStr.includes('收入') ? 'income' : typeStr.includes('支出') ? 'expense' : null;
      if (!type) { skipped++; continue; }
      const amount = parseFloat(cols[amountIdx]) || 0;
      if (amount <= 0) { skipped++; continue; }
      let category = '';
      if (catIdIdx >= 0) category = (cols[catIdIdx] || '').trim();
      if (!category && catNameIdx >= 0) {
        const name = (cols[catNameIdx] || '').trim();
        const cat = getCategories(settings, type).find(c => c.name === name);
        category = cat ? cat.id : (type === 'income' ? 'other' : 'other_exp');
      }
      if (!category) category = type === 'income' ? 'other' : 'other_exp';
      const time = (cols[timeIdx] || '').trim() || '00:00';
      const note = (cols[noteIdx] || '').trim();
      const orderCount = orderIdx >= 0 ? (parseInt(cols[orderIdx]) || null) : null;
      const km = kmIdx >= 0 ? (parseFloat(cols[kmIdx]) || null) : null;
      const dup = records.find(ex => ex.date === date && ex.time === time && ex.amount === amount && ex.category === category && ex.note === note);
      if (dup) { skipped++; continue; }
      records.push({ id: generateId(), type, amount, category, note, date, time, orderCount, km, createdAt: Date.now() + imported });
      imported++;
    }
    saveData(records);
    showToast(`导入 ${imported} 条，跳过 ${skipped} 条`);
    refreshCurrentView();
  };
  reader.readAsText(file);
  event.target.value = '';
}

function parseCSVLine(line) {
  const result = []; let current = ''; let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') { if (i + 1 < line.length && line[i + 1] === '"') { current += '"'; i++; } else inQuotes = false; }
      else current += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { result.push(current.trim()); current = ''; }
      else current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

// ============ Service Worker ============
function checkShareHash() {
  const match = location.search.match(/[?&]share=([^&]+)/);
  if (!match) return false;
  try {
    const json = decodeURIComponent(escape(atob(decodeURIComponent(match[1]))));
    const d = JSON.parse(json);
    const el = document.getElementById('sharedCardOverlay');
    if (!el) return false;
    el.querySelector('.shared-period').textContent = d.t || '';
    el.querySelector('.shared-hero').textContent = d.h || '';
    const subEl = el.querySelector('.shared-sub');
    subEl.textContent = d.s || '';
    subEl.style.color = (d.s || '').includes('亏损') ? '#dc2626' : '#059669';
    if (d.st) {
      el.querySelector('.shared-stats').innerHTML = d.st.map(s =>
        '<div class="s-stat"><div class="s-stat-val">' + escapeHtml(s.v) + '</div><div class="s-stat-lbl">' + escapeHtml(s.l) + '</div></div>'
      ).join('');
    }
    el.style.display = 'flex';
    return true;
  } catch(e) { return false; }
}

function checkSWUpdate() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready.then(reg => {
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showToastWithAction('发现新版本，点击刷新', '刷新', () => { newWorker.postMessage({ action: 'skipWaiting' }); location.reload(); });
        }
      });
    });
  });
}

// ============ Init ============
async function init() {
  try {
    await initIDB();
    const idbRecords = await IDB.getAll();
    if (idbRecords && idbRecords.length > 0) records = idbRecords;
  } catch(e) { /* IDB init skipped, using localStorage only */ }

  await syncToIDB(records);

  exposeGlobals();
  updateDarkToggle();
  updateHeaderDate();
  resetRecordForm();
  refreshDashboard();
  setTimeout(generateBriefing, 500);
  checkSWUpdate();

  document.getElementById('amountInput').addEventListener('keydown', e => { if (e.key === 'Enter') saveRecord(); });
  document.getElementById('historyType').addEventListener('change', () => { renderHistoryCategoryFilter(); renderHistoryContent(); });
  document.getElementById('historyCategory').addEventListener('change', renderHistoryContent);
  document.getElementById('historyMonth').addEventListener('change', renderHistoryContent);
  document.getElementById('historyKeyword').addEventListener('input', renderHistoryContent);
  document.getElementById('customCatName').addEventListener('keydown', e => { if (e.key === 'Enter') addCustomCategory(); });

  setTimeout(() => checkShareHash(), 600);
  if (location.search.includes('demo=true') && records.length === 0) injectDemoData();
}

function injectDemoData() {
  records = [];
  // Generate 30 days of realistic 昆明/成都 骑手 data (late July - Aug 2026)
  const base = new Date(2026, 6, 28);
  for (let d = 0; d < 30; d++) {
    const date = new Date(base); date.setDate(base.getDate() - 29 + d);
    const ds = formatDate(date), isWE = [0, 6].includes(date.getDay());
    // Main platform: 美团 — ¥160-280 weekday, ¥220-350 weekend
    const mtInc = Math.round((isWE ? 200 : 150) + Math.random() * 120);
    records.push({ id: generateId(), type: 'income', amount: mtInc, category: 'meituan', note: '',
      date: ds, time: '09:' + pad(Math.floor(Math.random() * 60)),
      orderCount: Math.round(mtInc / 7.5), km: null, createdAt: Date.now() });
    // Secondary: 饿了么 — ~50% of days
    if (Math.random() > 0.5) {
      const elInc = Math.round(40 + Math.random() * 70);
      records.push({ id: generateId(), type: 'income', amount: elInc, category: 'eleme', note: '',
        date: ds, time: '14:' + pad(Math.floor(Math.random() * 60)),
        orderCount: Math.round(elInc / 6), km: null, createdAt: Date.now() });
    }
    // 闪送 — ~30% of days
    if (Math.random() > 0.7) {
      const ssInc = Math.round(25 + Math.random() * 50);
      records.push({ id: generateId(), type: 'income', amount: ssInc, category: 'shansong', note: '',
        date: ds, time: '16:' + pad(Math.floor(Math.random() * 60)),
        orderCount: 1, km: null, createdAt: Date.now() });
    }
    // Expenses
    records.push({ id: generateId(), type: 'expense', amount: Math.round((8 + Math.random() * 5) * 10) / 10, category: 'energy', note: '换电', date: ds, time: '08:00', orderCount: null, km: null, createdAt: Date.now() });
    records.push({ id: generateId(), type: 'expense', amount: Math.round((12 + Math.random() * 10) * 10) / 10, category: 'food', note: '午饭', date: ds, time: '12:20', orderCount: null, km: null, createdAt: Date.now() });
    if (Math.random() > 0.6) {
      records.push({ id: generateId(), type: 'expense', amount: Math.round((15 + Math.random() * 10) * 10) / 10, category: 'food', note: '晚饭', date: ds, time: '18:00', orderCount: null, km: null, createdAt: Date.now() });
    }
    if (Math.random() > 0.85) {
      records.push({ id: generateId(), type: 'expense', amount: Math.round((30 + Math.random() * 50) * 10) / 10, category: 'maintenance', note: '修车/配件', date: ds, time: '13:00', orderCount: null, km: null, createdAt: Date.now() });
    }
  }
  // Add work shifts for the last 10 days
  for (let d = 0; d < 10; d++) {
    const date = new Date(base);
    date.setDate(base.getDate() - 5 + d);
    settings.workShifts = settings.workShifts || [];
    const startH = 8 + Math.floor(Math.random() * 2); // 8-9 AM
    const endH = 14 + Math.floor(Math.random() * 3); // 14-16 PM
    settings.workShifts.push({
      date: formatDate(date),
      start: pad(startH) + ':00',
      end: pad(endH) + ':00',
      note: '',
      isOvernight: false
    });
  }
  settings.monthlyGoal = 8000;
  settings.monthlyCostGoal = 1500;
  saveData(records);
  saveSettingsLocal(settings);
  location.search = '';
  location.reload();
}

// ============ Scroll & Visibility ============
let fabLastScrollY = 0;
window.addEventListener('scroll', () => {
  const fab = document.querySelector('.fab');
  if (!fab || fab.classList.contains('fab-hidden')) return;
  const cy = window.scrollY;
  if (cy > fabLastScrollY + 8 && cy > 200) fab.classList.add('fab-hidden');
  else if (cy < fabLastScrollY - 8) fab.classList.remove('fab-hidden');
  fabLastScrollY = cy;
}, { passive: true });

window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 10) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

setInterval(() => {
  const d = today();
  if (d !== lastDate) { lastDate = d; refreshDashboard(); updateHeaderDate(); }
  else if (currentTab === 'dashboard') refreshDashboard();
}, 60000);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    const d = today();
    if (d !== lastDate) { lastDate = d; refreshDashboard(); updateHeaderDate(); }
    else if (currentTab === 'dashboard') refreshDashboard();
  }
});

// Boot
init();

})();
