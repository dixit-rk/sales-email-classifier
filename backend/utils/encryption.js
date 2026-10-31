const crypto = require("crypto");

const getKey = () => {
    const key = Buffer.from(
        process.env.TOKEN_ENCRYPTION_KEY || "",
        "hex"
    );

    if (key.length !== 32) {
        throw new Error("TOKEN_ENCRYPTION_KEY must be 32 bytes");
    }

    return key;
};

const encrypt = (value) => {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
        "aes-256-gcm",
        getKey(),
        iv
    );

    const encrypted = Buffer.concat([
        cipher.update(value, "utf8"),
        cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    return [
        iv.toString("hex"),
        tag.toString("hex"),
        encrypted.toString("hex")
    ].join(":");
};

const decrypt = (value) => {
    const [iv, tag, encrypted] = value.split(":");

    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        getKey(),
        Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(tag, "hex"));

    return Buffer.concat([
        decipher.update(Buffer.from(encrypted, "hex")),
        decipher.final()
    ]).toString("utf8");
};

module.exports = { encrypt, decrypt };