/**
 * Created by daizengyu on 18/12/19.
 */
import { isRegExp } from '../utils/utils.js';
import defaultOpts from '../config/default';

// options 与 真实数据结构间的映射
const filterMap = {
  // api 接口请求错误
  'APIError': {
    response: 'responseText',
    method: 'method',
    code: 'code'
  },

  // 全局脚本错误
  'Script Error': {
    msg: 'stack'
  },

  // vue 错误过滤
  'Vue HandleError': {
    msg: 'stack'
  },

  // 资源加载异常
  'ResourceError': {
    element: 'element'
  }
};

class MonitorData {

  constructor() {
    const { origin, pathname, href } = location;
    this.url = href;
    this.path = origin + pathname;
    this.time = new Date();
    this.user = window.user || '';
  }

  pushToErrorQueue() {
    const item = this;
    // 去重逻辑
    const uniqueMap = {
      'Vue HandleError'(v, item) {
        return v.vmName === item.vmName &&
          v.stack === item.stack &&
          v.url === item.url
      },

      'ResourceError'(v, item) {
        return v.element === item.element &&
          v.source === item.source &&
          v.url === item.url
      },

      'APIError'(v, item) {
        return JSON.stringify(v.desc) === JSON.stringify(item.desc) &&
          v.url === item.url
      },

      'Script Error'(v, item) {
        return v.stack === item.stack &&
          v.url === item.url
      }
    }

    // 过滤错误的类型
    const eType = item.type;
    // 遍历传入的options中的类型 :Array
    const oTypes = MonitorData.errorFilters.filter(v => v.type === eType);
    // 遍历 optionTypes 在推入队列之前先判断是否符合其中一种条件
    // 如果匹配 则过滤掉不推入队列
    const matched = oTypes.some(ov => {
      const refMap = filterMap[ov.type];
      let isMatch = false;
      for (const key in refMap) {
        if (refMap.hasOwnProperty(key)) {
          const eKey = refMap[key];
          // http错误字段在desc字段中，需要特殊处理
          const itemVal = eType === 'APIError' ? item.desc[eKey] : item[eKey];
          // 若没有映射值，说明用户没有传，直接进行下一轮循环
          if (!ov[key]) continue;
          // 若有一项没有匹配上，说明存在没有匹配上的字段，该错误要收集，直接跳出循环
          const regx = isRegExp(ov[key]) ? ov[key] : new RegExp(ov[key]);
          if (!regx.test(itemVal)) {
            isMatch = false;
            break;
          } else {
            isMatch = true;
          };
        }
      }
      return isMatch;
    });

    const flag = MonitorData.errorQueue.some(v => uniqueMap[v.type](v, item));
    if (!flag && !matched) {
      MonitorData.errorQueue.push(item)
    }
  }

  pushToPerformanceQueue() {
    const item = this;
    MonitorData.performanceQueue.push(item)
  }

  pushToResourceQueue() {
    const item = this;
    MonitorData.resourceQueue.push(item)
  }

  pushToPageViewQueue(track = 1) { // track = 1 追踪用户行为
    const item = this;
    MonitorData.pageViewQueue.push({ track, ...item })
  }

  static hasReportData() {
    const keys = ['errorQueue', 'performanceQueue', 'resourceQueue'];
    for (const key of keys) {
      if (MonitorData[key].length !== 0) {
        return true;
      }
    }
    return false;
  }

  static getReportData(key) {
    const res = {};
    const keys = key ? ['baseData', key] : ['baseData', 'errorQueue', 'performanceQueue', 'resourceQueue'];
    for (const key of keys) {
      res[key] = MonitorData[key];
    }
    return res;
  }

  static clear() {
    const keys = ['errorQueue', 'performanceQueue', 'resourceQueue'];
    for (const key of keys) {
      MonitorData[key].length = 0;
    }
  }

  static clearPv() {
    MonitorData.pageViewQueue.length = 0;
  }
}

MonitorData.customOptions = defaultOpts; // 基础配置
MonitorData.baseData = {}; // 基础信息
MonitorData.errorFilters = []; // 过滤项配置
MonitorData.errorQueue = []; // 错误收集队列
MonitorData.performanceQueue = []; // 性能收集队列
MonitorData.resourceQueue = []; // 资源收集队列
MonitorData.pageViewQueue = []; // pv队列

// 上报模块
MonitorData.errorTimer = {
  id: '',
  failedNum: 0
};
MonitorData.pvTimer = {
  id: '',
  failedNum: 0
};

export default MonitorData;
