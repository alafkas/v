Element.prototype.v = function(url) {
  var element = this;
  element.setAttribute('data-url', url);
};

Element.prototype.refresh = function() {
  var element = this;
  var url = element.getAttribute('data-url');

  _request(url).then((response) => {
    element.innerHTML = response;
    _refreshAll(element);
  }).catch((error) => {
    element.innerHTML = error;
  })
};

function refreshAll() {
  _refreshAll(document.body);
};

function _refreshAll(element) {
  const elements = element.querySelectorAll(':scope [data-url]');
  
  const promises = [];
  for (var i = 0; i < elements.length; i++) {
    var url = elements[i].getAttribute('data-url');
    promises.push(_request(url));
  }
  
  Promise.allSettled(promises).then((results) => {
    for(var i = 0; i < results.length; i++) {
      var result = results[i];
      if (result.status === "fulfilled") {
        elements[i].innerHTML = result.value;
        _refreshAll(elements[i]);
      }
      else {
        elements[i].innerHTML = result.reason;
      }
    }
  });
};

function _request(url) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE) {
        if (this.status == 200) {
          resolve(request.response);
        } else {
          reject("Error loading " + "\"" + url + "\"" + "...");
        }
      }
    };
    request.open("GET", url, true);
    request.send();
  });
};
