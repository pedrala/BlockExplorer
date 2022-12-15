function errorMessagesSwich  (errorCode) {
    switch (errorCode) {
        case 1000:return '<div style="color:red";>Please check your email format. ex)userId@gmail.com</div>';
        case 1001:return '<div style="color:blue";>Email format available.</div>';
        case 1002:return '<div style="color:red";>Plheck your password format. ex)abcD12343@$</div>';
        case 1003:return '<div style="color:blue";>Password format available.</div>';
        case 1004:return '<div style="color:red";>There is no input value. ex)userId@gmail.com</div>';
        case 1005:return '<div style="color:red";>There is no input value. ex)userId@gmail.com</div>';
        case 1006:return '<div style="color:red";>Please check your email format. ex)userId@gmail.com</div>';
        case 1007:return '<div style="color:red";>Please check your password format. ex)abcD12343@$</div>';
        case 1008:return '<div style="color:red";>Password mismatch.';
        case 1009:return '<div style="color:blue";>Password Match.</div>';
    };
};