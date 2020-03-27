export default function ajax (options) {

  const { method, baseUrl, data, contentType = 'text/plain' } = options;
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
    xhr.setRequestHeader('Content-Type', `${contentType};charset=UTF-8`);
    xhr.send(data);
  });
}

