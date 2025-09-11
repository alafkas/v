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

HTMLElement.prototype.v = function(url) {
  const element = this;
  element.setAttribute('data-url', _forgeUrl(url).href);
};

HTMLElement.prototype.refresh = function(callback) {
  const element = this;
  _refresh(element).then(() => {
    setTimeout(() => {
      _clearOpacityClasses();
    }, 1000);

    if (typeof callback === 'function') {
      callback();
    }
  })
}

HTMLElement.prototype.getParam = function(name) {
  const element = this;
  const params = _getParams(element);
  return params.get(name);
}

HTMLElement.prototype.setParam = function(name, value) {
  const element = this;
  const url = _forgeUrl(element.getAttribute('data-url'));
  
  url.searchParams.set(name, value);

  element.v(url.href);
}

HTMLElement.prototype.deleteParam = function(name, value) {
  const element = this;
  const url = _forgeUrl(element.getAttribute('data-url'));
  
  url.searchParams.delete(name);
  
  element.v(url.href);
}

function refreshAll(callback) {
  _refreshChildren(document.body).then(() => {
    setTimeout(() => {
      _clearOpacityClasses();
    }, 1000);

    if (typeof callback === 'function') {
      callback();
    }
  })
}

function _refresh(element) {
  const url = _forgeUrl(element.getAttribute('data-url'));
  
  const params = _getParams(element);
  url.search = params;

  element.innerHTML = `<div class="_skeleton-loader"></div>`;

  const promise = _request(_forgeUrl(url).href);

  return promise.then((response) => {
    element.classList.add("_fade-in");
    element.innerHTML = response;
    return _refreshChildren(element);
  }).catch((error) => {
    element.innerHTML = error;
  })
}

function _refreshChildren(element) {
  const elements = element.querySelectorAll(':scope [data-url]');
  
  const promises = [];

  for (let i = 0; i < elements.length; i++) {
    promises.push(_refresh(elements[i]));
  }

  return Promise.allSettled(promises);
}

function _forgeUrl(url) {
  return new URL(url, window.location);
}

function _getParams(element) {
  const urlSearchParams = new URLSearchParams();

  const searchParamsList = _getSearchParamsList(element, []);

  searchParamsList.forEach((searchParams) => {
    searchParams.forEach((value, key) => {
      if (urlSearchParams.get(key) == null) {
        urlSearchParams.set(key, value);
      }
    })
  })

  return urlSearchParams;
}

function _getSearchParamsList(element, searchParamsList) {
  if (element == document.body) {
    url = _forgeUrl(window.location);
    searchParamsList.push(url.searchParams);
    return searchParamsList;
  }
  else {
    if (element.hasAttribute('data-url')) {
      url = _forgeUrl(element.getAttribute('data-url'));
      searchParamsList.push(url.searchParams);
    }
    return _getSearchParamsList(element.parentElement, searchParamsList);
  }
}

function _clearOpacityClasses() {
  const elements = document.querySelectorAll('._fade-in');
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove('_fade-in');
  }
}

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
}