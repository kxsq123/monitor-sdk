import {
  BaseData, MonitorData, ErrorData,
  VueErrorData, HttpErrorData, ApiErrorData
} from './entry/index.js';
import { initUrlTracker, initVisibilityTracker } from './pvHandler.js';
import { withAfterHook, isError } from './utils/utils.js';
import { sendMonitorData, forceSendMonitorData, forceSendPvData } from './emitter';
import ajax from './utils/ajax.js';
// import deflateAjax from './utils/deflate.js';
import pm from './performance.js';

(function() {

  // let customOptions = defaultOpts;

  // http 资源请求捕获处理
  function installHttpError() {
    window.addEventListener && window.addEventListener('error', function(event) {
      if (!event.message) {
        if (!needReport()) return;
        let target, node = (target = event.target ? event.target : event.srcElement) && target.outerHTML;
        node && node.length > 200 && (node = node.slice(0, 200));
        const errorData = new HttpErrorData(node, target);
        errorData.pushToErrorQueue();
      }
    }, true);
  }

  // window error 报错处理
  function installWindowError() {
    window.onerror = function (msg, url, line, col, error) {
      if (error && error.stack) {
        if (!needReport()) return;
        const { name, message } = error;
        const errorData = new ErrorData('Script Error', '脚本错误', error.stack.toString(), { name, message });
        errorData.pushToErrorQueue();
      }
    };
  }

  // Vue 组件报错处理
  function installVueError() {
    if (!window.Vue) return;
    window.Vue.config.errorHandler  = function(err, vm, info) {
      if (!err || !isError(err)) return;
      if (!needReport()) return;

      try {
        const type = info !== void 0 ? 'Vue HandleError' : 'Async Http';
        const errorData = new VueErrorData(type, err.stack.toString() , err, vm, info);
        errorData.pushToErrorQueue();
      } catch (err) {
        console.warn('errorHandler has error:', err);
      }
    }
  }

  // 捕获接口调用错误
  function installAPIError() {
    // 劫持 xmlHttpRequest

    /**
     * 只读属性 XMLHttpRequest.status 返回了XMLHttpRequest 响应中的数字状态码。
     * status 的值是一个无符号短整型。在请求完成前，status的值为 0。
     * 值得注意的是，如果 XMLHttpRequest 出错，浏览器返回的 status 也为 0。
     */
    let _method = '';
    XMLHttpRequest.prototype.open = withAfterHook(XMLHttpRequest.prototype.open, method => {
      _method = method;
    });

    XMLHttpRequest.prototype.send = withAfterHook(XMLHttpRequest.prototype.send, function (data) {
      this.addEventListener('readystatechange', _ => {
        if (this.readyState === 4 && ![200, 204, 304, 0].includes(this.status) && needReport()) {
          const index = this.responseURL.indexOf(MonitorData.customOptions.baseUrl);
          if (index === -1) { // 过滤掉SDK本身调接口失败产生的错误
            const errorData = new ApiErrorData(`${this.status} ${this.statusText}`,
              this.responseURL, data, this.response, this.responseText, _method);
            errorData.pushToErrorQueue();
          }
        }
      }, false);
    });
  }

  // 上报错误信息发射器
  function installTransmitter(reportTime, reportPvTime) {
    // 默认，页面卸载时上报错误信息
    window.onunload = function () {
      sendMonitorData();
    };

    /**
     * 如果用户一直不关页面，
     * 每一个小时强制发送一次 http 请求上报
     */
    MonitorData.errorTimer.id = setInterval(_ => {
      forceSendMonitorData();
    }, reportTime);

    MonitorData.pvTimer.id = setInterval(_ => {
      forceSendPvData();
    }, reportPvTime);
  }

  // 采样率
  function needReport () {
    // sample: 0 - 1
    return Math.random() <= MonitorData.customOptions.sample;
  }

  // 合并配置
  function mergeOptions(options) {
    return Object.assign(MonitorData.customOptions, options);
  }

  // 初始化基础信息
  function initBaseData(project) {
    const baseData = new BaseData(project);
    MonitorData.baseData = baseData;
  }

  // 获取项目配置
  function getCustomConfig() {
    const { baseUrl, id } = MonitorData.customOptions;
    ajax({
      method: 'get',
      baseUrl: `${baseUrl}/${id}/config`
    })
      .then(resp => {
        if (resp.code === 0 && resp.data) {
          // 只有在获取到配置时才再次进行合并
          mergeOptions(resp.data)
        }
      })
      .catch(err => {
        console.error(err);
        // MonitorData.customOptions.baseUrl = url;
        // MonitorData.customOptions.id = id;
      })
      .then(_ => {
        initHandler();
      });
  }

  // 低优先级任务，页面加载完毕后执行
  function initLowPriorityTask() {
    const {
      vueError, // vue错误收集
      isCollectedPerformance,
      urlTracker,
      visibilityTracker,
      maxTiming, // 资源收集超时最大时间阀值
    } = MonitorData.customOptions;

    vueError && installVueError();
    // 性能分析
    isCollectedPerformance && pm.init(maxTiming);
    // PV收集
    urlTracker && initUrlTracker();
    visibilityTracker && initVisibilityTracker();
  }

  function initHandler() {
    const {
      name, // 项目名
      jsError, // 全局js错误收集
      apiError, // 接口请求错误收集
      httpError, // 资源错误收集
      reportTime, // 上报间隔
      reportPvTime,
      filters // 过滤器
    } = MonitorData.customOptions;

    console.info('%c monitor custom config: ',
      'background-color: #1DAEF8; color: white',
      MonitorData.customOptions);

    initBaseData(name);

    // 错误过滤
    MonitorData.errorFilters = filters;

    jsError && installWindowError();
    httpError && installHttpError();
    apiError && installAPIError();

    installTransmitter(reportTime, reportPvTime);

    /**
     * 此时有两种情况：
     *  1. 页面已加载完毕，不会再触发onload事件了，所以要立即执行初始化任务
     *  2. 页面还没加载完毕，等加载完毕之后再执行初始化任务
     */
    if (document.readyState === 'complete') {
      initLowPriorityTask();
    } else {
      // document.onreadystatechange = () => {
      //   if (document.readyState === 'complete') {
      //     console.log('ready', performance.now())
      //     // initLowPriorityTask();
      //   }
      // }
      window.addEventListener('load', _ => {
        initLowPriorityTask();
      });
    }
  }

  // 预留的后门, 可手动发送
  function initBackDoor() {
    window.nm = {
      sendData: sendMonitorData,
      getData: () => MonitorData.getReportData()
    };
  }

  window.newMonitor = {

    // 监控SDK初始化
    init(options) {
      // 清除脏数据
      // localStorage.removeItem('_BOSS_monitor');
      mergeOptions(options); // 完成首次选项合并
      getCustomConfig();
      initBackDoor();
    }
  };

})();
