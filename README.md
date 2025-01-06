# FinlChain

## Capture

finlscan_be

## Version Info

```console
Ubuntu 18.04.6 LTS* (lsb_release -a)
Node JS  v14.19.1*
Pm2      v5.2.0*
```
## Installed Path
```console
/home/finl/finlchain/web/service/finl_v1/mainnet
```
## Install Node Module 
```console
npm i
```

## How to install globally
(pm2 먼저 설치후 바벨 설치해야 함) 
```console
npm i pm2 -g 
npm i @babel/core@7.12.17
npm i @babel/node@7.12.17
npm i @babel/polyfill@7.8.3
npm i @babel/preset-env@7.12.17

npm i babel-cli -g
```
## How to execute
```console
npm run-script start (서버시작 코드수정불가)
npm run-script restart (서버 재시작 코드 수정불가)
npm run-script dev-start (서버 시작 watch mode 코드수정 가능)
npm run-script dev-restart (서버재시작 watch mode 코드수정 가능)
```
## URL
http://www.finlscan.org


