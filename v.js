/* Author: Aristeidis Lafkas */
Element.prototype.v = function(url) {
  var element = this;
  element.setAttribute('data-url', url);
};

Element.prototype.refresh = function() {
  var element = this;
  var url = element.getAttribute('data-url');

  request(url).then((response) => {
    element.innerHTML = response;
  }).catch((error) => {
    element.innerHTML = error;
  })
};

function refreshAll() {
  const elements = document.querySelectorAll(`*[data-url]`);
  
  const promises = [];
  for (var i = 0; i < elements.length; i++) {
    var url = elements[i].getAttribute('data-url');
    promises.push(request(url));
  }
  
  Promise.allSettled(promises).then((results) => {
    for(var i = 0; i < results.length; i++) {
      var result = results[i];
      if (result.status === "fulfilled") {
        elements[i].innerHTML = result.value;
      }
      else {
        elements[i].innerHTML = result.reason;
      }
    }
  });
}

function request(url) {
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
}
