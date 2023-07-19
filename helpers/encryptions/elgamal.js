class ElgamalEncryption {
    constructor() {
        this.Alphabet = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ \nπ®ƒ©∆";
        this.Alphabet = this.Alphabet.split("");
        this.hash = this.algorithm(this.Alphabet, 69);
        this.hashKey = this.algorithm(this.Alphabet, 69);
    }


    async encryptData(data) {
        return {
            hashed: this.hash.encrypt(data, this.hashKey.pubKey),
            func: this.hashKey
        };
    }


    async decryptData(func, data) {
        return func.decrypt(data);
    }

    algorithm(alpha, gen, C) {
        try {
            let p, B, encrypt, decrypt, f, g, modInv, modPow, toAlpha, to10;
            toAlpha = function (x) {
                let y, p, l, n;
                if (x === 0) {
                    return "!!!!";
                }
                y = [];
                n = 4;
                n = Math.ceil(n);
                while (n--) {
                    p = Math.pow(alpha.length, n);
                    l = Math.floor(x / p);
                    y.push(alpha[l]);
                    x -= l * p;
                }
                y = y.join("");
                return y;
            };
            to10 = function (x) {
                let y, p, n;
                y = 0;
                p = 1;
                x = x.split("");
                n = x.length;
                while (n--) {
                    y += alpha.indexOf(x[n]) * p;
                    p *= alpha.length;
                }
                return y;
            };
            modInv = function (gen, mod) {
                let v, d, u, t, c, q;
                v = 1;
                d = gen;
                t = 1;
                c = mod % gen;
                u = Math.floor(mod / gen);
                while (d > 1) {
                    q = Math.floor(d / c);
                    d = d % c;
                    v = v + q * u;
                    if (d) {
                        q = Math.floor(c / d);
                        c = c % d;
                        u = u + q * v;
                    }
                }
                return d ? v : mod - u;
            };
            modPow = function (base, exp, mod) {
                let c, x;
                if (exp === 0) {
                    return 1;
                } else if (exp < 0) {
                    exp = -exp;
                    base = modInv(base, mod);
                }
                c = 1;
                while (exp > 0) {
                    if (exp % 2 === 0) {
                        base = (base * base) % mod;
                        exp /= 2;
                    } else {
                        c = (c * base) % mod;
                        exp--;
                    }
                }
                return c;
            };
            p = 91744613;
            C = parseInt(C, 10);
            if (isNaN(C)) {
                C = Math.round(Math.sqrt(Math.random() * Math.random()) * (p - 2) + 2);
            }
            B = modPow(gen, C, p);
            decrypt = function (a) {
                let d, x, y;
                x = a[1];
                y = modPow(a[0], -C, p);
                d = (x * y) % p;
                d = Math.round(d) % p;
                return alpha[d - 2];
            };
            encrypt = function (key, d) {
                let k, a;
                k = Math.ceil(Math.sqrt(Math.random() * Math.random()) * 1E10);
                d = alpha.indexOf(d) + 2;
                a = [];
                a[0] = modPow(key[1], k, key[0]);
                a[1] = (d * modPow(key[2], k, key[0])) % key[0];
                return a;
            };
            f = function (message, key) {
                let n, x, y, w;
                y = [];
                message = message.split("");
                n = message.length;
                while (n--) {
                    x = encrypt(key, message[n]);
                    y.push(toAlpha(x[0]));
                    y.push(toAlpha(x[1]));
                }
                y = y.join("");
                return y;
            };
            g = function (message) {
                let n, m, d, x;
                m = [];
                n = message.length / 8;
                while (n--) {
                    x = message[8 * n + 4];
                    x += message[8 * n + 5];
                    x += message[8 * n + 6];
                    x += message[8 * n + 7];
                    m.unshift(x);
                    x = message[8 * n];
                    x += message[8 * n + 1];
                    x += message[8 * n + 2];
                    x += message[8 * n + 3];
                    m.unshift(x);
                }
                x = [];
                d = [];
                n = m.length / 2;
                while (n--) {
                    x[0] = m[2 * n];
                    x[1] = m[2 * n + 1];
                    x[0] = to10(x[0]);
                    x[1] = to10(x[1]);
                    d.push(decrypt(x));
                }
                message = d.join("");
                return message;
            };
            return {
                pubKey: [p, gen, B],
                priKey: C,
                decrypt: g,
                encrypt: f
            };
        } catch (err) {
            this.onError(err);
            return false;
        }
    }

    onError(error) {
        console.log(`An error occurred: ${error}`);
    }
}

module.exports = ElgamalEncryption; 