const crypto = require('crypto');

class AesEncryption {
    constructor() {
        this.secretKey = process.env.SECRET_STRING;
        this.algorithm = 'aes-256-ctr';
    }

    async encryptData(text) {
        try {
            const iv = crypto.randomBytes(16)
            const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv)
            const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
            return {
                iv: iv.toString('hex'),
                content: encrypted.toString('hex')
            }
        } catch (err) {
            this.onError(err);
            return false;
        }
    }

    async decryptData(hash) {
        try {
            const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, Buffer.from(hash.iv, 'hex'))
            const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])
            return decrpyted.toString()
        } catch (err) {
            this.onError(err);
            return false;
        }
    }

    onError(error) {
        console.log(`An error occurred: ${error}`);
    }
}

module.exports = AesEncryption; 