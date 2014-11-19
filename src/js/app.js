var Moxie = {};

Moxie = (function(){

  'use strict';

  // public router method
  var router = {

    // set up routes
    init : function(){
      page('/', controller.index);
      page('/dan', controller.dan);
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
      x.get('partials/index.html', function(data, rq){
        console.log(data, rq);
        $('#content').html('<b>Dan</b>');
      });
    },

    dan : function(){
      console.log('dan');
    },

    notFound : function(){
      console.log('404');
    }

  };

  // private toolbox
  var x = {

    // simple ajax get
    get : function(file, cb) {
      var rq = new XMLHttpRequest();
      rq.open('GET', file, true);
      rq.onload = function() {
        if (rq.status >= 200 && rq.status < 400){
          cb(rq.responseText, rq);
        } else {
          throw 'Server error!';
        }
      };
      rq.onerror = function() {
        throw 'Connection error!';
      };
      rq.send();
    }

  };

  // combine bonzo + qwery
  var $ = function(selector) {
    return bonzo(qwery(selector));
  };

  // return public api
  return {
    router : router
  };

})(bonzo);

// fire up app on dom ready
document.addEventListener('DOMContentLoaded', function(){
  'use strict';
  Moxie.router.init();
});