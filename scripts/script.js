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
    document.querySelector("#factorslabel").innerHTML = "factors (" + numfactors + ") ";
    document.querySelector('#ratio').innerHTML = "" + widthRatio + " : " + heightRatio;

    var grid = document.querySelector("#showme.grid");
    grid.width = width;
    grid.height =  height;

    grid.classList.remove("good");
    if (goodRatio(widthRatio, heightRatio, gcd_, numfactors)) {
        grid.classList.add("good");
    }
}

function makeFactorsList(factors_) {
    var factorsList = "";
    for (var i = 0, len = factors_.length; i < len; i++) {
        factorsList += "<span onclick='createGrid(" + factors_[i] + ")'>" + factors_[i] + "</span>, ";
    };
    return factorsList.substring(0,factorsList.length - 2);
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
    var grid = document.querySelector('#showme.grid');
    var ctx = grid.getContext("2d");
    ctx.clearRect(0, 0, grid.width, grid.height);
    var ratioW = grid.width / size;
    var ratioH = grid.height / size;
    ctx.beginPath();
    for (var i = 0; i < ratioH; i++) {
        ctx.moveTo(0,i*size);
        ctx.lineTo(grid.width, i*size);
    }
    for (var i = 0; i < ratioW; i++) {
        ctx.moveTo(i*size, 0);
        ctx.lineTo(i*size, grid.height);
    }
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.stroke();
}
