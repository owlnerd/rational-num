class NotInstanceOfRationalError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "NotInstanceOfRationalError";
  }
}
class ZeroDenominatorError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "ZeroDenominatorError";
  }
}
class NotIntegerError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "NotIntegerError";
  }
}
class NotPositiveIntegerError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "NotPositiveIntegerError";
  }
}
class NotNumberError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "NotNumberError";
  }
}
class RationalNumFormatError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "RationalNumFormatError";
  }
}



class Rational {



  /*
   * --------------------------------------------------
   * MAIN CONSTRUCTOR
   * Should not be used. Use factory functions instead.
   * --------------------------------------------------
  */
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



  static verifyRationalArgument(arg, m) {
    if (!(arg instanceof Rational))
      throw new NotInstanceOfRationalError(
        "agrument to '" + m + "' not Rational"
      );
  }



  /*
   * -------------------------------------
   * BASIC CONSTRUCTOR FACTORY FUNCTION
   * EXAMPLES:
   *   let a = Rational.construct(3, 5);
   *   let b = Rational.construct(1, 2);
   *   let c = Rational.construct(0, 1);
   * -------------------------------------
  */
  static construct(a, b) {
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      throw new NotIntegerError("arguments to 'construct' not integers")
    }
    if (b === 0) {
      throw new ZeroDenominatorError(
        "zero denominator - second argument to 'construct' is zero"
      );
    }
    return new Rational(a, b);
  }



  /*
   * -------------------------------------------
   * GCD (greatest common divisor) STATIC METHOD
   * -------------------------------------------
  */
  static gcd(a, b) {
    while (b != 0) {
      let tmp = b;
      b = a % b;
      a = tmp;
    }
    return a < 0 ? -a : a;
  }



  /*
   * -----------------------------------------
   * LCM (least common multiple) STATIC METHOD
   * -----------------------------------------
  */
  static lcm(a, b) {
    let gcd = Rational.gcd(a, b);
    // this is 100% valid and will result with integer as gcd(a,b)|a
    return (a / gcd) * b;
  }



  /*
   * ----------------------------------------------------------------
   * RNDFRAC METHOD
   * Generates a random fraction (real fraction, not a mixed number).
   * Generated fraction will be in the form:
   *   [0, p-1] / [1, p]
   * ----------------------------------------------------------------
  */
  static rndFrac(p = 100) {
    if (!Number.isInteger(p) || p < 1)
      throw new NotPositiveIntegerError(
        "argument to 'rndFrac' not positive integer"
      );
    let d = Math.floor(Math.random() * p) + 1;
    let n = Math.floor(Math.random() * d);
    return Rational.construct(n, d);
  }



  /*
   * ------------------------------------
   * REDUCES THE FRACTION (normalizes it)
   * ------------------------------------
  */
  static reduce(r) {
    Rational.verifyRationalArgument(r, "reduce");
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



  /*
   * -------------------------------------
   * RETURNS A NEGATIVE OF PASSED ARGUMENT
   * -------------------------------------
  */
  static negate(r) {
    Rational.verifyRationalArgument(r, "negate");
    return Rational.construct(-r.a, r.b);
  }



  /*
   * --------------------
   * NEGATES THE ARGUMENT
   * --------------------
  */
  static negatein(r) {
    r.a = -r.a;
  }



  /*
   * ----------------------------------------------------------
   * CONSTRUCTOR FACTORY FUNCTION
   * Creates Rational number object from passed decimal number.
   * EXAMPLES:
   *   - let a = Rational.dtof(1.8);
   *   - let b = Rational.dtof(0.125);
   *   - let c = Rational.dtof(15);
   *   - let d = Rational.dtof(.95);
   * ----------------------------------------------------------
  */
  static dtof(d) {
    if (typeof d != "number")
      throw new NotNumberError("argument to 'dtof' not a number");
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



  /*
   * --------------------------------------------------------------------
   * CONSTRUCTOR FACTORY FUNCTION
   * Creates a Rational number object from passed string
   * EXAMPLES:
   *   - let a = Rational.stof("2/3");
   *   - let b = Rational.stof("-  2/  3");
   *   - let c = Rational.stof("+2/ -    3");
   * --------------------------------------------------------------------
  */
  static stof(s) {
    let sliced = /^\s*([+-]?)\s*(\d+)\s*\/\s*([+-]?)\s*(\d+)\s*$/.exec(s);
    if (!sliced)
      throw new RationalNumFormatError(
        "argument to 'stof' incorrectly formatted"
      );
    let a = sliced[1] == "-" ? -Number(sliced[2]) : Number(sliced[2]);
    let b = sliced[3] == "-" ? -Number(sliced[4]) : Number(sliced[4]);
    return Rational.construct(a, b);
  }



  /*
   * --------------------------------------------------------------------
   * CONSTRUCTOR FACTORY FUNCTION
   * Creates a Rational number object from anything compatible. Takes an
   * optional second argument.
   * EXAMPLES:
   *   let a = Rational.create("1.25");
   *   let b = Rational.create(0.05);
   *   let c = Rational.create("5/-3");
   *   let d = Rational.create("1/2", 0.125);
   *   let e = Rational.create("3.5", "-2/3");
   * --------------------------------------------------------------------
  */
  static create(arg1, arg2 = null) {
    if (arg2 !== null) {
      let r1;
      let r2;

      if (isNaN(arg1))
        r1 = Rational.stof(arg1);
      else
        r1 = Rational.dtof(Number(arg1));
      if (isNaN(arg2))
        r2 = Rational.stof(arg2);
      else
        r2 = Rational.dtof(Number(arg2));

      if (!(r1 instanceof Rational) || !(r2 instanceof Rational))
        return NaN;
      return r1.div(r2);
    }

    return !isNaN(arg1) ? Rational.dtof(Number(arg1)) :
                          Rational.stof(arg1);
  }



  /*
   * ----------------------------------------------------------------
   * FRACTIONAL NUMBERS CALCULATIONS METHODS
   * Most methods have two versions: fruitful and in place
   * All inplace methods are suffixed by "in"
   * EXAMPLES:
   *   let a = Rational.create("1/2");
   *   let b = Rational.create("1/4");
   *   let c = a.add(b);
   *   console.log(`a: ${a} , c: ${c}`);  (output)=> a: 1/2 , c: 3/4
   *   a.addin(b);
   *   console.log(`a: ${a} , c: ${c}`);  (output)=> a: 3/4 , c: 3/4
   * ----------------------------------------------------------------
  */

  /*
   * --------
   * ADDITION
   * --------
  */
  add(r) {
    Rational.verifyRationalArgument(r, "add");
    let d = Rational.lcm(this.b, r.b);
    return Rational.construct(this.a * (d / this.b) + r.a * (d / r.b), d);
  }
  addin(r) { // in place addition
    Rational.verifyRationalArgument(r, "addin");
    let d = Rational.lcm(this.b, r.b);
    this.a = this.a * (d / this.b) + r.a * (d / r.b);
    this.b = d;
    Rational.reduce(this);
  }

  /*
   * -----------
   * SUBTRACTION
   * -----------
  */
  sub(r) {
    return this.add(Rational.negate(r));
  }
  subin(r) {
    this.addin(Rational.negate(r));
    Rational.reduce(this);
  }

  /*
   * --------------
   * MULTIPLICATION
   * --------------
  */
  mul(r) {
    Rational.verifyRationalArgument(r, "mul");
    return Rational.construct(this.a * r.a, this.b * r.b);
  }
  mulin(r) {
    Rational.verifyRationalArgument(r, "mulin");
    this.a *= r.a;
    this.b *= r.b;
    Rational.reduce(this);
  }

  /*
   * --------
   * DIVISION
   * --------
  */
  div(r) {
    Rational.verifyRationalArgument(r, "div");
    return this.mul(r.reciprocal());
  }
  divin(r) {
    Rational.verifyRationalArgument(r, "divin");
    this.mulin(r.reciprocal());
    Rational.reduce(this);
  }

  /*
   * ----------------------
   * MULTIPLICATIVE INVERSE
   * ----------------------
  */
  inv() {
    return Rational.construct(this.b, this.a);
  }
  invin() {
    let tmp = this.a;
    this.a = this.b;
    this.b = tmp;
    Rational.reduce(this);
  }

  /*
   * ----------------
   * ADDITIVE INVERSE
   * ----------------
  */
  opposite() {
    return Rational.negate(this);
  }
  oppositein() {
    Rational.negatein(this);
  }

  /*
   * --------------------------------------------------
   * RECIPROCAL VALUE -- SAME AS MULTIPLICATIVE INVERSE
   * --------------------------------------------------
  */
  reciprocal() {
    return this.inv();
  }
  reciprocalin() {
    this.invin();
  }

  /*
   * ----------------------------------------------------
   * POWER -- CURRENTLY SUPPORTING ONLY INTEGER EXPONENTS
   * ----------------------------------------------------
  */
  pow(p) {
    if (!Number.isInteger(p))
      throw new NotIntegerError ("argument to 'pow' not an integer");
    if (p < 0) {
      return Rational.construct(Math.pow(this.b, -p), Math.pow(this.a, -p));
    }
    return Rational.construct(Math.pow(this.a, p), Math.pow(this.b, p));
  }

  /*
   * ----------------------------
   * ROUNDING TO NEAREST FRACTION
   * ----------------------------
  */
  round(d) {
    if (!Number.isInteger(d)) {
      throw new NotIntegerError("argument to 'round' not integer");
    }
    if (d === 0) {
      throw new ZeroDenominatorError(
        "zero denominator - argument to 'round' is zero"
      );
    }
    return Rational.construct(Math.round((this.a * d) / this.b), d);
  }
  roundin(d) {
    if (!Number.isInteger(d)) {
      throw new NotIntegerError("argument to 'roundin' not integer");
    }
    if (d === 0) {
      throw new ZeroDenominatorError(
        "zero denominator - argument to 'roundin' is zero"
      );
    }
    this.a = Math.round((this.a * d) / this.b);
    this.b = d;
  }



  /*
   * -------------------
   * COMPARATION METHODS
   * -------------------
  */
  cmp(r) {
    Rational.verifyRationalArgument(r, "cmp");
    let lcm = Rational.lcm(this.b, r.b);
    let cmp = this.a * (lcm / this.b) - r.a * (lcm / r.b);
    return cmp != 0 ? (cmp < 0 ? -1 : 1) : 0;
  }

  eq(r) {
    Rational.verifyRationalArgument(r, "eq");
    return this.cmp(r) == 0 ? true : false;
  }

  isGreater(r) {
    Rational.verifyRationalArgument(r, "isGreater");
    return this.cmp(r) > 0 ? true : false;
  }

  isGreaterOrEqual(r) {
    Rational.verifyRationalArgument(r, "isGreaterOrEqual");
    return this.isGreater(r) || this.eq(r);
  }

  isLess(r) {
    Rational.verifyRationalArgument(r, "isLess");
    return this.cmp(r) < 0 ? true : false;
  }

  isLessOrEqual(r) {
    Rational.verifyRationalArgument(r, "isLessOrEqual");
    return this.isLess(r) || this.eq(r);
  }

  val() {
    return this.a / this.b;
  }



  /*
   * --------------
   * GETTER METHODS
   * --------------
  */
  get sgn() {
    return this.a < 0 ? -1 : 1;
  }

  get whole() {
    let whole = this.a / this.b;
    return whole < 0 ? Math.ceil(whole) : Math.floor(whole);
  }

  get frac() {
    return Rational.construct(this.a % this.b, this.b);
  }

  get num() {
    return this.a;
  }

  get denom() {
    return this.b;
  }



  /*
   * ----------------
   * TO STRING METHOD
   * Returns a string representation of a rational number in fractional form.
   * Accepts an optional boolean argument (defaulting to false). If set to true
   * outputs a fraction in form of mixed number.
   * EXAMPLE:
   *   let a = Rational.create("16/5");
   *   a.toString();  (output)=> "16/5"
   *   a.toString(true);  (output)=> a: "1|1/5"
   * ----------------
  */
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
        let whole = this.whole;
        let rem = whole < 0 ? -(this.a % this.b) : this.a % this.b;
        return whole + "|" + rem + "/" + this.b;
      }
    } else {
      return this.a + "/" + this.b;
    }
  }



  /*
   * -------------------------------------------------------------------------
   * FORMAT METHOD
   * Returns a string formatted according to pattern string passed as the
   * argument. Function uses following template elements in order to insert
   * the values of the Rational class instance:
   *   - {{S}}  - inserts "-" if the fraction is negative, inserts empty string
   *              if the number is positive.
   *   - {{S+}} - inserts "-" if the fraction is negative, inserts "+" if the
   *              fraction is positive (or zero).
   *   - {{M}}  - inserts the number of whole parts in case of a mixed number.
   *   - {{N}}  - inserts the numerator value.
   *   - {{D}}  - inserts the denominator value.
   * -------------------------------------------------------------------------
  */
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



//module.exports = Rational;