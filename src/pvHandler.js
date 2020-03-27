/**
 * Created by daizengyu on 2019-05-08.
 */

import { MonitorData } from './entry/index.js';
import { withAfterHook, debounce } from './utils/utils.js';

const VISIBLE = 'visible';
// const TIME_INTERVAL = 30 * 60 * 60 * 1000;
const isSafari = !!(typeof safari === 'object' && safari.pushNotification);
let debounceSend;

// 初始化 URL PV 收集器
function initUrlTracker() {

  // 此时页面已加载，马上收集一次PV
  sendPageView();

  if (history.pushState && window.addEventListener) {
    pushStateOverride();
    replaceStateOverride();
    window.addEventListener('popstate', handleUrlChange);
  }
}

function createDebounceSend() {
  debounceSend = debounce(sendPageView, MonitorData.customOptions.visibilityPvTime);
}

// 初始化 可视区域 PV 收集器
function initVisibilityTracker() {

  if (!document.visibilityState) return;

  createDebounceSend(); // 创建debounce任务

  window.addEventListener('visibilitychange', handleVisibilityChange, true);

  if (isSafari) {
    /**
     * Safari visibility change 无法保证可靠的触发
     * 这里在会在 main.js 中的 beforeunload 之前触发
     */
    addEventListener('beforeunload', sendPageView, true);
  }
}

function pushStateOverride() {
  history.pushState = withAfterHook(history.pushState, handleUrlChange);
}

function replaceStateOverride() {
  history.replaceState = withAfterHook(history.replaceState, handleUrlChange);
}

function handleUrlChange() {
  let oldPath = '';
  // 这里要异步收集 不能阻塞应用主逻辑
  setTimeout(() => {
    const newPath = getPath();
    if (oldPath !== newPath) {
      oldPath = newPath;
      sendPageView();
    }
  }, 0);
}

function sendPageView(flag) {
  const pageViewData = new MonitorData();
  pageViewData.pushToPageViewQueue(flag);
}

function handleVisibilityChange() {
  if (document.visibilityState === VISIBLE) {
    /**
     * 此处的PV收集不用于用户行为分析
     * 即 pushToPageViewQueue(track = 0)
     */
    debounceSend(0);
  }
}

function getPath() {
  return location.pathname + location.search;
}

export { initUrlTracker, initVisibilityTracker };
