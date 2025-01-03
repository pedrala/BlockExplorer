# FinlChain

## Version Info

```console
Ubuntu 18.04.6 LTS* (lsb_release -a)
Node JS  v14.19.1*
Pm2      v5.2.0*

## 현재 설치된 경로
```console
/home/finl/finlchain/web/service/finl_v1/mainnet
```
## Node Module install
```console
npm i
```

## 전역설치(pm2 먼저 설치후 바벨 설치해야 함) 
```console
npm i pm2 -g 
npm i @babel/core@7.12.17
npm i @babel/node@7.12.17
npm i @babel/polyfill@7.8.3
npm i @babel/preset-env@7.12.17

npm i babel-cli -g
```
## 프로그램 실행
```console
npm run-script start (서버시작 코드수정불가)
npm run-script restart (서버 재시작 코드 수정불가)
npm run-script dev-start (서버 시작 watch mode 코드수정 가능)
npm run-script dev-restart (서버재시작 watch mode 코드수정 가능)
```
## 브라우저 접속
http://www.finlscan.org

## plato 로 소스코드 정적분석하기

### .jshintrc 파일을 다음 내용으로 생성하여 mainnet 폴더안에 둔다.
```console
{	
   "node": true,
   "esversion": 6
}
```
```console
cd mainnet
plato -r -d plato -l .jshintrc -t "FinlScan" controllers
```

## yuidoc 으로 APIcontroller 안의 APIs 도큐먼트로 만들기

### 참고: http://yui.github.io/yuidoc/syntax/index.html

```console
cd controllers
yuidoc .
```
