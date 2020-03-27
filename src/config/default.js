/**
 * Created by daizengyu on 2019-05-14.
 */

// 基础配置
const base = {
  id: '',
  project: '', // 项目名
  baseUrl: '/v2/monitor', // 上报地址
};

// PV收集配置
const pv = {
  urlTracker: true, // 路由变化pv收集器
  visibilityTracker: false, // 可视区域变化pv收集器
  visibilityPvTime: 3600000 // 可视区变化间隔时间
};

// 错误收集配置
const error = {
  sample: 1, // 采样率
  jsError: true, // 开启全局js错误收集
  apiError: true, // 接口请求错误收集
  vueError: true, // 开启vue错误收集
  httpError: true, // 开启资源错误收集
  filters: [] // 过滤器
};

// 上报模块配置
const report = {
  reportTime: 3600000, // 上报间隔
  reportPvTime: 60000
}

// 性能分析模块配置
const perf = {
  isCollectedPerformance: true, // 收集性能指标
  maxTiming: 1000, // 资源收集超时最大时间阀值
}

export default {
  ...base,
  ...pv,
  ...error,
  ...report,
  ...perf
};
