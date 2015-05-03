(function() {
  'use strict';
  var data, update;

  chrome.runtime.onInstalled.addListener(function(details) {
    return console.log('previousVersion', details.previousVersion);
  });

  data = {
    user_name: '',
    user_email: '',
    urls: [
      {
        url: '',
        comments: [
          {
            name: '',
            email: '',
            comment: '',
            date: ''
          }
        ]
      }
    ]
  };

  chrome.runtime.onInstalled.addListener(function(details) {
    console.log('previousVersion', details.previousVersion);
    return chrome.storage.local.set({
      'value': data
    });
  });

  update = (function(_this) {
    return function() {
      return chrome.storage.local.get('value', function(result) {
        result = result.value;
        return chrome.tabs.getSelected(null, function(tab) {
          var d, domain, flag, oth, other, urlN, urls, val, _i, _len, _ref, _ref1;
          _ref = tab.url.split('://'), d = _ref[0], other = _ref[1];
          _ref1 = other.split('/'), domain = _ref1[0], oth = _ref1[1];
          urlN = d + '://' + domain;
          console.log(urlN);
          flag = false;
          urls = result.urls;
          for (_i = 0, _len = urls.length; _i < _len; _i++) {
            val = urls[_i];
            if (urlN === val.url) {
              chrome.browserAction.setBadgeText({
                text: val.comments.length.toString()
              });
              flag = true;
              break;
            }
          }
          if (!flag) {
            return chrome.browserAction.setBadgeText({
              text: '0'
            });
          }
        });
      });
    };
  })(this);

  update();

  chrome.tabs.onActivated.addListener(function(activeInfo) {
    return update();
  });

}).call(this);
