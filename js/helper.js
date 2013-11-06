define(
    'helper',
    function () {
        return {
            getRandomColor: function () {
                var letters = '0123456789ABCDEF'.split('');
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.round(Math.random() * 15)];
                }
                return color;
            },
            fact: function (n) {
                return n < 2 ? 1
                         : n * fact(n - 1);//умова ? значення1 : значення2 -тернарний оператор 
            }
        }
    }
);