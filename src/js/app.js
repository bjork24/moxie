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
      console.log('index');
    },

    dan : function(){
      console.log('dan');
    },

    notFound : function(){
      console.log('404');
    }

  };

  // return public api
  return {
    router : router
  };

})();

// fire up app on dom ready
domready(function(){
  'use strict';
  Moxie.router.init();
});