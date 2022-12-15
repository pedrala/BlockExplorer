function replace (str) {
    return str.replace(/\n/g, "");
}

function slice (str) {
    return str.slice(1);
}

const REGEX = {
    'NEW_LINE_REGEX': /\n+/,
    'WHITE_SPACE_REGEX': /\s/,
    'IP_ADDR_REGEX': /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/,
    'HASH_REGEX': /^[a-z0-9+]{5,65}$/,
    'HEX_STR_REGEX': /^[a-fA-F0-9]+$/,
    // 'PW_STRONG_REGEX' : /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    // 'PW_STRONG_REGEX' : /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[\s(|])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    'PW_STRONG_REGEX': /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    'PW_MEDIUM_REGEX': /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
    'FINL_ADDR_REGEX': /^(FINL){1}[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{1, }$/,
    'PURE_ADDR_REGEX': /^(PURE){1}[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{1, }$/,
    'EMAIL_CHECK_REGEX': /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/
}
