requirejs.config({
    paths: {
        "jquery": "http://code.jquery.com/jquery-2.0.3",
        "knockout": "http://knockoutjs.com/downloads/knockout-2.3.0"
    }
});

requirejs(['backgroundModule','koModule'],
          function (backgroundModule, koModule) {
              
              backgroundModule.init("background");
              koModule.init();
          }
);