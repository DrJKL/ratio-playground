function factors(num) {
    var n_factors = [],
        i;
    var lim = Math.floor(Math.sqrt(num));
    for (i = 1; i <= lim; i++) {
        if (num % i === 0) {
            n_factors.push(i);
            if (num / i !== i) {
                n_factors.push(num / i);
            }
        }
    }
    n_factors.sort(function(a, b) {
        return a - b;
    }); // numeric sort
    return n_factors;
}

function gcd(a, b) {
    if (a < 0) {
        a = -a;
    }
    if (b < 0) {
        b = -b;
    }
    if (b > a) {
        var temp = a;
        a = b;
        b = temp;
    }
    while (true) {
        a %= b;
        if (a == 0) {
            return b;
        }
        b %= a;
        if (b == 0) {
            return a;
        }
    }
}

function recalculate() {
    var width = document.querySelector('#width').value;
    var height = document.querySelector('#height').value;
    var gcd_ = gcd(width, height);
    var factors_ = factors(gcd_);
    var widthRatio = width / gcd_;
    var heightRatio = height / gcd_;
    var numfactors = factors_.length;

    document.querySelector('#gcd').innerHTML = gcd_;
    document.querySelector('#commonfactors').innerHTML = makeFactorsList(factors_);
    document.querySelector('#numfactors').innerHTML = numfactors;
    document.querySelector('#ratio').innerHTML = "" + widthRatio + " : " + heightRatio;

    var showme = document.querySelector('#showme');
    showme.style.width = width + "px";
    showme.style.height = height + "px";
    showme.style['background-color'] = goodRatio(widthRatio, heightRatio, gcd_, factors_.length) ? "gold" : "blue";
}

function makeFactorsList(factors_) {
    var factorsList = "";
    for (var i = 0, len = factors_.length; i < len; i++) {
        factorsList += "<span onclick='createGrid(" + factors_[i] + ")'>" + factors_[i] + "</span>, ";
    };
    return factorsList;
}

function goodRatio(widthRatio, heightRatio, gcd, numfactors) {
    var good = true;
    good = good && widthRatio <= 20;
    good = good && heightRatio <= 20;
    good = good && numfactors >= 6;
    good = good && gcd >= 10;
    return good;
}

function createGrid(size) {
    var parent = document.querySelector('#showme .grid');
    parent.innerHTML = '';
    var ratioW = parseInt(parent.parentElement.style.width) / size;
    var ratioH = parseInt(parent.parentElement.style.height) / size;
    for (var i = 0; i < ratioH; i++) {
        for (var p = 0; p < ratioW; p++) {
            var cell = document.createElement('div');
            cell.style.height = (size - 1) + 'px';
            cell.style.width = (size - 1) + 'px';
            parent.appendChild(cell);
        }
    }
}