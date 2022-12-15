module.exports.CMD_ENCODING = {
    encoding: 'utf8'
};

module.exports.DB_TEST_MODE = true;
module.exports.DB_TEST_MODE_DROP = true;

// VM true? 1, false? 0
module.exports.IS_VM = 1;

module.exports.TEST_HW_INO = {
    CPU: "Test CPU",
    MEMSIZE: 8,
    MEMSPEED: 1200
};

// IP Control
module.exports.IP_ASSIGN = {
    CTRL: 0,
    DATA: 0,
    REPL: 0
};

module.exports.DB_TEST_MODE = false;

// ISAG URL
// module.exports.ISAG_URL = "192.168.10.202"
const ISAG_URL = "api.finlscan.org";
// module.exports.ISAG_URL = "http://purichain.com"

module.exports.ISAG_CONFIG = {
    family: 4,
    host: ISAG_URL,
    port: '3000',
    json: true,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
};

// FBN URL
// module.exports.ISAG_URL = "192.168.10.202"
const FBN_URL = "api.finlscan.org";
// module.exports.FBN_URL = "http://purichain.com"

module.exports.FBN_CONFIG = {
    family: 4,
    host: FBN_URL,
    port: '4000',
    json: true,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
};

// User CLI URL
const USER_CLI_URL = "127.0.0.1"

module.exports.USER_CLI_CONFIG = {
    family: 4,
    host: USER_CLI_URL,
    port: '3000',
    json: true,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
};
