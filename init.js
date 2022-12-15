// import "@babel/polyfill";
import app from "./app";
import dotenv from "dotenv";
import './public/js/globalData.js';

dotenv.config();  // .env 파일에서 변수를 load
const PORT = '18091';
console.log("PORT:"+PORT)
const handleListening = () => console.log(`✅  Listening on: http://203.238.181.134:${PORT}`);

app.listen(PORT, handleListening);
