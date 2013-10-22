
var a = [20, 5, 1, 4, 7, 5, 9, 11, 13, 14];

function MaxArrayItem(array) {
    if (array.length < 1)
        throw new RangeError();

    maxEl = array[0];

    for (var i = 1; i < array.length; i++) {
        if (array[i] > maxEl) maxEl = array[i];
    }

    return maxEl;
}

function Max(a, b) {
    return a > b ? a
                 : b;
}

function Max(a, b, c) {
    return a > b ? a > c ? a
                         : c
                 : b > c ? b
                         : c;
}

function Max(a, b, c, d) {
    return a > b ? a > c ? a > d ? a
                                 : d
                         : c > d ? c
                                 : d
                 : b > c ? b > d ? b
                                 : d
                         : c > d ? c
                                 : d;
}

function Max(a, b, c, d, e, f) {
    return a > b ? a > c ? a > d ? a > e ? a > f ? a
                                                 : f
                                         : e > f ? e
                                                 : f
                                 : d > e ? d > f ? d
                                                 : f
                                         : e > f ? e
                                                 : f
                         : c > d ? c > e ? c > f ? c
                                                 : f
                                         : e > f ? e
                                                 : f
                                 : d > e ? d > f ? d
                                                 : f
                                         : e > f ? e
                                                 : f
                 : b > c ? b > d ? b > e ? b > f ? b
                                                 : f
                                         : e > f ? e
                                                 : f
                                 : d > e ? d > f ? d
                                                 : f
                                         : e > f ? e
                                                 : f
                         : c > d ? c > e ? c > f ? c
                                                 : f
                                         : e > f ? e
                                                 : f
                                 : d > e ? d > f ? d
                                                 : f
                                         : e > f ? e
                                                 : f;
}

function Average(array) {
    var av = 0;

    for (var i = 0; i < array.length; i++) {
        av += array[i];
    }
    return av / array.length;
}

console.log(maxArrayItem(a));