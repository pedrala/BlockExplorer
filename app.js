import express from "express";
import expressLayouts from 'express-ejs-layouts';
//import createError from "http-errors";
import morgan from "morgan";                // logger
import helmet from "helmet";                // 보안 취약점 방지
import cookieParser from "cookie-parser";    // cookie 를 다루기 위해 필요 
import bodyParser from "body-parser";       // body 로부터 데이터 접근 가능
import session from "express-session";
import path from "path";
import flash from "express-flash";
import dotenv from "dotenv";
import { localsMiddleware } from './middlewares';
import cors from "cors";

// routes
import routes from "./routers";
//import indexRouter from './routers/index';
import apiRouter from "./routers/apiRouter";
import viewRouter from "./routers/viewRouter.js";

const app = express();

app.use((req, res, next) => {
    const allowedOrigins = [ 'http://www.finlscan.org', 'http://218.38.12.134'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    return next();
  });

dotenv.config();          // .env 파일에서 변수를 load
app.use(helmet());                                  // application 보안
// Set view engine as EJS
app.set('view engine', 'ejs');                      // 템플릿 설정
app.set('views', path.join(__dirname, 'views'));    // view 경로, ejs 파일들을 저장
// express-ejs-layouts setting
app.set('layout', 'layouts/main');      // default layout
app.set('layout extractScripts', true);
app.use(expressLayouts);
app.use('/public', express.static(__dirname + '/public', {}));
app.use('/images', express.static(__dirname + '/public/assets/img', {}));

app.use(cookieParser());
app.use(bodyParser.json());                         // 데이터 전송시 서버가 json 인 것을 알도록
app.use(bodyParser.urlencoded({ extended: true })); // request 정보에서 form이나 json 형태의 body를 검사
app.use(morgan("dev"));
app.use(
    session({
        secret:  'somevalue',//process.env.COOKIE_SECRET,  // 서버에서 session ID 암호화 저장시 사용
        resave: false,                      // 요청하는 동안 세션을 항상 강제 저장 여부
        saveUninitialized: false,           // 초기화하지 않고 스토어에 세션 저장 여부
        cookie: {
            httpOnly: true,
            secure: false,
        }
    })
);
app.use(flash()); // 내부적으로 session을 사용하기 때문에 session 아래에 미들웨어 사용
app.use(localsMiddleware);

//app.use('/', indexRouter);
app.use("/", viewRouter);
app.use("/api", apiRouter);

app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    const status = err.status || 500;
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.locals.status = status;
    res.status(status);
    res.render('error', {
        pageTitle: "Error Page",
        layout: 'layouts/layout-error',
    })     
  });

export default app;