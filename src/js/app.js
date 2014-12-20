var Moxie = {};

Moxie = (function($){

  'use strict';

  // options
  var opts = {
    partials  : 'partials/',
    dataStore : 'data/',
    urlBase   : 'moxie-blog',
    title     : 'The Moxie Blog',
    yield     : $('#js-yield')[0],
    dateField : 'created_at'
  };

  // public router method
  var router = function() {
    page('/', controller.index);
    page('/about', controller.about);
    page('/guestbook', controller.guestbook);
    page('/moxietv', controller.moxietv.index);
    page('/moxietv/:id', controller.moxietv.entry);
    page('/phlog', controller.phlog.index);
    page('/phlog/:id', controller.phlog.entry);
    page('*', controller.notFound);
    page({ hashbang: true });
  };

  // private controller method
  var controller = {
    index : function() {
      render({ partial : 'index' });
    },
    guestbook : function() {
      render({ partial : 'guestbook', json : 'guestbook', title : 'Guestbook' });
    },
    about : function() {
      render({ partial : 'about', title : 'About the Moxie Blog' });
    },
    phlog : {
      index : function() {
        render({
          partial    : 'phlog/index',
          json       : 'phlogs/index',
          title      : 'Phlog'
        });
      },
      entry : function(ctx) {
        render({
          partial    : 'phlog/entry',
          json       : 'phlogs/' + ctx.params.id,
          title      : 'Phlog',
          titleJson  : 'title'
        });
      }
    },
    moxietv : {
      index : function() {
        render({
          partial    : 'moxietv/index',
          json       : 'moxietv/index',
          title      : 'Moxie TV',
          dateFormat : 'mdy'
        });
      },
      entry : function(ctx) {
        render({
          partial    : 'moxietv/entry',
          json       : 'moxietv/' + ctx.params.id,
          title      : 'Moxie TV',
          dateFormat : 'mdy',
          titleJson  : 'title'
        });
      }
    },
    notFound : function() {
      render({ partial : '404', title : 'Not found' });
    }
  };

  // ajax get
  var get = function(file, json, cb) {
    var rq = new XMLHttpRequest();
    rq.open('GET', file, true);
    rq.onload = function() {
      if ( rq.status >= 200 && rq.status < 400 ) {
        var resp = ( isUndef(json) ) ? rq.responseText : JSON.parse(rq.responseText) ;
        cb(resp, rq);
      } else {
        throw 'Server error!';
      }
    };
    rq.onerror = function() {
      throw 'Connection error!';
    };
    rq.send();
  };

  // render template
  var render = function(o) {
    var partial = opts.partials + o.partial + '.html';
    get(partial, undefined, function(partial) {
      var titleArr = [];
      if ( !isUndef(o.title) ) {
        titleArr.push(o.title);
      }
      // static partial render
      if ( isUndef(o.json) ) {
        opts.yield.innerHTML = partial;
        if ( !isUndef(o.success) ) {
          o.success();
        }
      // import data into partial
      } else {
        var json = opts.dataStore + o.json + '.json';
        get(json, true, function(data) {
          data.time = function() {
            var format = o.dateFormat || '' ;
            return time(this[opts.dateField], format);
          };
          opts.yield.innerHTML = Mustache.render(partial, data);
          if ( !isUndef(o.titleJson) ) {
            // set the title again if extra
            titleArr.push(data[o.titleJson]);
            title(titleArr);
          }
          if ( !isUndef(o.success) ) {
            o.success(data);
          }
        });
      }
      // set the title
      title(titleArr);
    });
  };

  // switch page title
  var title = function(arr) {
    if ( arr.length && arr[0] !== opts.title ) {
      arr.unshift(opts.title);
    }
    document.title = ( arr.length ) ? arr.join(' | ') : opts.title ;
  };

  // simple undefined check
  var isUndef = function(o) {
    return typeof o === 'undefined';
  };

  // convert timestamp
  var time = function(stamp, format) {
    var d = new Date(stamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month = months[d.getMonth()];
    var day = d.getDate();
    var year = d.getFullYear();
    var hours = d.getHours() + 1;
    var hour = ( hours > 12 ) ? hours - 12 : hours ;
    var mins = d.getMinutes() + 1;
    var am = ( hours >= 12 ) ? 'p' : 'a' ;
    if ( format === 'my' ) {
      return month + ' ' + year;
    } else if ( format === 'mdy' ) {
      return month + ' ' + day + ', ' + year;
    } else {
      return month + ' ' + day + ', ' + year + ' @ ' + hour + ':' + mins + am;
    }
  };

  // return public api
  return {
    router : router
  };

})(qwery).router();