# CHANGELOG

## v1.2.2:

【Feature】修改参数合并策略，在初始化时完成首次参数合并 (解决新项目创建后需要手动添加baseUrl的问题)

## v1.2.1:

【Bugfix】修改初始化低优先级任务执行时机（readyState 在 onload 前先加载） ；

## v1.2.0:

【Feature】TOP 10 路由规则更新，去除参数和 hash 对于 Top 10路由的影响；
【Bugfix】收集无效 resource timings ；

## v1.1.4:

【Bugfix】修改 SDK 默认 baseUrl, 优化代码结构，提取 pv visibilityPvTime 配置；

## v1.1.3:

【Bugfix】修复引入SDK页面崩溃的问题:  (详见： SDK导致页面崩溃的问题)
 1.上报接口加心跳检测，如果超过3次就清除定时任务不再上报；
 2.在 new ApiErrorData 时过滤掉SDK本身调接口失败产生的错误；
 3.try catch storage 操作如果满了就清除

## v1.1.2:

【Feature】SDK 配置按项目自动下发;
【Feature】SDK 添加平台来源数据收集；
【Feature】SDK 添加轮询上报的配置项；
【Feature】SDK 重构 pv 收集模块，urlTracker(路由变化pv收集器)，visibilityTracker(可视区域变化pv收集器， 默认关闭) 
【Feature】请求报文压缩，extract BaseData抽象类，减少报文体积，使用 pako 压缩 (zlib gzip格式) 报文 （需要后端同步支持gzip or zlib）


## v1.0.1beta:

【Bugfix】修复 onload 事件被用户重写后无法初始化性能收集 & Vue 内部组件内部错误收集；

## v1.0.0beta:

【Feature】支持收集浏览器信息、显示器信息、操作系统、用户 IP 等基础信息收集
【Feature】支持全局 JS 执行错误收集；
【Feature】支持全局 Vue 组件内部错误收集；
【Feature】支持全局资源加载 Timing 收集；
【Feature】支持性能 Performance Timing 收集；
【Feature】支持 HTTP 请求错误收集；
【Feature】支持收集采样率控制；
【Feature】支持收集过滤控制；
