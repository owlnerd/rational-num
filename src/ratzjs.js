class Rational {



  // MAIN CONSTRUCTOR | SHOULD NOT BE USED! USE FACTORY FUNCTIONS INSTEAD!
  // ---------------------------------------------------------------------
  constructor(a, b) {
    this.a = a / Rational.gcd(a, b);
    this.b = b / (a / this.a);
    if ((this.a < 0 && this.b < 0) || (this.a > 0 && this.b < 0)) {
      this.a = -this.a;
      this.b = -this.b;
    }
    if (this.a === 0) {
      this.b = 1;
    }
  }



  // BASIC CONSTRUCTOR FACTORY FUNCTION
  // EXAMPLES:
  //   - let a = Rational.construct(3, 5);
  //   - let b = Rational.construct(1, 2);
  //   - let c = Rational.construct(0, 1);
  // -------------------------------------
  static construct(a, b) {
    if (b === 0) {
      console.log("ERROR! DENOMINATOR CANNOT BE ZERO");
      return NaN;
    }
    return new Rational(a, b);
  }



  // GCD (greatest common divisor) STATIC METHOD
  // -------------------------------------------
  static gcd(a, b) {
    while (b != 0) {
      let tmp = b;
      b = a % b;
      a = tmp;
    }
    return a < 0 ? -a : a;
  }



  // LCM (least common multiple) STATIC METHOD
  // -----------------------------------------
  static lcm(a, b) {
    let gcd = Rational.gcd(a, b);
    return (a / gcd) * b;
  }



  // GENERATES A RANDOM FRACTION WITH DENOMINATOR IN GIVEN RANGE
  // GENERATED FRACTION WILL BE in the form:
  //   (0, p-1)/(1, p)
  // -----------------------------------------------------------
  static rndFrac(p = 100) {
    let d = Math.floor(Math.random() * p) + 1;
    let n = Math.floor(Math.random() * d);
    return Rational.construct(n, d);
  }



  // REDUCES THE FRACTION (normalizes it)
  // ------------------------------------
  static reduce(r) {
    let g = Rational.gcd(r.a, r.b);
    r.a /= g;
    r.b /= g;
    if ((r.a < 0 && r.b < 0) || (r.a > 0 && r.b < 0)) {
      r.a = -r.a;
      r.b = -r.b;
    }
    if (r.a === 0) {
      r.b = 1;
    }
  }



  // RETURNS A NEGATIVE OF PASSED ARGUMENT
  // -------------------------------------
  static negate(r) {
    if (!(r instanceof Rational)) return NaN;
    return Rational.construct(-r.a, r.b);
  }


  // NEGATES THE ARGUMENT
  // --------------------
  static negatein(r) {
    r.a = -r.a;
  }



  // CONSTRUCTOR FACTORY FUNCTION | CREATES A RATIOAL NUMBER OBJEST FROM
  // PASSED DECIMAL val.
  // EXAMPLES:
  //   - let a = Rational.decToFrac(1.8);
  //   - let b = Rational.decToFrac(0.125);
  //   - let c = Rational.decToFrac(15);
  //   - let d = Rational.decToFrac(.95);
  // -------------------------------------------------------------------
  static decToFrac(d) {
    if (typeof d != "number") {
      console.log("ERROR! NUMBER REQUIRED");
      return NaN;
    }
    let sign = d < 0 ? 0 : 1;
    let s = Math.abs(d).toString().split(".");
    if (s.length == 1)
      return sign ? Rational.construct(Number(s[0]), 1) :
                    Rational.negate(Rational(Number(s[0]), 1));
    else {
      let r1 = Rational.construct(Number(s[0]), 1);
      let r2 = Rational.construct(Number(s[1]), Math.pow(10, s[1].length));
      return sign ? r1.add(r2) : Rational.negate(r1.add(r2));
    }
  }



  // CONSTRUCTOR FACTORY FUNCTION | CREATES A Rational NUMBER OBJECT FROM
  // PASSED STRING
  // EXAMPLES:
  //   - let a = Rational.strToFrac("2/3");
  //   - let b = Rational.strToFrac("-  2/  3");
  //   - let c = Rational.strToFrac("+2/ -    3");
  // --------------------------------------------------------------------
  static strToFrac(s) {
    let sliced = /^\s*([+-]?)\s*(\d+)\s*\/\s*([+-]?)\s*(\d+)\s*$/.exec(s);
    if (!sliced) {
      console.log("ERROR! INCORRECT STRING FRACTION FORMAT");
      return NaN;
    }
    let a = sliced[1] == "-" ? -Number(sliced[2]) : Number(sliced[2]);
    let b = sliced[3] == "-" ? -Number(sliced[4]) : Number(sliced[4]);
    return Rational.construct(a, b);
  }



  // CONSTRUCTOR FACTORY FUNCTION | CREATES A Rational NUMBER OBJECT FROM
  // ANYTHING COMPATIBLE. TAKES AN OPTIONAL SECOND ARGUMENT.
  // EXAMPLES:
  //   - let a = Rational.create("1.25");
  //   - let b = Rational.create(0.05);
  //   - let c = Rational.create("5/-3");
  //   - let d = Rational.create("1/2", 0.125);
  //   - let e = Rational.create("3.5", "-2/3");
  // --------------------------------------------------------------------
  static create(arg1, arg2 = null) {
    if (arg2 !== null) {
      let r1;
      let r2;

      if (isNaN(arg1)) r1 = Rational.strToFrac(arg1);
      else r1 = Rational.decToFrac(Number(arg1));
      if (isNaN(arg2)) r2 = Rational.strToFrac(arg2);
      else r2 = Rational.decToFrac(Number(arg2));

      if (!(r1 instanceof Rational) && !(r2 instanceof Rational)) return NaN;
      return r1.div(r2);
    }

    if (!isNaN(arg1)) return Rational.decToFrac(Number(arg1));
    else return Rational.strToFrac(arg1);
  }



  // FRACTIONAL NUMBERS CALCULATIONS METHODS
  // MOST METHODS HAVE TWO VERSIONS: FRUITFUL AND IN PLACE
  // ALL IN PLACE METHODS ARE SUFFIXED BY "in"
  // EXAMPLES:
  //   let a = Rational.create("1/2");
  //   let b = Rationsl.create("1/4");
  //   let c = a.add(b);
  //   console.log(`a: ${a} , c: ${c}`);  (output)=> a: 1/2 , c: 3/4
  //   a.addin(b);
  //   console.log(`a: ${a} , c: ${c}`);  (output)=> a: 3/4 , c: 3/4
  // ----------------------------------------------------------------
  add(r) {
    if (!(r instanceof Rational)) return NaN;
    let d = Rational.lcm(this.b, r.b);
    return Rational.construct(this.a * (d / this.b) + r.a * (d / r.b), d);
  }
  addin(r) { // in place addition
    if (!(r instanceof Rational)) return NaN;
    let d = Rational.lcm(this.b, r.b);
    this.a = this.a * (d / this.b) + r.a * (d / r.b);
    this.b = d;
    Rational.reduce(this);
  }

  sub(r) {
    return this.add(Rational.negate(r));
  }
  subin(r) {
    this.addin(Rational.negate(r));
    Rational.reduce(this);
  }

  mul(r) {
    if (!(r instanceof Rational)) return NaN;
    return Rational.construct(this.a * r.a, this.b * r.b);
  }
  mulin(r) {
    if (!(r instanceof Rational)) return NaN;
    this.a *= r.a;
    this.b *= r.b;
    Rational.reduce(this);
  }

  div(r) {
    if (!(r instanceof Rational)) return NaN;
    return this.mul(r.reciprocal());
  }
  divin(r) {
    if (!(r instanceof Rational)) return NaN;
    this.mulin(r.reciprocal());
    Rational.reduce(this);
  }

  inv() {
    return Rational.construct(this.b, this.a);
  }
  invin() {
    let tmp = this.a;
    this.a = this.b;
    this.b = tmp;
    Rational.reduce(this);
  }

  opposite() {
    return Rational.negate(this);
  }
  oppositein() {
    Rational.negatein(this);
  }

  reciprocal() {
    return this.inv();
  }
  reciprocalin() {
    this.invin();
  }

  pow(p) {
    if (p < 0) {
      return Rational.construct(Math.pow(this.b, -p), Math.pow(this.a, -p))
    }
    return Rational.construct(Math.pow(this.a, p), Math.pow(this.b, p));
  }

  cmp(r) {
    if (!(r instanceof Rational)) return NaN;
    let lcm = Rational.lcm(this.b, r.b);
    let cmp = this.a * (lcm / this.b) - r.a * (lcm / r.b);
    return cmp != 0 ? (cmp < 0 ? -1 : 1) : 0;
  }

  eq(r) {
    if (!(r instanceof Rational)) return NaN;
    return this.cmp(r) == 0 ? true : false;
  }

  isGreater(r) {
    if (!(r instanceof Rational)) return NaN;
    return this.cmp(r) > 0 ? true : false;
  }

  isGreaterOrEqual(r) {
    if (!(r instanceof Rational)) return NaN;
    return this.isGreater(r) || this.eq(r);
  }

  isLess(r) {
    if (!(r instanceof Rational)) return NaN;
    return this.cmp(r) < 0 ? true : false;
  }

  isLessOrEqual(r) {
    if (!(r instanceof Rational)) return NaN;
    return this.isLess(r) || this.eq(r);
  }

  val() {
    return this.a / this.b;
  }

  get wholes() {
    return Math.floor(this.a / this.b);
  }

  get fraction() {
    return Rational.construct(this.a % this.b, this.b);
  }

  get num() {
    return this.a;
  }

  get denom() {
    return this.b;
  }



  // TO STRING METHOD
  // ----------------
  toString(mixed = false) {
    if (this.a === 0) {
      return "0";
    } else if (Math.abs(this.a) === Math.abs(this.b)) {
      if (this.a != this.b) return "-1";
      else return "1";
    } else if (this.b === 1) {
      return this.a.toString();
    } else if (mixed) {
      if (Math.abs(this.a) < this.b) {
        return this.a + "/" + this.b;
      } else {
        let whole = this.a / this.b;
        whole = whole < 0 ? Math.ceil(whole) : Math.floor(whole);
        let rem = whole < 0 ? -(this.a % this.b) : this.a % this.b;
        return whole + "|" + rem + "/" + this.b;
      }
    } else {
      return this.a + "/" + this.b;
    }
  }



  // FORMAT METHOD
  // -------------
  format(pattern = "{{S}}[{{M}}]{{N}}/{{D}}") {
    let sgn = this.a < 0 ? "-" : "+";
    let mix = this.a / this.b;
    mix = mix < 0 ? Math.abs(Math.ceil(mix)) : Math.floor(mix);
    let num = /{{M}}/.test(pattern) ? (mix == 0 ? this.a : this.a % this.b) :
                                    this.a;
    if (/{{S}}|{{S\+}}/.test(pattern)) num = Math.abs(num);

    let re = /{{S}}|{{S\+}}|{{M}}|{{N}}|{{D}}/g;
    return pattern.replace(re, match => {
      if (match == "{{S}}") return sgn == "-" ? sgn : "";
      if (match == "{{S+}}") return sgn;
      if (match == "{{M}}") return mix.toString();
      if (match == "{{N}}") return num.toString();
      if (match == "{{D}}") return this.b.toString();
    });
  }
  


} // :~
