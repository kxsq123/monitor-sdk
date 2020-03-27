/**
 * Created by daizengyu on 2019-05-08.
 */
import { MonitorData } from './entry/index.js';
import ajax from './utils/ajax.js';

// 强制上报(除了资源加载，性能日志)
function forceSendPvData() {
  const { baseData, pageViewQueue } = MonitorData;
  const { baseUrl, id } = MonitorData.customOptions;
  const url = `${baseUrl}/${id}/add/pv`;

  if (pageViewQueue.length) {
    ajax({
      method: 'post',
      baseUrl: url,
      contentType: 'application/json',
      data: JSON.stringify({ baseData, pageViewQueue })
    }).then(_ => {
      MonitorData.clearPv();
    }).catch(err => {
      console.error(err);

      // 心跳检测
      MonitorData.pvTimer.failedNum++;
      if (MonitorData.pvTimer.failedNum >= 3) {
        clearInterval(MonitorData.pvTimer.id)
        console.info('PV心跳检测失败，已断开链接');
      }
    });
  }
}

// 强制上报 (除了资源加载，性能日志)
function forceSendMonitorData() {
  const STORAGE_KEY = '_BOSS_monitor';
  const getStorage = _ => JSON.parse(localStorage.getItem(STORAGE_KEY));
  const storages = getStorage();
  const data = MonitorData.getReportData('errorQueue');

  if (storages) {
    data.errorQueue = [...data.errorQueue, ...storages.errorQueue];
  }

  const { baseUrl, id } = MonitorData.customOptions;
  const url = `${baseUrl}/${id}/add`;

  if (MonitorData.errorQueue.length) {
    ajax({
      method: 'post',
      baseUrl: url,
      data: JSON.stringify(data)
    }).then(_ => {
      localStorage.removeItem(STORAGE_KEY);
    }).catch(_ => {

      // 心跳检测
      MonitorData.errorTimer.failedNum++;
      if (MonitorData.errorTimer.failedNum >= 3) {
        clearInterval(MonitorData.errorTimer.id)
        console.info('心跳检测失败，已断开链接');
      }

      const { errorQueue } = data;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ errorQueue }));
      } catch(se) {
        if (isQuotaExceeded(se)) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }).then(() => {
      MonitorData.clear();
    })
  }
}

function isQuotaExceeded(e) {
  let quotaExceeded = false;
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014:
          // Firefox
          if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            quotaExceeded = true;
          }
          break;
      }
    } else if (e.number === -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true;
    }
  }
  return quotaExceeded;
}

// 上报模块 sendBeacon
function sendMonitorData() {
  const data = MonitorData.getReportData();
  const { baseUrl, id } = MonitorData.customOptions;
  const url = `${baseUrl}/${id}/add`;
  if (MonitorData.hasReportData()) {
    // 默认使用 sendBeacon 上报
    if (navigator.sendBeacon !== void 0) {
      navigator.sendBeacon(url, JSON.stringify(data));
    } else { // 上报模块降级
      // deflateAjax({
      //   method: 'post',
      //   baseUrl: url,
      //   data: JSON.stringify(data)
      // });
      ajax({
        method: 'post',
        baseUrl: url,
        data: JSON.stringify(data)
      });
    }
  }
  return data;
}

export { sendMonitorData, forceSendMonitorData, forceSendPvData };
