(function($){

  'use strict';

  // options
  var opts = {
    cache     : {},
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
    page('/archive', controller.blog.archive);
    page('/archive/:year', controller.blog.archive);
    page('/post/:id', controller.blog.entry);
    page('*', controller.notFound);
    page({ hashbang: true });
  };

  // private controller method
  var controller = {
    index : function() {
      render({ partial : 'partials/index' });
    },
    guestbook : function() {
      render({ partial : 'partials/guestbook', json : 'data/guestbook', title : 'Guestbook' });
    },
    about : function() {
      render({ partial : 'partials/about', title : 'About the Moxie Blog' });
    },
    phlog : {
      index : function() {
        render({
          partial    : 'partials/phlog/index',
          json       : 'data/phlogs/index',
          title      : 'Phlog'
        });
      },
      entry : function(ctx) {
        render({
          partial    : 'partials/phlog/entry',
          json       : 'data/phlogs/' + ctx.params.id,
          title      : 'Phlog',
          titleJson  : 'title'
        });
      }
    },
    moxietv : {
      index : function() {
        render({
          partial    : 'partials/moxietv/index',
          json       : 'data/moxietv/index',
          title      : 'Moxie TV',
          dateFormat : 'mdy'
        });
      },
      entry : function(ctx) {
        render({
          partial    : 'partials/moxietv/entry',
          json       : 'data/moxietv/' + ctx.params.id,
          title      : 'Moxie TV',
          dateFormat : 'mdy',
          titleJson  : 'title'
        });
      }
    },
    blog : {
      archive : function(ctx) {
        var year = parseInt(ctx.params.year) || 2004;
        title(['Archive']);
        archive(year);
      },
      entry : function(ctx) {
        render({
          partial    : 'partials/blog/entry',
          json       : 'data/posts/' + ctx.params.id,
          titleJson  : 'title'
        });
      }
    },
    notFound : function() {
      render({ partial : 'partials/404', title : 'Not found' });
    }
  };

  // build archive page
  var archive = function(year) {
    var archiveData = { 'months' : [] };
    get('data/archive/year/' + year, function(data) {
      for ( var month in data ) {
        var monthInt = parseInt(month) - 1;
        if ( data[month].length ) {
          var d = new Date(year, monthInt);
          var comments = 0;
          for ( var i = 0, len = data[month].length; i < len; i++ ) {
            comments += data[month][i].comments;
          }
          var collection = {
            date : time(d, 'my'),
            count : data[month].length,
            comments : comments,
            posts : data[month] 
          };
          archiveData.months.push(collection);
        }
      }
      get('partials/blog/archive', function(html) {
        opts.yield.innerHTML = Mustache.render(html, archiveData);
      });
    });
  };

  // get method for partials and data
  function get(file, cb) {
    var ext = ( file.indexOf('data') !== -1 ) ? 'json' : 'html' ;
    if ( opts.cache[file] ) {
      cb(opts.cache[file]);
    } else {
      file = file + '.' + ext;
      var rq = new XMLHttpRequest();
      rq.open('GET', file, true);
      rq.onload = function() {
        if ( rq.status >= 200 && rq.status < 400 ) {
          var data = ( ext === 'json' ) ? JSON.parse(rq.responseText) : rq.responseText ;
          opts.cache[file] = data;
          cb(data);
        } else {
          throw 'Server error!';
        }
      };
      rq.onerror = function() { throw 'Connection error!'; };
      rq.send();
    }
  }

  // render templates
  function render(o) {
    var titleArr = [];
    titleArr.push(o.title);
    if ( isUndef(o.json) ) {
      get(o.partial, function(html) { opts.yield.innerHTML = html; });
    } else {
      get(o.partial, function(template) {
        get(o.json, function(json) {
          json.time = function() {
            var format = o.dateFormat || '' ;
            return time(this[opts.dateField], format);
          };
          opts.yield.innerHTML = Mustache.render(template, json);
          if ( !isUndef(o.titleJson) ) {
            titleArr.push(json[o.titleJson]);
            title(titleArr);
          }
          if ( !isUndef(o.success) ) { o.success(json); }
        });
      });
    }
    title(titleArr);
  }

  // switch page title
  function title(arr) {
    arr = arr.filter(function(n) { return n !== undefined; });
    if ( arr.length && arr[0] !== opts.title ) { arr.unshift(opts.title); }
    document.title = ( arr.length ) ? arr.join(' | ') : opts.title ;
  }

  // simple undefined check
  function isUndef(o) { return typeof o === 'undefined'; }

  // convert timestamp
  function time(stamp, format) {
    var d = new Date(stamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month = months[d.getMonth()];
    var day = d.getDate();
    var year = d.getFullYear();
    var hours = d.getHours() + 1;
    var hour = ( hours > 12 ) ? hours - 12 : hours ;
    var mins = d.getMinutes() + 1;
    var am = ( hours >= 12 ) ? 'p' : 'a' ;
    if ( format === 'my' ) { return month + ' ' + year; }
    else if ( format === 'mdy' ) { return month + ' ' + day + ', ' + year; }
    else { return month + ' ' + day + ', ' + year + ' @ ' + hour + ':' + mins + am; }
  }

  // return public api
  return {
    router : router
  };

}(qwery)).router();