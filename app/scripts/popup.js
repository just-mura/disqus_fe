(function() {
  'use strict';
  var comments, ractive;

  comments = [];

  ractive = new Ractive({
    el: '#result',
    template: '#ractive_id',
    data: {
      user_name: ' ',
      user_email: ' ',
      comments: comments
    }
  });

  ractive.set('array_length', 0);

  document.getElementById('pager').style.display = 'none';

  ractive.on('ok', (function(_this) {
    return function() {
      ractive.set('user_name', ractive.get('user_name'));
      ractive.set('user_email', ractive.get('user_email'));
      return chrome.storage.local.get('value', function(result) {
        result = result.value;
        result.user_name = ractive.get('user_name');
        result.user_email = ractive.get('user_email');
        return chrome.storage.local.set({
          'value': result
        });
      });
    };
  })(this));

  ractive.on('add_comment', (function(_this) {
    return function() {
      var date, day, month;
      date = new Date();
      day = date.getDay();
      if (day <= 9) {
        day = '0' + day;
      }
      month = date.getMonth();
      if (month <= 9) {
        month = '0' + month;
      }
      if ((ractive.get('user_name')) === '' || (ractive.get('email')) === '') {
        alert('enter name and surname to add comment');
        return;
      }
      comments = ractive.get('comments');
      comments.push({
        name: ractive.get('user_name'),
        email: ractive.get('user_email'),
        comment: ractive.get('comment'),
        date: day + '.' + month + '.' + date.getFullYear()
      });
      ractive.set('comments', comments);
      ractive.set('array_length', comments.length);
      ractive.set('comment', '');
      chrome.browserAction.setBadgeText({
        text: comments.length.toString()
      });
      if (comments.length > 1) {
        document.getElementById('pager').style.display = 'block';
      }
      return chrome.storage.local.get('value', function(result) {
        result = result.value;
        return chrome.tabs.getSelected(null, function(tab) {
          var d, data, domain, flag, oth, other, urlN, urls, val, _i, _len, _ref, _ref1;
          _ref = tab.url.split('://'), d = _ref[0], other = _ref[1];
          _ref1 = other.split('/'), domain = _ref1[0], oth = _ref1[1];
          urlN = d + '://' + domain;
          flag = false;
          urls = result.urls;
          for (_i = 0, _len = urls.length; _i < _len; _i++) {
            val = urls[_i];
            if (urlN === val.url) {
              result.urls[_i].comments = ractive.get('comments');
              chrome.storage.local.set({
                'value': result
              });
              chrome.browserAction.setBadgeText({
                text: val.comments.length.toString()
              });
              ractive.set('array_length', val.comments.length.toString());
              flag = true;
              break;
            }
          }
          if (!flag) {
            urls.push({
              url: urlN,
              comments: comments
            });
            data = {
              user_name: ractive.get('user_name'),
              user_email: ractive.get('user_email'),
              urls: urls
            };
            return chrome.storage.local.set({
              'value': data
            });
          }
        });
      });
    };
  })(this));

  chrome.storage.local.get('value', function(result) {
    result = result.value;
    ractive.set('user_name', result.user_name);
    ractive.set('user_email', result.user_email);
    ractive.set('array_length', (ractive.get('comments')).length);
    return chrome.tabs.getSelected(null, function(tab) {
      var d, domain, flag, oth, other, urlN, urls, val, _i, _len, _ref, _ref1;
      _ref = tab.url.split('://'), d = _ref[0], other = _ref[1];
      _ref1 = other.split('/'), domain = _ref1[0], oth = _ref1[1];
      urlN = d + '://' + domain;
      flag = false;
      urls = result.urls;
      for (_i = 0, _len = urls.length; _i < _len; _i++) {
        val = urls[_i];
        if (urlN === val.url) {
          ractive.set('comments', result.urls[_i].comments);
          chrome.browserAction.setBadgeText({
            text: val.comments.length.toString()
          });
          ractive.set('array_length', result.urls[_i].comments.length);
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

}).call(this);
