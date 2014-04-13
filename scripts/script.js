function RatioPlayground() {
    this.width = 960;
    this.height = 540;
    this.canvas = document.querySelector("#showme.grid")
    this.recalculate();
}
RatioPlayground.prototype.findGcdFactors = function() {
    var num = this.gcd;
    var n_factors = [];
    var lim = Math.floor(Math.sqrt(num));
    for (var i = 1; i <= lim; i++) {
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
};
RatioPlayground.prototype.findGcd = function() {
    var a = this.width;
    var b = this.height;
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
};
RatioPlayground.prototype.widthRatio = function() {
    return this.width / this.gcd;
};
RatioPlayground.prototype.heightRatio = function() {
    return this.height / this.gcd;
};

RatioPlayground.prototype.updateValues = function() {
    this.width = document.querySelector("#width").value;
    this.height = document.querySelector("#height").value;
    this.gcd = this.findGcd();
    this.factors = this.findGcdFactors();
};

RatioPlayground.prototype.updateDocument = function() {
    document.querySelector('#gcd').innerHTML = this.gcd;
    document.querySelector('#commonfactors').innerHTML = this.getFactorsList();
    document.querySelector("#factorslabel").innerHTML = "factors (" + this.factors.length + ") ";
    document.querySelector('#ratio').innerHTML = "" + this.widthRatio() + " : " + this.heightRatio();

    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.classList.remove("good");
    if (this.goodRatio()) {
        this.canvas.classList.add("good");
    }
};

RatioPlayground.prototype.recalculate = function() {
    this.updateValues();
    this.updateDocument();
};

RatioPlayground.prototype.getFactorsList = function() {
    var factorsList = "";
    for (var i = 0, len = this.factors.length; i < len; i++) {
        factorsList += "<span onclick='ratioPlayground.makeGrid(" + this.factors[i] + ")'>" + this.factors[i] + "</span>, ";
    };
    return factorsList.substring(0, factorsList.length - 2);
}

RatioPlayground.prototype.goodRatio = function() {
    var goodConditions = [
        function() {
            return this.widthRatio() <= 20;
        }.bind(this),
        function() {
            return this.heightRatio() <= 20;
        }.bind(this),
        function() {
            return this.factors.length >= 6;
        }.bind(this),
        function() {
            return this.widthRatio() <= 20;
        }.bind(this),
        function() {
            return this.gcd >= 10;
        }.bind(this),
    ];
    for (var i = 0, len = goodConditions.length; i < len; i++) {
        if (!goodConditions[i]()) {
            return false;
        }
    }
    return true;
}

RatioPlayground.prototype.makeGrid = function(size) {
    this.grid && this.grid.destruct();
    var animateToggle = document.querySelector("#animationtoggle");
    this.grid = new Grid(this, size);
    animateToggle.checked && this.grid.toggleAnimation();
    this.grid.draw();
}

function Grid(ratioPlayground, size) {
    this.ctx = ratioPlayground.canvas.getContext("2d");
    this.size = size;
    this.ratioPlayground = ratioPlayground;
    this.frame = -1;
    this.width = ratioPlayground.width;
    this.height = ratioPlayground.height;
    this.ratioW = this.width / size;
    this.ratioH = this.height / size;
}

Grid.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.beginPath();
    for (var i = 0; i < this.ratioH; i++) {
        this.ctx.moveTo(0, i * this.size);
        this.ctx.lineTo(this.width, i * this.size);
    }
    for (var i = 0; i < this.ratioW; i++) {
        this.ctx.moveTo(i * this.size, 0);
        this.ctx.lineTo(i * this.size, this.height);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
    this.ctx.fillStyle = this.ratioPlayground.goodRatio() ? "blue" : "gold";
    if (this.frame >= 0) {
        var cursorX = (this.frame * this.size) % this.width;
        var cursorY = Math.floor((this.frame * this.size) / this.width) * this.size;
        this.ctx.fillRect(cursorX, cursorY, this.size, this.size);
        this.frame++;
        this.frame %= this.ratioW * this.ratioH;
    }
};

Grid.prototype.toggleAnimation = function() {
    this.animationInterval = this.animationInterval ?
        clearInterval(this.animationInterval) :
        setInterval(this.draw.bind(this), 100);
    this.frame = this.animationInterval ? 0 : -1;
    this.draw();
};

Grid.prototype.destruct = function() {
    clearInterval(this.animationInterval);
};