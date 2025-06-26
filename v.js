/*
MIT License

Copyright (c) 2013-2025 Aris Lafkas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

Element.prototype.v = function(url) {
  const element = this;
  element.setAttribute('data-url', url);
};

Element.prototype.refresh = function() {
  const element = this;
  const url = element.getAttribute('data-url');

  _request(url).then((response) => {
    element.innerHTML = response;
    _refreshChildren(element);
  }).catch((error) => {
    element.innerHTML = error;
  })
};

function refreshAll() {
  _refreshChildren(document.body);
};

function _refreshChildren(element) {
  const elements = element.querySelectorAll(':scope [data-url]');
  
  const promises = [];
  for (let i = 0; i < elements.length; i++) {
    const url = elements[i].getAttribute('data-url');
    promises.push(_request(url));
  }
  
  Promise.allSettled(promises).then((results) => {
    for(let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === "fulfilled") {
        elements[i].innerHTML = result.value;
        _refreshChildren(elements[i]);
      }
      else {
        elements[i].innerHTML = result.reason;
      }
    }
  });
};

function _request(url) {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE) {
        if (this.status == 200) {
          resolve(request.response);
        } else {
          reject("Error loading " + "\"" + url + "\"" + "...");
        }
      }
    };
    request.responseType = 'text';
    request.open("GET", url, true);
    request.send();
  });
};
