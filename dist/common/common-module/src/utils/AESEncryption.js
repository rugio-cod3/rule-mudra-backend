function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
import * as crypto from "crypto";
import { config } from "@/config.server";
import * as uuid from "uuid";
export function generateUniqueId() {
    return uuid.v1().replace(/-/g, "").substring(0, 16);
}
export function getBase64Payload(payload) {
    return Buffer.from(payload).toString("base64");
}
export function aes256cbcDecryption(key, initVector, encryptedString) {
    var aes256Key = crypto.createDecipheriv("aes-256-cbc", key, initVector);
    var aes256DecryptedKey = aes256Key.update(encryptedString);
    return Buffer.concat([
        aes256DecryptedKey,
        aes256Key.final()
    ]).toString("utf8");
}
export function generateSHA512Hash(input, key) {
    return crypto.createHmac("sha3-512", key).update(input).digest();
}
export function getBase64DecodedValue2(payload) {
    return Buffer.from(payload, "base64");
}
export function getDecryptedValue(base64Data) {
    if (!base64Data) return undefined;
    var input = Buffer.from(base64Data, "base64");
    var base64EncryptionKey1 = getBase64DecodedValue2(config.lenderEncryptionKey);
    var iv = input.slice(0, 16); // First 16 bytes = IV
    var encryptAES256CBCValue = input.slice(16); // Remaining = Encrypted data
    var decryptedValue = aes256cbcDecryption(base64EncryptionKey1.slice(0, 32), iv, encryptAES256CBCValue);
    return decryptedValue;
}
export function getEncryptedValue(input) {
    if (!input) return undefined;
    var base64EncryptionKey1 = getBase64DecodedValue2(config.lenderEncryptionKey);
    var uniqueId = Buffer.from(generateUniqueId()); // Assuming a 16-byte IV
    var encryptAES256CBCValue = aes256cbcEncryption(base64EncryptionKey1.slice(0, 32), uniqueId, Buffer.from(input));
    var output = Buffer.concat([
        uniqueId,
        encryptAES256CBCValue
    ]);
    return output.toString("base64");
}
export function aes256cbcEncryption(key, initVector, value) {
    var aes256Key = crypto.createCipheriv("aes-256-cbc", key, initVector);
    var aes256EncryptedKey = aes256Key.update(value);
    return Buffer.concat([
        aes256EncryptedKey,
        aes256Key.final()
    ]);
}
export function getEncryptedObject(inputObject) {
    for(var key in inputObject){
        var value = inputObject[key];
        if (typeof value === 'string' || typeof value === 'number') {
            inputObject[key] = getEncryptedValue(value.toString());
        } else if ((typeof value === "undefined" ? "undefined" : _type_of(value)) === 'object' && value !== null) {
            inputObject[key] = getEncryptedObject(value);
        }
    }
    return inputObject;
}
export function getDecryptedObject(inputObject) {
    var decryptedObject = {};
    for(var key in inputObject){
        var value = inputObject[key];
        if (typeof value === 'string') {
            decryptedObject[key] = getDecryptedValue(value);
        } else if ((typeof value === "undefined" ? "undefined" : _type_of(value)) === 'object' && value !== null) {
            decryptedObject[key] = getDecryptedObject(value); // Recursively decrypt nested objects
        } else {
            decryptedObject[key] = value; // Leave other types untouched
        }
    }
    return decryptedObject;
}

//# sourceMappingURL=AESEncryption.js.map