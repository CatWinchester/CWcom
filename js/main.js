require.config({
    baseUrl: "/mysite/js",
    paths: {
        "some": "some/v1.0"
    }
});

require(
    ['beziermodule','jquery'],
    function (beziermodule, $) {
        $('body').append(beziermodule.init('bezierCanvas'));
    }
);