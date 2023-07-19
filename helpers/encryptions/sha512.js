const crypto = require('crypto');

class Sha512Encryption {
    constructor() {
        this.key = crypto.randomBytes(32);
        this.algorithm = 'sha512';
    }

    async encryptData(text) {
        try {
            let value = crypto.createHmac(this.algorithm, this.key).update(text).digest('hex')
            return value;
        } catch (err) {
            this.onError(err);
            return false;
        }
    }

    async decryptData(text, hash) {
        try {
            let value = await this.encryptData(text);
            return value === hash ? true : false;
        } catch (err) {
            this.onError(err);
            return false;
        }
    }

    onError(error) {
        console.log(`An error occurred: ${error}`);
    }
}

module.exports = Sha512Encryption; 