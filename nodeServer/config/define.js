const config = require('./../config/config.js');

// Define
const ENABLED = true;
const DISABLED = false;

module.exports.ERR_CODE = {
    ERROR: -1,
    SUCCESS: 1
};

module.exports.NODE_ROLE = {
    STR: {
        NN: 'NN',
        DN: 'DN',
        DBN: 'DBN',
        SCA: 'SCA',
        ISAG: 'ISAg',
        RN: 'RN',
        BN: 'BN'
    },
    NUM: {
        NN: 0,
        // DN: 1,
        DBN: 2,
        ISAG: 4
    },
};

module.exports.CRYPTO_ARG = {
    //
    HASH: 'sha256',
    // digest
    HEX: 'hex',
    BASE64: 'base64',
    //
    EDDSA: 'ed25519'
};

module.exports.SEC_DEFINE = {
    HASH_ALGO: "sha256",
    DIGEST: {
        HEX: 'hex',
        BASE64: 'base64',
    },
    PUBLIC_KEY_LEN: 66,
    CURVE_NAMES: {
        ECDH_SECP256R1_CURVE_NAME: "prime256v1",
        ECDH_SECP256K1_CURVE_NAME: "secp256k1",
        EDDSA_CURVE_NAME: "ed25519",
        ECDSA_SECP256K1_CURVE_NAME: "secp256k1",
        ECDSA_SECP256R1_CURVE_NAME: "p256"
    },
    KEY_DELIMITER: {
        START_INDEX: 0,
        END_INDEX: 2,
        DELIMITER_LEN: 2,
        SECP256_COMPRESSED_EVEN_DELIMITER: "02",
        SECP256_COMPRESSED_ODD_DELIMITER: "03",
        SECP256_UNCOMPRESSED_DELIMITER: "04",
        ED25519_DELIMITER: "05",
    },
    SIGN: {
        R_START_INDEX: 0,
        R_LEN: 64,
        S_START_INDEX: 64,
        S_END_INDEX: 64
    },
    SIG_KIND: {
        ECDSA: "ECDSA",
        EDDSA: "EDDSA"
    },
    CONVERT_KEY: {
        COMPRESSED: "compressed",
        UNCOMPRESSED: "uncompressed"
    },
    KEY_PURPOSE: {
        NET: "net",
        WALLET: "wallet"
    }
};

module.exports.CMD = {
    encoding: 'utf8'
};

module.exports.START_MSG = "=================================================="
    + "\n= FINL Block Chain                               ="
    + "\n= [ testCLI Ver : " + config.VERSION_INFO + "]                              ="
    + "\n==================================================";

module.exports.REGEX = {
    'NEW_LINE_REGEX': /\n+/,
    'WHITE_SPACE_REGEX': /\s/,
    'IP_ADDR_REGEX': /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/,
    'HASH_REGEX': /^[a-z0-9+]{5,65}$/,
    'HEX_STR_REGEX': /^[a-fA-F0-9]+$/,
    'FINL_ADDR_REGEX': /^(FINL){1}[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{1, }$/,
    'PURE_ADDR_REGEX': /^(PURE){1}[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{1, }$/
};

module.exports.COMMON_DEFINE = {
    PADDING_DELIMITER: {
        FRONT: 0,
        BACK: 1
    },
    ENABLED: ENABLED,
    DISABLED: DISABLED
};

module.exports.DB_DEFINE = {
    HEX_DB_KEY_LEN: {
        KEY_NUM_LEN: 12,
        KEY_INDEX_LEN: 4,
        DB_KEY_LEN: 16
    },
};

module.exports.P2P_DEFINE = {
    P2P_SUBNET_ID_IS: '0001',
    P2P_ROOT_SPLIT_INDEX: {
        START: 10,
        END: 14
    },
    P2P_TOPIC_NAME_SPLIT_INDEX: {
        START: 2,
        END: 14
    }
};
