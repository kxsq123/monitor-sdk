# 前端监控SDK（错误收集|性能监测）

## 目录结构

```
fe-monitor-sdk
  - dist // 打包
  - example // 页面demo
  - src // 主要逻辑
  - test // 单元测试
  - .babelrc
  - .gitignore
  - karma.conf.js // 单测配置
  - package.json
  - rollup.config.js // rollup 打包配置


```

## 打包

```
yarn run build // 正式包
yarn run dev // 开发环境包

dist
  - monitor.common.js // commonjs模块
  - monitor.esm.js // es模块
  - monitor.min.js  // umd模块
```

## 使用方法

```
  
<script type="text/javascript" src="../dist/monitor.min.js">
</script>
 
<script>
    if (window.newMonitor) {
        // id 在管理后台创建项目后获取
        newMonitor.init({ id: '5cd426cxxxxxxxxxxxxx' });
    }
</script>

```

## 收集指标项

* 基础信息
   * 浏览器信息
       * tag
       * UA
       * version
   * 显示器信息
       * width / height
       * pixelDepth
       * colorDepth
       
   * 运行环境
   * SDK version
   * 操作系统
   * 上报时间
   * 项目名称
   * 用户名称
   * 保留字段
   * 页面来源
   * 当前路由
   
* 错误信息

   * 错误类型 
      * Script Error
      * Vue HandleError
      * ResourceError
      * APIError
      
   * 错误信息
   * 错误详情
      * name [Script Error]
      * message [Script Error]
      
      * api [APIError]
      * code [APIError]
      * message [APIError]
      * method [APIError]
      * params [APIError]
      * response [APIError]
      * responseText [APIError]
      
      * vmName [Vue HandleError]
      * info [Vue HandleError]
      
      * source [ResourceError]
      * tagName [ResourceError]
      * element [ResourceError]
   * 错误栈

* 页面加载性能

   * performance timing 
      * connectEnd
      * connectStart
      * domComplete
      * domContentLoadedEventEnd
      * domContentLoadedEventStart
      * domInteractive: 1550652069228
      * domLoading: 1550652067824
      * ... (详见 performance timing)

* 资源加载性能
   * resource timing 
      * name 
      * entryType
      * startTime
      * duration
      * initiatorType
      * nextHopProtocol
      * ... (详见 resource timing)

## 上报数据结构

```

{
    // 浏览器信息
    "browser" : {
        "tag" : "Chrome",
        "userAgent" : "mozilla/5.0 (macintosh; intel mac os x 10_14_2) applewebkit/537.36 (khtml, like gecko) chrome/71.0.3578.98 safari/537.36",
        "version" : "71"
    },
    // 显示器信息
    "screen" : {
        "width" : 1280,
        "height" : 800,
        "pixelDepth" : 24,
        "colorDepth" : 24
    },
    // 运行环境
    "env": "",
    // SDK版本信息
    "version": "",
    // 操作系统
    "platform" : "Mac OS",
    // 用户IP信息
    "ip": "",
    // 错误发生时间
    "time" : "2018-12-21T03:04:21.686Z",
 
    // 项目名称
    "project": "",
    // 用户名称
    "user": "",
    // 保留字段
    "other": {},
     
    // 页面的 refer，可以定位页面的入口
    "referrer": "", // 空字符串时为直接域名进入的；
    // 当前路由信息
    "url" : "http://xxx/testpage",
 
 
    // 错误信息
    "type" : "Script Error", // Script Error、Vue HandleError、ResourceError、APIError
    "msg" : "脚本错误",
    "desc" : {
        "name" : "TypeError",
        "message" : "Cannot read property 'setMonitor' of undefined"，
         
        // 以下 HTTP 请求错误特有 desc 字段
        "api": "http://xxx:9318/filter/flow/workflow/get_form?instanceId=000000000000000000018843"
        "code": "400 Bad Request"
        "message": "接口请求异常"
        "method": "GET"
        "params": null
        "response": "{"error":"获取流程表单定义失败"}"
        "responseText": "{"error":"获取流程表单定义失败"}"
    },
    "stack" : "TypeError: Cannot read property 'setMonitor' of undefined\n    at eval (webpack-internal:///576:40:26)",
 
    // Vue 组件内部特有字段
    "vmName" : "component <NewFlowAppCenter> at /Users/shitakusei/Desktop/project/xxx/src/views/NewFlowAppCenter/index.vue",
    "info" : "beforeMount hook",
     
    // 资源收集错误特有字段
    "source" : "file:///Users/shitakusei/Desktop/project/errorHandler/test.js",
    "tagName" : "SCRIPT",
    "element" : "<script src=\"../test.js\"></script>",
 
 
    // 页面性能收集相关字段
    timeOrigin: 1550652067622.862
    timing: {
        connectEnd: 1550652067728
        connectStart: 1550652067650
        domComplete: 1550652069923
        domContentLoadedEventEnd: 1550652069624
        domContentLoadedEventStart: 1550652069621
        domInteractive: 1550652069228
        domLoading: 1550652067824
        domainLookupEnd: 1550652067650
        domainLookupStart: 1550652067636
        fetchStart: 1550652067629
        loadEventEnd: 1550652069923
        loadEventStart: 1550652069923
        navigationStart: 1550652067626
        redirectEnd: 0
        redirectStart: 0
        requestStart: 1550652067728
        responseEnd: 1550652067814
        responseStart: 1550652067807
        secureConnectionStart: 1550652067656
        unloadEventEnd: 1550652067816
        unloadEventStart: 1550652067815
    }
 
 
    // 资源加载收集相关字段，
    "timings" : [
        {
            "name" : "https:/xxx/dist/54.eae41be4.js",
            "entryType" : "resource",
            "startTime" : 293.400000009569,
            "duration" : 1001.30000000354,
            "initiatorType" : "link",
            "nextHopProtocol" : "http/1.1",
            "workerStart" : 0,
            "redirectStart" : 0,
            "redirectEnd" : 0,
            "fetchStart" : 293.400000009569,
            "domainLookupStart" : 293.400000009569,
            "domainLookupEnd" : 293.400000009569,
            "connectStart" : 293.400000009569,
            "connectEnd" : 293.400000009569,
            "secureConnectionStart" : 0,
            "requestStart" : 1246.60000001313,
            "responseStart" : 1293.10000000987,
            "responseEnd" : 1294.70000001311,
            "transferSize" : 2549,
            "encodedBodySize" : 2054,
            "decodedBodySize" : 4674,
            "serverTiming" : []
        }
    ]
}"

```
