import aws from "aws-sdk";
import routes from "./routers";
import {    
    getMaindata,
    getLatestTransactionsData,
    getLatestBlocksData
} from './controllers/apiController.js';

getData();

setInterval(() => {
    getData();
}, 1000 * 4);

function getData() {   
    getMaindata();  
    getLatestTransactionsData();
    getLatestBlocksData();
};

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_PRIVATE_KEY,
    region: "ap-northeast-1"
});

/* 데이터 전역 관리 */
export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Start NodeJS";
    res.locals.routes = routes;                 // 서버단과 프론트단에서 routes 정보를 locals에 저장 후 함께 사용한다.
    res.locals.loggedUser = req.user || null;   // 사용자 정보를 locals에 저장 후 프론트 단에서 사용한다.
    next();
};

export const onlyPublic = (req, res, next) => {
    if (req.user) {
        res.redirect(routes.dashboard);
    } else {
        next();
    };
};

export const onlyPrivate = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect(routes.home);
    };
};