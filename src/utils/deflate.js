
let hasPakoInstalled; // 加载成功标识

import('https://cdn.bootcss.com/pako/1.0.10/pako_deflate.min.js')
  .then(_ => {
    console.info('pako load success');
    hasPakoInstalled = true;
  })
  .catch(err => {
    console.error(err);
  });

// function compressData(buf) {
//   const format = 'gzip'; // gzip | deflate | deflate-raw
//   switch(format) {
//     case 'gzip':
//       buf = window.pako.gzip(bufBody);
//       break;
//     case 'deflate':
//       buf = window.pako.deflate(bufBody);
//       break;
//     case 'deflate-raw':
//       buf = window.pako.deflateRaw(bufBody);
//       break;
//   }
//   return buf;
// }

function createBuffer(data) {

  if (!hasPakoInstalled) return;

  var bufBody = new Uint8Array(data.length);

  for (let i = 0; i < data.length; i++) {
    bufBody[i] = data.charCodeAt(i);
  }

  return window.pako.gzip(bufBody);
}

function deflateAjax(options) {

  const { method, baseUrl, data } = options;

  const result = createBuffer(data) || data;

  return new Promise((resolve, reject) => {
    const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.onerror = reject;
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 400) {
          const isJson = /application\/json/.test(xhr.getResponseHeader('content-type'));
          const result = isJson ? JSON.parse(xhr.responseText) : xhr.responseText;
          resolve(result);
        } else {
          reject(new Error('POST to ' + baseUrl + ' failed with status: ' + xhr.status));
        }
      }
    }

    xhr.open(method, baseUrl);

    if (hasPakoInstalled) { // 如果 pako 装载失败那么降级为普通方式发送请求
      xhr.setRequestHeader('Content-Encoding', 'gzip');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    } else {
      xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    }

    xhr.send(result);
  })
}

export default deflateAjax;

