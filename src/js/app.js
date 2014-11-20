var Moxie = {};

Moxie = (function($){

  'use strict';

  var opts = {
    partials : 'partials/',
    data     : 'data/',
    yield    : $('#js-yield')[0]
  };

  // public router method
  var router = {

    // set up routes
    init : function(){
      page('/', controller.index);
      page('/guestbook', controller.guestbook);
      page('*', controller.notFound);
      page();
    },

    // goto route method
    goTo : function(url){
      page(url);
    }

  };

  // private controller method
  var controller = {

    index : function(){
      x.render('index', undefined, function(){
        console.log('index');
      });
    },

    guestbook : function(){
      x.render('guestbook', 'guestbook', function(){
        console.log('guestbook');
      });
    },

    notFound : function(){
      console.log('404');
    }

  };

  // private toolbox
  var x = {

    // simple ajax get
    get : function(file, data, cb) {
      var rq = new XMLHttpRequest();
      rq.open('GET', file, true);
      rq.onload = function() {
        if ( rq.status >= 200 && rq.status < 400 ) {
          var resp = ( x.isUndef(data) ) ? rq.responseText : JSON.parse(rq.responseText) ;
          cb(resp, rq);
        } else {
          throw 'Server error!';
        }
      };
      rq.onerror = function() {
        throw 'Connection error!';
      };
      rq.send();
    },

    // get partial and render
    render : function(template, data, cb) {
      var tmpl = opts.partials + template + '.html';
      var file = ( x.isUndef(data) ) ? tmpl : opts.data + data + '.json' ;
      x.get(file, data, function(resp) {
        console.log(resp, tmpl, x.isUndef(data));
        opts.yield.innerHTML = ( x.isUndef(data) ) ? resp : Mustache.render(tmpl, resp) ;
        cb();
      });
    },

    // simple undefined check
    isUndef : function(o) {
      return typeof o === 'undefined';
    }

  };

  // return public api
  return {
    router : router
  };

})(qwery);

// fire up app on dom ready
document.addEventListener('DOMContentLoaded', function(){
  'use strict';
  Moxie.router.init();
});