const fs = require( 'fs')
const path = require( 'path')
const routes = require( './../../routers') 
module.exports.fsFun = dir => fs.exists(dir)
module.exports.fs

/* 에러 핸들러 */
module.exports. errorHandler = (req, res, err) => {
    errMsgLogForm(req, res, err);
    res.render("error", { 
        pageTitle: "Error", 
        code: res.statusCode,
        layout: 'layouts/main-public' 
    });
}

/* 에러 로그 FORM */
const errMsgLogForm = (req, res, err) => {
    console.log("======================= [ ERROR start ] =======================")
    console.log(` * URL   : ${req.url}`)
    console.log(` * CODE  : ${res.statusCode}`)
    console.log(` * ERROR : ${err}`)
    console.log("======================= [ ERROR   end ] =======================")
};

/* 파일 확장자 추출 */
module.exports.getFileExtName = (fileName) => {
    const fileLen = fileName.length;
    const lastDot = fileName.lastIndexOf('.');
    const fileExt = fileName.substring(lastDot, fileLen).toLowerCase();
    return fileExt;
}