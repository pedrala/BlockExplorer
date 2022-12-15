//import { errorHandler } from "../public/js/common";
import cryptoSsl from "./../../../../../addon/crypto-ssl";
import contract_actions from "../../../../../conf/contract_actions.json";
import fs from 'fs';
import cryptoUtil from "../nodeServer/src/sec/cryptoUtil";
import commonUtil from "../nodeServer/src/utils/commonUtil";
import configs from "../configs/config.json";
import util from "../public/js/utilForController";
import encypto from "../nodeServer/src/sec/encrypto";
import config from "../nodeServer/config/config";
import { captureRejectionSymbol } from "events";
import request from "request";
import moment from "moment";
import Ber from "asn1";
import http from "http";

const url_4000 = configs.webApi4000;

/**
 * @class API collection
 * @constructor
 */

/**
 * Fired when an getMain called at landing page
 * @event getMain
 * @param
 */
export const getMain = async (req, res) => {
    res.send({
        result: global.MAIN_PAGE_TEXT_DATA
    });
};

/**
 * load main page data
 * @event getMaindata
 * @param
 */
export const getMaindata = async () => {
    // console.log("apiController_getMaindata")
    const priceUsd = '';

    const marketSupply = `${url_4000}/account/marketsupply?tAccountAction=0`;
    const tradingVol = `${url_4000}/account/trade/day?tAccountAction=0`;

    const accounts = `${url_4000}/account/list?total`;
    const totalAccountsPerDay = `${url_4000}`;

    const totalBlk = `${url_4000}/block/blkcnt`;
    const totalTxns = `${url_4000}/sc/txs/all?tAccountAction=0`;
    //`${url_4000}/sc/txs/day?tAccountAction=0`;

    const scTxsHistory = `${url_4000}/sc/txs/history?tAccountAction=0&interval=DAY&period=14`;

    let result = {};

    getRequest(accounts).then((d) => {
        if (d.errorCode == 0) {

            // console.log("tAccountTotalCnt:" + d.contents.tAccountTotalCnt)
            // console.log("uAccountTotalCnt:" + d.contents.uAccountTotalCnt)
            // console.log("tAccountTotalCnt24h:" + d.contents.tAccount24hCnt)
            // console.log("uAccountTotalCnt24h:" + d.contents.uAccount24hCnt)
            result.tokenAccounts = d.contents.tAccountTotalCnt;
            result.userAccounts = d.contents.uAccountTotalCnt;
            result.tokenAccounts24h = d.contents.tAccount24hCnt;
            result.userAccounts24h = d.contents.uAccount24hCnt;
        }
    }).catch((err) => {
        console.log('accounts then error : ', err);
    })
        // .then(() => getRequest(usd).then((d) => {
        //     result.usd = d.puriever.usd;
        // })).catch((err) => {
        //     console.log('then error : ', err);
        // })
        .then(() => getRequest(marketSupply).then((d) => {
            if (d.errorCode == 0) {

                //   d.contents.totalSupply = new Intl.NumberFormat().format( d.contents.totalSupply)
                //    d.contents.marketSupply = new Intl.NumberFormat().format( d.contents.marketSupply)           

                //   console.log("totalSupply:" +  Math.trunc(d.contents.totalSupply))
                //   console.log("marketSupply:" +  Math.trunc(d.contents.marketSupply))

                result.marketSupply = Math.trunc(d.contents.marketSupply);
                result.totalVolume = d.contents.totalSupply == 0 ? 'N/A' : Math.trunc(d.contents.totalSupply);
            } else {
                result.marketSupply = 0;
            }
        })).catch((err) => {
            console.log('marketSupply then error : ', err);
        })
        // .then(() => getRequest(usdTether).then((d) => {
        //     result.usdTether = d.tether ? d.tether.usd : 0;
        // })).catch((err) => {
        //     console.log('usdTether then error : ', err);
        // })
        // .then(() => getRequest(maket).then((d) => {
        //     result.marketCap = d.market_data.market_cap.eth == 0 ? 'N/A' : d.market_data.market_cap.eth;
        // })).catch((err) => {
        //     console.log('maket then error : ', err);
        // })
        .then(() => getRequest(tradingVol).then((d) => {
            if (d.errorCode == 0) {
                //    d.contents.tradePerDay = new Intl.NumberFormat().format( d.contents.tradePerDay)               
                //    console.log("tradePerDay:" + Math.trunc(d.contents.tradePerDay))

                result.tradingVol = Math.trunc(d.contents.tradePerDay);
            } else {
                result.tradingVol = 'N/A';
            }
        })).catch((err) => {
            console.log('tradingVol then error : ', err);
        })
        // .then(() => getRequest(maket).then((d) => {
        //     result.totalVolume = d.market_data.market_cap.eth == 0 ? 'N/A' : d.market_data.total_volume.eth;
        // })).catch((err) => {
        //     console.log('then error : ', err);
        // }) 
        .then(() => getRequest(totalBlk).then((d) => {
            if (d.errorCode == 0) {
                //   console.log("totalBlk:" + d.contents.totalBlkCnt)     
                //    console.log("dailyBlk:" + d.contents.totalBlk24hCnt)
                result.totalBlk = d.contents.totalBlkCnt;
                result.dailyBlk = d.contents.totalBlk24hCnt;
            }
        })).catch((err) => {
            console.log('totalBlk then error : ', err);
        })
        .then(() => getRequest(totalTxns).then((d) => {
            if (d.errorCode == 0) {
                //    d.contents.txsCnt = new Intl.NumberFormat().format( d.contents.txsCnt)  
                //   console.log("totalTxns:" + d.contents.txsCnt)
                //   console.log("dailyTxns:" + d.contents.txs24hCnt)
                result.totalTxns = d.contents.txsCnt;
                result.dailyTxns = d.contents.txs24hCnt;
            }
        })).catch((err) => {
            console.log('totalTxns then error : ', err);
        })
        .then(() => getRequest(scTxsHistory).then((d) => {
            // console.log("scTxsHistory:" + JSON.stringify(d.contents.historyList))
            result.scTxsHistory = d.errorCode == 0 ? resetData(d.contents.historyList) : makeData()

            global.MAIN_PAGE_TEXT_DATA = result;
        })).catch((err) => {
            console.log('scTxsHistory then error : ', err);
        });
};

/**
 * format daily transaction data when its data is a null or an error
 * @event makeData
 * @param
 */
function makeData() {
    let result = [];
    const TWO_WEEK = 14;

    for (let i = 0; i < TWO_WEEK; i++) {
        result.push({
            date: moment().subtract(i, 'days').format('MMM DD'),
            ctsCnt: 0
        });
    };

    return result.reverse();
};

/**
 * format daily transaction data
 * @event resetData
 * @param
 */
function resetData(historyList) {
    let result = [];

    for (let i = 0; i < historyList.length; i++) {
        result.push({
            date: moment(historyList[i].sttMs).format('LL').split(',')[0],
            ctsCnt: Number(historyList[i].txsCnt)
        });
    };

    return result.reverse();
};

/**
 * get getLatestBlocks in Block page
 * @event getLatestBlocks
 * @param 
 */
export const getLatestBlocks = async (req, res) => {
    res.send({
        data: global.latestBlocks
    });
};

/**
 * get getLatestBlocksData in Block page
 * @event getLatestBlocksData
 * @param 
 */
export const getLatestBlocksData = async (req, res) => {
    const latestBlocks = `${url_4000}/block/latest?cnt=1000`;
    const confiremdImg = "<img class='category-icon' width='20' height='20' id='confirmed' src='../public/assets/img/confirmed.svg'> CONFIRMED";
    const unconfirmedImg = "<img class='category-icon' width='20' height='20' id='unconfirmed' src='../public/assets/img/unconfirmed.png'> UNCONFIRMED";

    let topData = [];

    try {
        getRequest(latestBlocks).then((d) => {

            let arr = [];
            if (d.errorCode == 0) {
                topData.push(d.contents.latestBlks[0].blk_num);
                for (let i = 0; i < d.contents.latestBlks.length; i++) {
                    const data = d.contents.latestBlks[i];
                    let time = "";
                    time = data.bgt;
                    time = time * 1;
                    moment.relativeTimeThreshold('ss', 0);
                    const tt = moment(time).fromNow();
                    const ttime = `${tt.split(' ')[0]}` + ' ' + `${tt.split(' ')[1]}` + ' ' + `${tt.split(' ')[2]}`;

                    let status = '';
                 
                    if (i < util.bpInfoLength)
                    {
                        status = 'N';
                    } else {
                        status = 'Y';
                    }

                    if (status == 'Y') {
                        status = confiremdImg;
                    }
                    else {
                        status = unconfirmedImg;
                    }

                    const reward = '0'    //data.reward;
                    const burnedFin = '0'    //data.burnedFin;

                    // console.log("time:" + JSON.stringify(time) + "\n");     

                    arr.push(
                        {
                            "blk": util.leftZeroDelet(data.blk_num),
                            "age": ttime,
                            "txCnt": data.tx_cnt,
                            "blkHash": util.ShortenStringFormat(data.blk_hash, 12),
                            "status": status,
                            "reward": reward,
                            "burnedFin": burnedFin,
                            "bp": util.getBpName(data.subnet_id),
                            "time": time,
                            "bpNo": data.subnet_id
                        }
                    );
                };

                //console.log("latestBlock:" + JSON.stringify(arr) + "\n");                   

            };

            global.latestBlocks = arr;
        });

    } catch (error) {
        errorHandler(req, res, error);
    };
};


/**
 * get getLatestTransactions in Transactions page
 * @event getLatestTransactions
 * @param 
 */
export const getLatestTransactions = async (req, res) => {

    res.send({
        data: getLatestTransactionsTableData(global.latestTransactions)
    });
};

/**
 * get LatestTransactionsData in Transactions page
 * @event getLatestTransactionsData
 * @param 
 */
export const getLatestTransactionsData = async (req, res) => {
    // const latestTransactions = `${url_4000}/sc/range?minDK=6918654927547989020&maxDK=6918654927547989030`;
    const latestTransactions = `${url_4000}/sc/latest?cnt=1000`;
    let arr = [];
    try {
        getRequest(latestTransactions).then((d) => {

            if (d.errorCode == 0) {
                for (let i = 0; i < d.contents.latestScTxs.length; i++) {
                    const data = d.contents.latestScTxs[i];

                    //console.log("data:" + JSON.stringify(data) + "\n"); 

                    const type = typeFor(data.action);

                    /*accountNum -> hexa to decimal*/
                    let accountNumHexaFrom = '';
                    let accountNumHexaTo = '';
                    let dstAccountNumHexa = '';
                    accountNumHexaFrom = BigInt(data.from_account).toString('16').toUpperCase();
                    accountNumHexaTo = BigInt(data.to_account).toString('16').toUpperCase();
                    dstAccountNumHexa = BigInt(data.dst_account).toString('16').toUpperCase();

                    let from = '';
                    let to = '';
                    let from_account = '';
                    let to_account = '';

                    let time = ""; 
                    time = data.create_tm;
                    time = time * 1;
                    moment.relativeTimeThreshold('ss', 0);
                    const tt = moment(time).fromNow();
                    const ttime = `${tt.split(' ')[0]}&nbsp${tt.split(' ')[1]}&nbsp${tt.split(' ')[2]}`;         

                    //if c_action != 0, it's a utility token(stable price). So use dst_account as 'to' destination
                    //if c_action == 0, it's a security token(volatie price).
                    if (type == 'TRANSFER') {
                        if (data.c_action != 0) {
                            (dstAccountNumHexa != '0') ? to = dstAccountNumHexa : to = '0000000000000000';
                            to_account = data.dst_account == 0 ? data.dst_account : data.dst_account;
                        }
                        else {
                            (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                            to_account = data.to_account == 0 ? data.to_account : data.to_account;
                        }
                    }
                    else {
                        (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                        to_account = data.to_account == 0 ? data.to_account : data.to_account;
                    }

                    (accountNumHexaFrom != '0') ? from = accountNumHexaFrom : from = '0000000000000000';
                    from_account = data.from_account == 0 ? data.from_account : data.from_account;

                    let sc_hash = data.sc_hash.toUpperCase(); // util.CheckMaxString(data.sc_hash, 6);                    

                    arr.push(
                        {
                            "type": type,
                            "age": ttime, 
                            "blk": util.leftZeroDelet(data.blk_num),
                            "fromAccHexa": from,
                            "toAccHexa": to,
                            "amount": data.amount,//Number.parseFloat(data.amount).toFixed(2),
                            "shortenHash": util.ShortenStringFormat(sc_hash, 12),
                            "bp": util.getBpName(data.subnet_id),
                            "fromAccDecimal": from_account,
                            "toAccDecimal": to_account,
                            "hash": sc_hash,
                            "c_action": data.c_action,
                            "time": time,
                            "bpNo": data.subnet_id
                        }
                    );
                    //  console.log("latestTxns:" + JSON.stringify(arr) + "\n");  


                };
            };

            global.latestTransactions = arr;
        });

    } catch (error) {
        errorHandler(req, res, error);
    }
};

/**
 * get BlocksTotal in Block page
 * @event getBlocksTotal
 * @param 
 */
export const getBlocksTotal = async (req, res) => {
    const blocksTotal = `${url_4000}/block/blkcnt`;

    getRequest(blocksTotal).then((d) => {
        if (d.errorCode == 0) {
            //console.log("blocksTotal:"+ JSON.stringify(d.contents))

            res.send({
                data: d.contents
            });
        }
    }).catch((err) => {
        console.log('blocksTotal then error : ', err);
    });
}


/**
 * get Blk in Blocks page
 * @event getBlk
 * @param req
 */
export const getBlk = async (req, res) => {
    try {
        const { query: { blkNum, hash, blkHash } } = req;
        let url, data;

        if (blkNum) {
            data = blkNum == 0 ? blkNum : blkNum.replace(/(^0+)/, ""); //remove left 0 
            url = `${url_4000}/block/blkinfo?blkNum=${data}`;
        };

        if (hash || blkHash) {
            const value = hash || blkHash
            url = `${url_4000}/block/blkinfo?blkHash=${value}`;
        };

        getRequest(url).then((d) => {
            let result = ''

            if (d.contents.blkInfo != null) {
                //console.log("blockInfo:"+ JSON.stringify(d.contents.blkInfo))
                result = d
            }
            else if (d.contents.res == false) {
                //console.log("blockInfo:"+ JSON.stringify(d.contents.res))
                result = 'error'
            }
            res.send({
                data: result
            });
        });
    } catch (error) {
        errorHandler(req, res, error);
    };
};

/**
 * get Trans in Blocks page
 * @event getTrans
 * @param req
 */
export const getTrans = async (req, res) => {
    const confiremdImg = "<img class='category-icon' width='20' height='20' id='confirmed' src='../public/assets/img/confirmed.svg'> CONFIRMED";
    const unconfirmedImg = "<img class='category-icon' width='20' height='20' id='unconfirmed' src='../public/assets/img/unconfirmed.png'> UNCONFIRMED";

    try {
        const { query: { trans } } = req;
        let url, data;
        let arr = [];

        //console.log("trans:" + JSON.stringify(trans) + "\n");            

        if (trans) {
            data = trans.replace(/(^0+)/, ""); //remove left 0 
            url = `${url_4000}/sc/txs/info?blkNum=${data}&cnt=10`;
        };

        getRequest(url).then((d) => {

            //  console.log("getTrans:" + JSON.stringify(d) + "\n");            

            if (d.errorCode == 0) {
                for (let i = 0; i < d.contents.scTxsInfo.length; i++) {
                    const data = d.contents.scTxsInfo[i];

                    const type = typeFor(data.action);
                    let status = 'Y';
                    if (status == 'Y') {
                        status = confiremdImg;
                    }
                    else {
                        status = unconfirmedImg;
                    }

                    /*accountNum -> hexa to decimal*/
                    let accountNumHexaFrom = '';
                    let accountNumHexaTo = '';
                    accountNumHexaFrom = BigInt(data.from_account).toString('16').toUpperCase();
                    accountNumHexaTo = BigInt(data.to_account).toString('16').toUpperCase();

                    let from = '';
                    let to = '';
                    let from_account = '';
                    let to_account = '';

                    (accountNumHexaFrom != '0') ? from = accountNumHexaFrom : from = '0000000000000000';
                    from_account = data.from_account == 0 ? data.from_account : data.from_account;

                    (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                    to_account = data.to_account == 0 ? data.to_account : data.to_account;

                    const sc_hash = data.sc_hash.toUpperCase();

                    arr.push(
                        {
                            "shortenHash": util.ShortenStringFormat(sc_hash, 12),
                            "blk": util.leftZeroDelet(data.blk_num),
                            "fromAccHexa": util.CheckMaxString(from, 50),
                            "toAccHexa": util.CheckMaxString(to, 50),
                            "type": type,
                            "amount": data.amount,//Number.parseFloat(data.amount).toFixed(2),                         
                            "token": data.c_action,
                            "status": status,
                            "fromAccDecimal": from_account,
                            "toAccDecimal": to_account,
                            "hash": sc_hash
                        }
                    );

                    //console.log("arr:" + JSON.stringify(arr) + "\n");            
                };
            };

            res.send({
                result: arr
            });

        });

    } catch (error) {
        errorHandler(req, res, error);
    };
};

/**
 * get getBpInfo in Transactions page
 * @event getBpInfo
 * @param 
 */
export const getBpInfo = async (req, res) => {
    const txnsIfo = `${url_4000}/sc/txs/cluster?bpInfo`;
    let arr = [];
    try {
        getRequest(txnsIfo).then((d) => {

            //console.log("bpInfo:"+ JSON.stringify(d.contents))            

            res.send({
                result: d.contents
            });
        });

    } catch (error) {
        errorHandler(req, res, error);
    }
};

/**
 * get getBpList in Transactions page
 * @event getBpList
 * @param 
 */
export const getBpList = async (req, res) => {
    const txnsIfo = `${url_4000}/net/hub/list?all`;
    let arr = [];
    // const bpInfo =
    //  [
    //     {
    //         "subnet_id": 1,
    //         "hub_code": 1,
    //         "name": "Tiger",
    //         "latitude": "37.63343",
    //         "longitude": "127.03324",
    //         "country": "KR",
    //         "city": "Seoul",
    //         "hub_p2p_addr": "0x253f7f036004"
    //     },
    //     {
    //         "subnet_id": 1,
    //         "hub_code": 2,
    //         "name": "Vaquita",
    //         "latitude": "37.53323",
    //         "longitude": "126.87421",
    //         "country": "KR",
    //         "city": "Seoul",
    //         "hub_p2p_addr": "0x25357e576008"
    //     }
    // ]
    try {
        getRequest(txnsIfo).then((d) => {

            arr = d.contents.hubInfo;

            res.send({
                result: d.contents
            });

            global.bpList = arr;
            //console.log("bpList:"+ JSON.stringify(global.bpList))       
        });

    } catch (error) {
        errorHandler(req, res, error);
    }
};

/**
 * get TransactionsByBp in Transactions page
 * @event getTransactionsByBp
 * @param {req}
 */
export const getTransactionsByBp = async (req, res) => {

    const { query: { subnetId } } = req;
    //console.log("subnetId:" + JSON.parse(subnetId));  
    let url;
    let arr = [];

    if (subnetId) {
        url = `${url_4000}/sc/latest?cnt=1000&subnetId=${subnetId}`;
    };

    getRequest(url).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.subnetLatestScTxs.length; i++) {
                const data = d.contents.subnetLatestScTxs[i];

                const type = typeFor(data.action);

                /*accountNum -> hexa to decimal*/
                let accountNumHexaFrom = '';
                let accountNumHexaTo = '';
                let dstAccountNumHexa = '';
                accountNumHexaFrom = BigInt(data.from_account).toString('16').toUpperCase();
                accountNumHexaTo = BigInt(data.to_account).toString('16').toUpperCase();
                dstAccountNumHexa = BigInt(data.dst_account).toString('16').toUpperCase();

                let from = '';
                let to = '';
                let from_account = '';
                let to_account = '';

                //if c_action != 0, it's a utility token(stable price). So use dst_account as 'to' destination
                //if c_action == 0, it's a security token(volatie price).
                if (type == 'TRANSFER') {
                    if (data.c_action != 0) {
                        (dstAccountNumHexa != '0') ? to = dstAccountNumHexa : to = '0000000000000000';
                        to_account = data.dst_account == 0 ? data.dst_account : data.dst_account;
                    }
                    else {
                        (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                        to_account = data.to_account == 0 ? data.to_account : data.to_account;
                    }
                }
                else {
                    (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                    to_account = data.to_account == 0 ? data.to_account : data.to_account;
                }

                (accountNumHexaFrom != '0') ? from = accountNumHexaFrom : from = '0000000000000000';
                from_account = data.from_account == 0 ? data.from_account : data.from_account;

                const sc_hash = data.sc_hash.toUpperCase(); // util.CheckMaxString(data.sc_hash, 6);       
                
                let time = "";
                time = data.create_tm;
                time = time * 1;
                moment.relativeTimeThreshold('ss', 0);
                const tt = moment(time).fromNow();
                const ttime = `${tt.split(' ')[0]}&nbsp${tt.split(' ')[1]}&nbsp${tt.split(' ')[2]}`;

                arr.push(
                    {
                        "blk": util.leftZeroDelet(data.blk_num),
                        "age": ttime, 
                        "fromAccHexa": from,
                        "toAccHexa": to,
                        "type": type,
                        "amount": data.amount,//Number.parseFloat(data.amount).toFixed(2),
                        "shortenHash": util.ShortenStringFormat(sc_hash, 12),
                        "bp": util.getBpName(data.subnet_id),
                        "fromAccDecimal": from_account,
                        "toAccDecimal": to_account,
                        "hash": sc_hash,
                        "c_action": data.c_action,
                        "bpNo": data.subnet_id,
                        "time": time
                    }
                );

                //  console.log("arr:" + JSON.stringify(arr) + "\n");            
            };
        };

        // global.latestTransactions = arr;
        res.send({
            result: arr
        });
    });
};

/**
 * get TransHash in Transactions page
 * @event getTransHash
 * @param {req}
 */
export const getTransHash = async (req, res) => {
    try {
        const { query: { hash } } = req;
        const apiRoutePath = '/sc/txs/info';
        //console.log("hash:"+ JSON.stringify(hash))
        getRequest(`${url_4000}${apiRoutePath}?scHash=${hash}`).then((d) => {
            let result = ''
            //console.log("transHashDetail:"+ JSON.stringify(d))
            //d.contents.scTxsInfo.action = d.errorCode == 0 && typeFor(d.contents.scTxsInfo.action);
            if (d.contents.scTxsInfo != null) {
                if (d.contents.scTxsInfo == 0) { //블록해쉬값 입력한 경우
                    result = 'error'
                }else{               
                    result = d
                }
                //console.log("scTxsInfo:"+ JSON.stringify(d.contents.scTxsInfo)) 
            }
            else if (d.contents.res == false) {
                //console.log("scTxsInfo:"+ JSON.stringify(d.contents.res))
                result = 'error'
            }

            res.send({
                data: result
            });
        });
    } catch (error) {
        res.send({
            data: 'error'
        });
    };
};

/**
 * get getFinlPrice in Contract page
 * @event getFinlPrice
 * @param 
 */
 export const getFinlPrice = async (req, res) => {
    try {               
        let apiResMsg = cryptoSsl.curlHttpGet("https://api.lbkex.com/v2/ticker.do?symbol=fin_usdt", "dummy");
        let apiRes = JSON.parse(apiResMsg);
        //console.log("apiRes : " + JSON.stringify(apiRes));

        res.send({
            apiRes
        });
    } catch (error) {
        //console.log("error : " + JSON.stringify(error));
    };
};

/**
 * get postContractToolJson in Contract page
 * @event postContractToolJson
 * @param 
 */
export const postContractToolJson = async (req, res) => {
    try {
        const apiRoutePath = '/contract/tool/json';
               
        const apiVal1Enc = req.body.jsonString;       
        let apiKey1 = '';
        let temp = JSON.parse(apiVal1Enc);     
        if(temp.hasOwnProperty("jsonEnc"))
        {
            apiKey1 = 'contentsEnc'; 
        }
        else
        {
            apiKey1 = 'contract';  
        }
        // const apiPath = `${apiRoutePath}?${apiKey1}=${apiVal1Enc}`;
        const apiPath = `${apiKey1}=${apiVal1Enc}`;
        const data = await APICallProc(apiRoutePath, config.FBN_CONFIG, WEBAPI_DEFINE.METHOD.POST, apiPath);

        res.send({
            data
        });
    } catch (error) {
        errorHandler(req, res, error);
    };
};

// export const postContractToolJson = async (req, res) => {

//     try {
//         const apiRoutePath = '/contract/tool/json';
//         const apiKey1 = 'contentsEnc';
//         const apiVal1 = req.body.jsonString;
//         const apiVal1Enc = encodeURIComponent(apiVal1);
//         const apiPath = `${apiRoutePath}?${apiKey1}=${apiVal1Enc}`;
//         const data = await APICallProc(apiPath, config.FBN_CONFIG, WEBAPI_DEFINE.METHOD.POST);

//         res.send({
//             data
//         });
//     } catch (error) {
//         errorHandler(req, res, error);
//     };
// };

/**
 * get CheckAccount in Contract page
 * @event getCheckAccount
 * @param req
 */
export const getCheckAccount = async (req, res) => {
    try {
        const { query: { ownerPubkey, ownerPubkeyFile } } = req;

        ownerPubkey ? haveKey(ownerPubkey, ownerPubkeyFile) : noKey(req.query); //검색 조건 판별

        async function haveKey(pubkey, fileName) { // id, account  로 검색
            const ownerPubkeyPath = await extensionCheck(fileName);

            fsStart(ownerPubkeyPath, pubkey).then(async function (key) {
                const apiPath = await getApiPath(key);

                getRequest(apiPath).then((data) => {
                    res.send({
                        data
                    });
                });
            });
        };

        async function noKey(inputObject) { //pubkey 로 검색
            try {
                let resultObj = {};

                for (const key in inputObject) {
                    if (inputObject[key]) {
                        resultObj.key = key;
                        resultObj.value = inputObject[key];
                    };
                };

                const apiPath = await getApiPath(resultObj);

                getRequest(apiPath).then((data) => {
                    res.send({
                        data
                    });
                });
            } catch (e) {
                console.log(e);
            };
        };

        async function getApiPath(resultObj) {
            const apiRoutePath = '/account/chk/info';
            const key = resultObj.key || 'ownerPubkey';
            const value = resultObj.value || resultObj;
            const apiPath = `${url_4000}${apiRoutePath}?${key}=${value}`;
            return apiPath;
        };

    } catch (error) {
        errorHandler(req, res, error);
    };
};

/**
 * APICallProc in Contract page
 * @event APICallProc
 * @param {apiPath, config, method, postData }
 */
const APICallProc = async (apiPath, config, method, postData) => {
    let webApiConfig = copyObj(config);

    webApiConfig.path = apiPath;
    webApiConfig.method = method;
    if (postData) {

        webApiConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    //console.log("🚀 ~ file: apiController.js ~ line 631 ~ APICallProc ~ webApiConfig", webApiConfig)

    const apiRes = await APICall(webApiConfig, postData);

    return apiRes;
};

// const APICallProc = async (apiPath, config, method) => {
//     let webApiConfig = copyObj(config);

//     webApiConfig.path = apiPath;
//     webApiConfig.method = method;
//     console.log("🚀 ~ file: apiController.js ~ line 631 ~ APICallProc ~ webApiConfig", webApiConfig)

//     const apiRes = await APICall(webApiConfig);

//     return apiRes;
// };

/**
 * APICall in Contract page
 * @event APICall
 * @param {httpConfig, data}
 */
const APICall = async (httpConfig, data) => {
    let ret = await http_CB(httpConfig, data).then((resData) => {
        return resData;
    }).catch((error) => {
        // logger.error(JSON.stringify({ errorCode: 3002, msg: error.message }));
        return { errorCode: '3002', msg: error };
        // return { errorCode: config.CONTRACT_ERROR_JSON.FB_SVR_ERROR.ERROR_CODE, msg: error.message };
    });
    return ret;
}

/**
 * http_CB
 * @event http_CB
 * @param {httpConfig, postData}
 */
const http_CB = async (httpConfig, postData) => {
    let retryCount = 1;
    const retryRequest = error => {
        // logger.error({ errorCode: 3001, msg: error.message });

        if (retryCount === WEBAPI_DEFINE.RETRY.THRESHOLD) {
            return new Error(error);
        };

        retryCount++;

        setTimeout(() => {
            http_CB(httpConfig, postData);
        }, WEBAPI_DEFINE.RETRY.INTERVAL);
    }

    return new Promise((resolve, reject) => {
        let req = http.request(httpConfig, (res) => {
            if (res.statusCode < WEBAPI_DEFINE.HTTP_STATUS_CODE.OK
                || res.status >= WEBAPI_DEFINE.HTTP_STATUS_CODE.MULTIPLE_CHOICES) {
                return reject(new Error('statusCode=' + res.statusCode));
            };

            let resData = [];
            let concat_resData;

            res.on('data', (data) => {
                resData.push(data);
            });

            res.on('end', () => {
                try {
                    concat_resData = Buffer.concat(resData).toString();

                    if (isJsonString(concat_resData)) {
                        concat_resData = JSON.parse(concat_resData);
                    }
                } catch (e) {
                    reject(e);
                }
                resolve(concat_resData);
            });

            res.on('error', error => {
                res.abort();

                retryRequest(error);
            });
        });

        req.on('timeout', () => {
            resolve({ "errorCode": config.CONTRACT_ERROR_JSON.FB_NO_DATA });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (postData) {
            // req.write(JSON.stringify(postData));
            req.write(postData);
        }
        req.end();
    })
}
// const http_CB = async (httpConfig, postData) => {
//     let retryCount = 1;
//     const retryRequest = error => {
//         // logger.error({ errorCode: 3001, msg: error.message });

//         if (retryCount === WEBAPI_DEFINE.RETRY.THRESHOLD) {
//             return new Error(error);
//         };

//         retryCount++;

//         setTimeout(() => {
//             http_CB(httpConfig, postData);
//         }, WEBAPI_DEFINE.RETRY.INTERVAL);
//     }

//     return new Promise((resolve, reject) => {
//         let req = http.request(httpConfig, (res) => {
//             if (res.statusCode < WEBAPI_DEFINE.HTTP_STATUS_CODE.OK
//                 || res.status >= WEBAPI_DEFINE.HTTP_STATUS_CODE.MULTIPLE_CHOICES) {
//                 return reject(new Error('statusCode=' + res.statusCode));
//             };

//             let resData = [];
//             let concat_resData;

//             res.on('data', (data) => {
//                 resData.push(data);
//             });

//             res.on('end', () => {
//                 try {
//                     concat_resData = Buffer.concat(resData).toString();

//                     if (isJsonString(concat_resData)) {
//                         concat_resData = JSON.parse(concat_resData);
//                     }
//                 } catch (e) {
//                     reject(e);
//                 }
//                 resolve(concat_resData);
//             });

//             res.on('error', error => {
//                 res.abort();

//                 retryRequest(error);
//             });
//         });

//         req.on('timeout', () => {
//             resolve({ "errorCode": config.CONTRACT_ERROR_JSON.FB_NO_DATA });
//         });

//         req.on('error', (err) => {
//             reject(err);
//         });

//         if (postData) {
//             req.write(JSON.stringify(postData));
//         }
//         req.end();
//     })
// }


/**
 * get AccountInfo by AccountId in Accounts page
 * @event getAccountNoById
 * @param req
 */
export const getAccountNoById = async (req, res) => {
    try {
        const { query: { accountId } } = req;
        //  console.log("accountId:" + accountId);  
        let url, data;

        if (accountId) {
            data = accountId.replace(/(^0+)/, ""); //remove left 0 
            url = `${url_4000}/account/chk/info?accountId=${data}`;
        };

        getRequest(url).then((d) => {
            let result = ''

            if (d.contents.uAccountInfo != null) {
                // console.log("AccountNum:"+ d.contents.uAccountInfo.account_num)  
                result = d.contents.uAccountInfo.account_num
            }
            else if (d.contents.res == false) {
                // console.log("AccountNum:"+ JSON.stringify(d.contents.res))
                result = 'error'
            }

            res.send({
                data: result
            });

        });
    } catch (error) {
        errorHandler(req, res, error);
    };
};

/**
 * get getAccountDetailInfo in Accounts page
 * @event getAccountDetailInfo
 * @param req
 */
export const getAccountDetailInfo = async (req, res) => {
    try {
        const { query: { accountNum } } = req;
        let url, data;

        if (accountNum) {
            data = accountNum.replace(/(^0+)/, ""); //remove left 0 
            url = `${url_4000}/account/chk/info?accountNum=${data}`;
        };

        getRequest(url).then((d) => {
            let result = ''

            if (d.contents.uAccountInfo != null) {
                //console.log("Accounts:"+ JSON.stringify(d.contents.uAccountInfo))
                result = d
            }
            else if (d.contents.res == false) {
                //console.log("Accounts:"+ JSON.stringify(d.contents.res))
                result = 'error'

            }
            res.send({
                data: result
            });
        });
    } catch (error) {
        errorHandler(req, res, error);
    };
};

/**
 * get searchAccountDetailInfoByAccId in Search Bar
 * @event searchAccountDetailInfoByAccId
 * @param req
 */
export const searchAccountDetailInfoByAccId = async (req, res) => {
    try {
        const { query: { accountId } } = req;
        let url, data;
        //console.log("accountId:" + accountId);  
        if (accountId) {
            data = accountId.replace(/(^0+)/, ""); //remove left 0 
            url = `${url_4000}/account/chk/info?accountId=${data}`;
        };

        getRequest(url).then((d) => {
            let result = ''

            if (d.contents.uAccountInfo != null) {
                //console.log("Accounts:"+ JSON.stringify(d.contents.uAccountInfo))      
                result = true
            }
            else if (d.contents.res == false) {
                //console.log("Accounts:"+ JSON.stringify(d.contents.res))
                result = false
            }
            res.send({

                data: result
            });
        });
    } catch (error) {
        errorHandler(req, res, error);
    };
};

/**
 * get UserListData in Accounts page
 * @event getUserListData
 * @param 
 */
export const getUserListData = async (req, res) => {
    const userList = `${url_4000}/account/list?users`;
    let arr = [];
    getRequest(userList).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.uAccountInfoList.length; i++) {
                const data = d.contents.uAccountInfoList[i];

                /*accountNum -> hexa to decimal*/
                //console.log("decimal-AccountNum:" + data.account_num);
                let accountNumHexa = '';
                accountNumHexa = BigInt(data.account_num).toString('16').toUpperCase();
                //console.log("Hexa-AccountNum:" + accountNum);             

                arr.push(
                    {
                        "no": data.idx,
                        "accountId": data.account_id,
                        "accountNumHexa": accountNumHexa,
                        "blkNum": data.blk_num,
                        "ownerPubkey": data.owner_pk.toUpperCase(), //util.CheckMaxString(data.owner_pk, 6),
                        "bps": util.getBpName(data.subnet_id),
                        "accountNumDecimal": data.account_num,
                        "bpNo": data.subnet_id
                    }
                );
            };
        };

        // console.log("uAccountInfoList:" + JSON.stringify(arr) + "\n");  

        res.send({
            data: arr
        });
    });
};

/**
 * get getTokenListData in Accounts page
 * @event getTokenListData
 * @param 
 */
export const getTokenListData = async (req, res) => {
    const tokenList = `${url_4000}/account/list?tokens`;
    let arr = [];
    getRequest(tokenList).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.tAccountInfoList.length; i++) {
                const data = d.contents.tAccountInfoList[i];

                /*accountNum -> Decimal to Hexa*/
                let accountNumHexa = '';
                accountNumHexa = BigInt(data.account_num).toString('16').toUpperCase();

                //console.log("tAccountInfoList:" + JSON.stringify(data) + "\n");                           

                arr.push(
                    {
                        "name": data.name,
                        "symbol": data.symbol,
                        "action": data.action,
                        "accountNumHexa": accountNumHexa,
                        "totalSupply": new Intl.NumberFormat().format(data.total_supply),
                        "bps": util.getBpName(data.subnet_id),
                        "accountNumDecimal": data.account_num,
                        "bpNo": data.subnet_id
                    }
                );
            };
        };

        res.send({
            data: arr
        });
    });
};

/**
 * get TransactionsByAccNum in Accounts page
 * @event getTransactionsByAccNum
 * @param req
 */
export const getTransactionsByAccNum = async (req, res) => {
    const confiremdImg = "<img class='category-icon' width='20' height='20' id='confirmed' src='../public/assets/img/confirmed.svg'> CONFIRMED";
    const unconfirmedImg = "<img class='category-icon' width='20' height='20' id='unconfirmed' src='../public/assets/img/unconfirmed.png'> UNCONFIRMED";
    try {
        const { query: { accountNum } } = req;
        let url, data;

        if (accountNum) {
            data = accountNum.replace(/(^0+)/, ""); //remove left 0 
            url = `${url_4000}/sc/latest?cnt=10&accountNum=${data}`;
        };
        let arr = [];
        getRequest(url).then((d) => {

            // console.log("getTransactionsByAccNum:" + JSON.stringify(d) + "\n");            

            if (d.errorCode == 0) {
                for (let i = 0; i < d.contents.accountLatestScTxs.length; i++) {
                    const data = d.contents.accountLatestScTxs[i];

                    const type = typeFor(data.action);

                    /*accountNum -> hexa to decimal*/
                    let accountNumHexaFrom = '';
                    let accountNumHexaTo = '';
                    let dstAccountNumHexa = '';
                    accountNumHexaFrom = BigInt(data.from_account).toString('16').toUpperCase();
                    accountNumHexaTo = BigInt(data.to_account).toString('16').toUpperCase();
                    dstAccountNumHexa = BigInt(data.dst_account).toString('16').toUpperCase();

                    let from = '';
                    let to = '';
                    let from_account = '';
                    let to_account = '';

                    //if c_action != 0, it's a utility token(stable price). So use dst_account as 'to' destination
                    //if c_action == 0, it's a security token(volatie price).
                    if (type == 'TRANSFER') {
                        if (data.c_action != 0) {
                            (dstAccountNumHexa != '0') ? to = dstAccountNumHexa : to = '0000000000000000';
                            to_account = data.dst_account == 0 ? data.dst_account : data.dst_account;
                        }
                        else {
                            (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                            to_account = data.to_account == 0 ? data.to_account : data.to_account;
                        }
                    }
                    else {
                        (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                        to_account = data.to_account == 0 ? data.to_account : data.to_account;
                    }

                    (accountNumHexaFrom != '0') ? from = accountNumHexaFrom : from = '0000000000000000';
                    from_account = data.from_account == 0 ? data.from_account : data.from_account;

                    const sc_hash = data.sc_hash.toUpperCase();

                    let status = 'Y';

                    if (status == 'Y') {
                        status = confiremdImg;
                    }
                    else {
                        status = unconfirmedImg;
                    }

                    arr.push(
                        {
                            "shortenHash": util.ShortenStringFormat(sc_hash, 12),
                            "blk": util.leftZeroDelet(data.blk_num),
                            "fromAccHexa": util.CheckMaxString(from, 50),
                            "toAccHexa": util.CheckMaxString(to, 50),
                            "type": type,
                            "amount": data.amount,//Number.parseFloat(data.amount).toFixed(2),                         
                            "token": data.c_action,
                            "status": status,
                            "fromAccDecimal": from_account,
                            "toAccDecimal": to_account,
                            "hash": sc_hash
                        }
                    );

                    //  console.log("arr:" + JSON.stringify(arr) + "\n");            
                };
            };

            res.send({
                result: arr
            });

        });

    } catch (error) {
        errorHandler(req, res, error);
    };
};

/**
 * get TrackerInfo in Tracker page
 * @event getTrackerInfo
 * @param 
 */
export const getTrackerInfo = async (req, res) => {
    const trackerInfo = `${url_4000}/account/list?total`;
    let arr = [];
    try {
        getRequest(trackerInfo).then((d) => {

            //console.log("trackerInfo:"+ JSON.stringify(d.contents))            

            res.send({
                data: d.contents
            });
        });

    } catch (error) {
        errorHandler(req, res, error);
    }
};

/**
 * get TrackerList in Tracker page
 * @event getTrackerList
 * @param 
 */
export const getTrackerList = async (req, res) => {
    const trackerlist = `${url_4000}/account/list?tokens`;
    let arr = [];
    getRequest(trackerlist).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.tAccountInfoList.length; i++) {
                const data = d.contents.tAccountInfoList[i];
                //console.log("taccountinfolist:" + JSON.stringify(data) + "\n");  

                /*accountNum -> hexa to decimal*/
                let accountNumHexa = '';
                accountNumHexa = BigInt(data.account_num).toString('16').toUpperCase();

                //console.log("accountNumHexa:" + accountNumHexa + "\n");  

                arr.push(
                    {
                        "name": data.name,
                        "symbol": data.symbol,
                        "accountNumHexa": accountNumHexa,
                        "marketSupply": new Intl.NumberFormat().format(data.market_supply),
                        "action": typeFor(data.action),
                        "bps": util.getBpName(data.subnet_id),
                        "accountNumDecimal": data.account_num,
                        "actionO": data.action,
                        "bpNo": data.subnet_id
                    }
                );
            };
        };

        res.send({
            result: arr
        });
    });
};

/**
 * get TransferInfo in Transfer page
 * @event getTransferInfo
 * @param 
 */
export const getTransferInfo = async (req, res) => {
    const transferInfo = `${url_4000}/account/list?total`;
    let arr = [];
    try {
        getRequest(transferInfo).then((d) => {

            //console.log("transferInfo:"+ JSON.stringify(d.contents))  
            res.send({
                data: d.contents
            });
        });

    } catch (error) {
        errorHandler(req, res, error);
    }
};


/**
 * get TransferList in Transfer page
 * @event getTransferList
 * @param 
 */
export const getTransferList = async (req, res) => {
    const transferlist = `${url_4000}/sc/latest?cnt=1000&txns=1`;
    let arr = [];
    getRequest(transferlist).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.accountLatestScTxs.length; i++) {
                const data = d.contents.accountLatestScTxs[i];

                const type = typeFor(data.action);

                /*accountNum -> hexa to decimal*/
                let accountNumHexaFrom = '';
                let accountNumHexaTo = '';
                let dstAccountNumHexa = '';
                accountNumHexaFrom = BigInt(data.from_account).toString('16').toUpperCase();
                accountNumHexaTo = BigInt(data.to_account).toString('16').toUpperCase();
                dstAccountNumHexa = BigInt(data.dst_account).toString('16').toUpperCase();

                let from = '';
                let to = '';
                let from_account = '';
                let to_account = '';

                //if c_action != 0, it's a utility token(stable price). So use dst_account as 'to' destination
                //if c_action == 0, it's a security token(volatie price).
                if (type == 'TRANSFER') {
                    if (data.c_action != 0) {
                        (dstAccountNumHexa != '0') ? to = dstAccountNumHexa : to = '0000000000000000';
                        to_account = data.dst_account == 0 ? data.dst_account : data.dst_account;
                    }
                    else {
                        (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                        to_account = data.to_account == 0 ? data.to_account : data.to_account;
                    }
                }
                else {
                    (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                    to_account = data.to_account == 0 ? data.to_account : data.to_account;
                }

                (accountNumHexaFrom != '0') ? from = accountNumHexaFrom : from = '0000000000000000';
                from_account = data.from_account == 0 ? data.from_account : data.from_account;

                let scHash = data.sc_hash.toUpperCase();

                arr.push(
                    {
                        "shortenHash": util.ShortenStringFormat(scHash, 12),
                        "blkNum": data.blk_num,
                        "fromAccountHexa": from,
                        "toAccountHexa": to,
                        "amount": data.amount,//Number.parseFloat(data.amount).toFixed(2),
                        "type": typeFor(data.action),
                        "bps": util.getBpName(data.subnet_id),
                        "fromAccountDecimal": from_account,
                        "toAccountDecimal": to_account,
                        "tokenAction": data.action,
                        "hash": data.sc_hash,
                        "c_action": data.c_action,
                        "bpNo": data.subnet_id
                    }
                );
            };
        };

        res.send({
            result: arr
        });
    });
};

/**
 * get getTokenAction in Search bar
 * @event getTokenAction
 * @param {req}
 */
export const getTokenAction = async (req, res) => {

    const { query: { tokenSymbol } } = req;
    //console.log("tokenSymbol:" + tokenSymbol);  
    let url, data;
    let arr = [];

    if (tokenSymbol) {
        data = tokenSymbol.replace(/(^0+)/, ""); //remove left 0 
        url = `${url_4000}/account/chk/info?tokenSymbol=${data}`;
    }

    try {
        getRequest(url).then((d) => {
            let result = ''
            if (d.contents.tAccountInfo != null) {
                //console.log("TokenAction:"+ d.contents.tAccountInfo.action)     
                result = d.contents.tAccountInfo.action
            }
            else if (d.contents.res == false) {
                //console.log("TokenAction:"+ JSON.stringify(d.contents.res))
                result = 'error'

            }
            res.send({
                data: result
            });
        });

    } catch (error) {
        errorHandler(req, res, error);
    }
};

/**
 * get TokenDetailInfo in TokenDetails page
 * @event getTokenDetailInfo
 * @param {req}
 */
export const getTokenDetailInfo = async (req, res) => {

    const { query: { tokenAction } } = req;
    //console.log("tokenAction:" + JSON.stringify(tokenAction));  
    let url, data;
    let arr = [];

    if (tokenAction) {
        data = tokenAction.replace(/(^0+)/, ""); //remove left 0 
        url = `${url_4000}/account/chk/info?tokenAction=${data}`;
    }

    //console.log("url:"+ url)       
    try {
        getRequest(url).then((d) => {
            let result = ''

            if (d.contents.tAccountInfo != null) {
                //console.log("detailInfo:"+ d.contents.tAccountInfo)      
                result = d.contents
            }
            else if (d.contents.res == false) {
                //console.log("detailInfo:"+ JSON.stringify(d.contents.res))
                result = 'error'
            }

            res.send({
                data: result
            });
        });

    } catch (error) {
        errorHandler(req, res, error);
    }
};

/**
 * get searchTokenDetailInfoBySymbol in Search Bar
 * @event searchTokenDetailInfoBySymbol
 * @param {req}
 */
export const searchTokenDetailInfoBySymbol = async (req, res) => {

    const { query: { tokenSymbol } } = req;
    //console.log("tokenSymbol:" + tokenSymbol);  
    let url, data;
    let arr = [];

    if (tokenSymbol) {
        data = tokenSymbol.replace(/(^0+)/, ""); //remove left 0 
        url = `${url_4000}/account/chk/info?tokenSymbol=${data}`;
    }

    //console.log("url:"+ url)       
    try {
        getRequest(url).then((d) => {
            let result = ''

            if (d.contents.tAccountInfo != null) {
                //console.log("searchTokenDetailInfo:"+ JSON.stringify(d.contents.tAccountInfo))    
                result = true
            }
            else if (d.contents.res == false) {
                //console.log("searchTokenDetailInfo:"+ JSON.stringify(d.contents.res))
                result = false
            }

            res.send({

                data: result
            });
        });

    } catch (error) {
        errorHandler(req, res, error);
    }
};

/**
 * get searchTokenDetailInfoByName in Search Bar
 * @event searchTokenDetailInfoByName
 * @param {req}
 */
export const searchTokenDetailInfoByName = async (req, res) => {

    const { query: { tokenName } } = req;
    //console.log("tokenName:" + tokenName);  
    let url, data;
    let arr = [];

    if (tokenName) {
        data = tokenName.replace(/(^0+)/, ""); //remove left 0 
        url = `${url_4000}/account/chk/info?tokenName=${data}`;
    }

    //console.log("url:"+ url)       
    try {
        getRequest(url).then((d) => {
            let result = ''

            if (d.contents.tAccountInfo != null) {
                //console.log("searchTokenDetailInfo:"+ JSON.stringify(d.contents.tAccountInfo))       
                result = true
            }
            else if (d.contents.res == false) {
                //console.log("searchTokenDetailInfo:"+ JSON.stringify(d.contents.res))
                result = false
            }

            res.send({
                data: result
            });
        });

    } catch (error) {
        //console.log("error:")
        errorHandler(req, res, error);
    }
};

/**
 * get getTokenDetailInfoByName in Search Bar
 * @event getTokenDetailInfoByName
 * @param {req}
 */
export const getTokenDetailInfoByName = async (req, res) => {

    const { query: { tokenName } } = req;
    //console.log("tokenName:" + tokenName);  
    let url, data;
    let arr = [];

    if (tokenName) {
        data = tokenName.replace(/(^0+)/, ""); //remove left 0 
        url = `${url_4000}/account/chk/info?tokenName=${data}`;
    }

    //console.log("url:"+ url)       
    try {
        getRequest(url).then((d) => {
            let result = ''

            if (d.contents.tAccountInfo != null) {
                //console.log("getTokenDetailInfo:"+ JSON.stringify(d.contents.tAccountInfo))
                result = d.contents
            }
            else if (d.contents.res == false) {
                //console.log("getTokenDetailInfo:"+ JSON.stringify(d.contents.res))  
                result = 'error'
            }
            res.send({
                data: result
            });
        });

    } catch (error) {
        //console.log("error:")
        errorHandler(req, res, error);
    }
};

/**
 * get TokenTransfer in TokenDetails page
 * @event getTokenTransfer
 * @param req
 */
export const getTokenTransfer = async (req, res) => {
    const { query: { accountAction } } = req;
    //console.log("accountAction:" + JSON.parse(accountAction));  
    let url;
    let arr = [];

    if (accountAction) {
        url = `${url_4000}/sc/latest?cnt=1000&tAccountAction=${accountAction}`;
    };

    const confiremdImg = "<img class='category-icon' width='20' height='20' id='confirmed' src='../public/assets/img/confirmed.svg'> CONFIRMED";
    const unconfirmedImg = "<img class='category-icon' width='20' height='20' id='unconfirmed' src='../public/assets/img/unconfirmed.png'> UNCONFIRMED";

    getRequest(url).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.accountLatestScTxs.length; i++) {
                const data = d.contents.accountLatestScTxs[i];
                const type = typeFor(data.action);

                /*accountNum -> hexa to decimal*/
                let accountNumHexaFrom = '';
                let accountNumHexaTo = '';
                let dstAccountNumHexa = '';
                accountNumHexaFrom = BigInt(data.from_account).toString('16').toUpperCase();
                accountNumHexaTo = BigInt(data.to_account).toString('16').toUpperCase();
                dstAccountNumHexa = BigInt(data.dst_account).toString('16').toUpperCase();

                let from = '';
                let to = '';
                let from_account = '';
                let to_account = '';

                //if c_action != 0, it's a utility token(stable price). So use dst_account as 'to' destination
                //if c_action == 0, it's a security token(volatie price).
                if (type == 'TRANSFER') {
                    if (data.c_action != 0) {
                        (dstAccountNumHexa != '0') ? to = dstAccountNumHexa : to = '0000000000000000';
                        to_account = data.dst_account == 0 ? data.dst_account : data.dst_account;
                    }
                    else {
                        (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                        to_account = data.to_account == 0 ? data.to_account : data.to_account;
                    }
                }
                else {
                    (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                    to_account = data.to_account == 0 ? data.to_account : data.to_account;
                }

                (accountNumHexaFrom != '0') ? from = accountNumHexaFrom : from = '0000000000000000';
                from_account = data.from_account == 0 ? data.from_account : data.from_account;

                const sc_hash = data.sc_hash.toUpperCase();

                let status = 'Y';
                if (status == 'Y') {
                    status = confiremdImg;
                }
                else {
                    status = unconfirmedImg;
                }

                //  console.log("data:" + JSON.stringify(data) + "\n");  

                arr.push(
                    {
                        "shortenHash": util.ShortenStringFormat(sc_hash, 12),
                        "blk": util.leftZeroDelet(data.blk_num),
                        "fromAccHexa": util.CheckMaxString(from, 50),
                        "toAccHexa": util.CheckMaxString(to, 50),
                        "type": type,
                        "amount": data.amount,//Number.parseFloat(data.amount).toFixed(2),                         
                        "token": data.c_action,
                        "status": status,
                        "fromAccDecimal": from_account,
                        "toAccDecimal": to_account,
                        "hash": sc_hash
                    }
                );

                // console.log("arr:" + JSON.stringify(arr) + "\n");            
            };
        };

        res.send({
            result: arr
        });
    });
};

/**
 * get TokenHolders in TokenDetails page
 * @event getTokenHolders
 * @param 
 */
export const getTokenHolders = async (req, res) => {
    const tokenTransfer = `${url_4000}/account/richlist?tAccountAction=0&cnt=10000`;
    let arr = [];
    getRequest(tokenTransfer).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.richList.length; i++) {
                const data = d.contents.richList[i];
                //console.log("getTokenHolders:" +  JSON.stringify(data));   
                let time = "";
                time = data.create_tm;
                time = time * 1;
                moment.relativeTimeThreshold('ss', 0);
                const tt = moment(time).fromNow();
                const ttime = `${tt.split(' ')[0]}&nbsp${tt.split(' ')[1]}&nbsp${tt.split(' ')[2]}`;
                const type = typeFor(data.action);

                /*accountNum -> hexa to decimal*/
                //console.log("decimal-AccountNum:" + data.account_num);
                let myaccountNumHexa = '';
                myaccountNumHexa = BigInt(data.my_account_num).toString('16').toUpperCase();
                //console.log("Hexa-AccountNum:" + accountNum);        

                const balance = Number(data.balance + '000');
                const y = d.contents.market_supply * 1;

                arr.push(
                    {
                        "rank": i + 1,
                        "accountId": data.account_id,
                        "myAccountNumHexa": myaccountNumHexa,
                        "balance": data.balance,  //new Intl.NumberFormat().format( data.balance ),  
                        "percentage": Number.parseFloat(balance / y * 100).toFixed(2),
                        "myAccountNumDecimal": data.my_account_num
                    }
                );

            };
        };

        // console.log("TOKENHolder_Arr:" + JSON.stringify(arr) + "\n");  

        res.send({
            result: arr
        });
    });
};

/**
 * get TokenNft in Token Detail page
 * @event getTokenNft
 * @param 
 */
export const getTokenNft = async (req, res) => {
    const { query: { targetAction } } = req;
    //console.log("targetAction:" + JSON.parse(targetAction));  
    let url;
    let arr = [];

    if (targetAction) {
        url = `${url_4000}/account/nft?targetAction=${targetAction}`;
    };

    getRequest(url).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.NFT.length; i++) {
                const data = d.contents.NFT[i];
                //console.log("getTokenNft:" + JSON.stringify(data) + "\n");       
                let sc_hash = data.sc_hash.toUpperCase();                             
                arr.push(
                    {
                        "name": data.name,
                        "symbol": data.symbol,
                        "nftName": data.nft_name,
                        "shortenHash": util.ShortenStringFormat(sc_hash, 12),
                        "actionTarget": data.action_target,
                        "scAction": data.sc_action,
                        "totalCnt": data.total_cnt,
                        "scHash": sc_hash,
                    }
                );
            };
        };

        res.send({
            result: arr
        });
    });
};



/**
 * get NftList in NFT page
 * @event getNftList
 * @param 
 */
export const getNftList = async (req, res) => {
    const nftList = `${url_4000}/account/list?nft`;
    let arr = [];
    getRequest(nftList).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.NFT.length; i++) {
                const data = d.contents.NFT[i];
                // console.log("NFT:" + JSON.stringify(data) + "\n");       
                let sc_hash = data.sc_hash.toUpperCase();                       
                arr.push(
                    {
                        "name": data.name,
                        "symbol": data.symbol,
                        "nftName": data.nft_name,
                        "shortenHash": util.ShortenStringFormat(sc_hash, 12),
                        "actionTarget": data.action_target,
                        "scAction": data.sc_action,
                        "ratio": Number.parseFloat(data.total_ratio).toFixed(2),
                        "totalCnt": data.total_cnt,
                        "scHash": sc_hash,
                    }
                );
            };
        };

        res.send({
            result: arr
        });
    });
};

/**
 * get NftDetail in NFT Detail page
 * @event getNftDetail
 * @param 
 */
 export const getNftDetail = async (req, res) => {
    const { query: { scDetail } } = req;   
    //console.log("scDetail:" + JSON.parse(scDetail));  
    let url;
    let arr = [];

    if (scDetail) {
        url = `${url_4000}/account/nft?scDetail=${scDetail}`;
    };

    getRequest(url).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.NFT.length; i++) {
                const data = d.contents.NFT[i];
                //console.log("getNftDetail:" + JSON.stringify(data) + "\n");       
                let sc_hash = data.sc_hash.toUpperCase();    

                let collectedData = JSON.parse(data.collection);          
                //console.log("collection:" + JSON.stringify(collectedData) + "\n");       

                arr.push(
                    {         
                        "nftName": data.nft_name,   
                        "name":  collectedData != null ? collectedData.name : '',       
                        "symbol": collectedData != null ? collectedData.symbol : '',
                        "officialWeb": collectedData != null ?collectedData.official : '',
                        "description": collectedData != null ?collectedData.description : '',
                        "shortenHash": util.ShortenStringFormat(sc_hash, 12),
                        "holders": data.holders,    
                        "totalCnt": data.total_cnt,
                        "totalRatio": Number.parseFloat(data.total_ratio).toFixed(2),
                        "scHash": sc_hash,
                    }
                );
            };
        };

        //console.log("getNftDetailArr:" + JSON.stringify(arr) + "\n");  
        res.send({
            data: arr
        });
    });
};

/**
 * get nftTransfer in NFT Detail page
 * @event getNftTransfer
 * @param req
 */
 export const getNftTransfer = async (req, res) => {
    const { query: { scAction } } = req;
    //console.log("scAction:" + JSON.parse(scAction));  
    let url;
    let arr = [];

    if (scAction) {
        url = `${url_4000}/account/nft?scAction=${scAction}`;       
    };

    getRequest(url).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.NFT.length; i++) {
                const data = d.contents.NFT[i];
                const type = typeFor(data.action);

                let time = "";
                time = data.create_tm;
                time = time * 1;
                moment.relativeTimeThreshold('ss', 0);
                const tt = moment(time).fromNow();
                const ttime = `${tt.split(' ')[0]}` + ' ' + `${tt.split(' ')[1]}` + ' ' + `${tt.split(' ')[2]}`;

                /*accountNum -> hexa to decimal*/
                let accountNumHexaFrom = '';
                let accountNumHexaTo = '';
                accountNumHexaFrom = BigInt(data.from_account_num).toString('16').toUpperCase();
                accountNumHexaTo = BigInt(data.to_account_num).toString('16').toUpperCase();

                let from = '';
                let to = '';
                let from_account = '';
                let to_account = '';

                (accountNumHexaFrom != '0') ? from = accountNumHexaFrom : from = '0000000000000000';
                from_account = data.from_account == 0 ? data.from_account_num : data.from_account_num;

                (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                to_account = data.to_account == 0 ? data.to_account_num : data.to_account_num;

                const sc_hash = data.sc_hash.toUpperCase();

               // console.log("getNftTransfer:" + JSON.stringify(data) + "\n");  

                arr.push(
                    {
                       
                        "blk": util.leftZeroDelet(data.blk_num),
                        "age": ttime,
                        "fromAccHexa": util.CheckMaxString(from, 50),
                        "toAccHexa": util.CheckMaxString(to, 50),                          
                        "shortenHash": util.ShortenStringFormat(sc_hash, 12),
                        "tokenIdHexa" : commonUtil.paddy(parseInt(data.sub_id).toString(16), 8).toUpperCase(),
                        "fromAccDecimal": from_account,
                        "toAccDecimal": to_account,
                        "hash": sc_hash,
                        "tokenIdDecimal" : data.sub_id,
                        "time": time,
                        "pRatio" : data.p_ratio 
                    }
                );

                //console.log("arr:" + JSON.stringify(arr) + "\n");            
            };
        };

        res.send({
            result: arr
        });
    });
};

/**
 * get getNftHolders in NFT Detail page
 * @event getNftHolders
 * @param req
 */
 export const getNftHolders = async (req, res) => {
    const { query: { scAction } } = req;
    //console.log("scAction:" + JSON.parse(scAction));  
    let url;
    let arr = [];

    if (scAction) {
        url = `${url_4000}/account/nft?holders=${scAction}`;       
    };

    getRequest(url).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.holders.length; i++) {
                const data = d.contents.holders[i];
                const type = typeFor(data.action);

                let time = "";
                time = data.create_tm;
                time = time * 1;
                moment.relativeTimeThreshold('ss', 0);
                const tt = moment(time).fromNow();
                const ttime = `${tt.split(' ')[0]}` + ' ' + `${tt.split(' ')[1]}` + ' ' + `${tt.split(' ')[2]}`;

                const sc_hash = data.sc_hash.toUpperCase();

                //console.log("getNftHolders:" + JSON.stringify(data) + "\n");  

                arr.push(
                    {                       
                        "blk": util.leftZeroDelet(data.blk_num),
                        "age": ttime,                                   
                        "shortenHash": util.ShortenStringFormat(sc_hash, 12),
                        "accountId" : data.account_id,                       
                        "tokenIdHexa" : commonUtil.paddy(parseInt(data.sub_id).toString(16), 8).toUpperCase(),
                        "hash": sc_hash,
                        "tokenIdDecimal": data.sub_id,
                        "time": time,
                        "pRatio" : data.p_ratio 
                    }
                );

                //console.log("arr:" + JSON.stringify(arr) + "\n");            
            };
        };

        res.send({
            result: arr
        });
    });
};

/**
 * get NftSubDetail in NFT Sub Detail page
 * @event getNftSubDetail
 * @param req
 */
 export const getNftSubDetail = async (req, res) => {
    const { query: { accountNum, scAction , subId} } = req;   
    // console.log("accountNum:" + accountNum);  
    // console.log("scAction:" + scAction);  
    // console.log("subId:" + subId);  
    let url;
    let data;
    let result;
    let nodeArr = [];
    let nftArr = [];
    let totalTx = '';
    let txListArr = [];
    
    //Account-Details-NFT tab ->  NFT Sub Page  : hide NFT transfers table and TX count value
    if (scAction && accountNum != '0' ) {
        url = `${url_4000}/account/nft?fromAccount=${accountNum}&scAction=${scAction}&subId=${subId}`;
    }else //NFT detail -> NFT sub Page
        url = `${url_4000}/account/nft?scAction=${scAction}&subId=${subId}`;

    getRequest(url).then((d) => {
        //console.log("d:" + JSON.stringify(d) + "\n");     
        if (d.errorCode == 0) {           
            const nodedata = d.contents.node;
            //console.log("nodedata:" + JSON.stringify(nodedata) + "\n");    
            
            nodeArr.push(
                {         
                    "name": nodedata.name, 
                    "symbol": nodedata.symbol, 
                    "nft_name": nodedata.nft_name,                
                }
            );           

            const nftdata = d.contents.NFT;
            //console.log("nftdata:" + JSON.stringify(nftdata) + "\n");                 
            const sc =  JSON.parse(nftdata.sc);         
            //console.log("sc:" + JSON.stringify(sc)+ "\n");       

            nftArr.push(
                {        
                    "subIdHexa":  commonUtil.paddy(parseInt(nftdata.sub_id).toString(16), 8).toUpperCase(), 
                    "ratio": sc.meta_data != null ? sc.meta_data.ratio : '', 
                    "ownerAccNumHexa":  BigInt(nftdata.owner_acc_num).toString('16').toUpperCase(),
                    "blkNum": nftdata.blk_num,
                    "createTm": nftdata.create_tm,
                    "scHash": nftdata.sc_hash,
                    "subIdDecimal": nftdata.sub_id                  
                }
            );         
            
            if(d.contents.total_tx)
            {
                totalTx = d.contents.total_tx;
                //console.log("totalTx:" + JSON.stringify(totalTx) + "\n");    
            }

            if(d.contents.tx_list)
            {
                for (let i = 0; i < d.contents.tx_list.length; i++) 
                {
                    const txListdata = d.contents.tx_list[i];
                    //console.log("txListRaw:" + JSON.stringify(txListdata) + "\n");                 
                    
                    let time = "";
                    time = txListdata.create_tm;
                    time = time * 1;
                    moment.relativeTimeThreshold('ss', 0);
                    const tt = moment(time).fromNow();
                    const ttime = `${tt.split(' ')[0]}` + ' ' + `${tt.split(' ')[1]}` + ' ' + `${tt.split(' ')[2]}`;

                    /*accountNum -> hexa to decimal*/
                    let accountNumHexaFrom = '';
                    let accountNumHexaTo = '';
                    accountNumHexaFrom = BigInt(txListdata.from_account_num).toString('16').toUpperCase();
                    accountNumHexaTo = BigInt(txListdata.to_account_num).toString('16').toUpperCase();

                    let from = '';
                    let to = '';
                    let from_account = '';
                    let to_account = '';

                    (accountNumHexaFrom != '0') ? from = accountNumHexaFrom : from = '0000000000000000';
                    from_account = txListdata.from_account == 0 ? txListdata.from_account_num : txListdata.from_account_num;

                    (accountNumHexaTo != '0') ? to = accountNumHexaTo : to = '0000000000000000';
                    to_account = txListdata.to_account == 0 ? txListdata.to_account_num : txListdata.to_account_num;              

                    let sc_hash = txListdata.sc_hash.toUpperCase();                     

                    txListArr.push(
                        {         
                            "blk": txListdata.blk_num, 
                            "age": ttime, 
                            "shortenHash": util.ShortenStringFormat(sc_hash, 12),
                            "fromAccHexa": util.CheckMaxString(from, 50),
                            "toAccHexa": util.CheckMaxString(to, 50),    
                            "fromAccDecimal": from_account,
                            "toAccDecimal": to_account,
                            "hash": sc_hash,                        
                        }
                    );
                };

                //console.log("txListArr:" + JSON.stringify(txListArr) + "\n");  
            };

            result = { 
                nodeData: nodeArr,
                nftData: nftArr,
                totalTxCnt : totalTx,
                txListData: txListArr  
            }           
            
        }else{
            //console.log("errorMsg:" + JSON.stringify(d.contents.msg) + "\n");    
            result = { 
                data: "error"
            }
        }; 

        res.send({
            result
        });       
        
    });
};

/**
 * get getNftByAccNum in Account Detail page
 * @event getNftByAccNum
 * @param req
 */
 export const getNftByAccNum = async (req, res) => {
    const { query: { accountNum } } = req;
    //console.log("accountNum:" + JSON.parse(accountNum));  
    let url;
    let arr = [];

    if (accountNum) {
        url = `${url_4000}/account/nft?user=${accountNum}`;       
    };

    getRequest(url).then((d) => {

        if (d.errorCode == 0) {
            for (let i = 0; i < d.contents.NFT.length; i++) {
                const nftdata = d.contents.NFT[i];
                const type = typeFor(nftdata.sc_action);
                const sc_hash = nftdata.sc_hash.toUpperCase();
                //console.log("getNftByAccNum:" + JSON.stringify(nftdata) + "\n");  
                const metaData =  JSON.parse(nftdata.meta_data);           
                //console.log("metaData:" + JSON.stringify(metaData) + "\n");  

                let time = "";
                time = nftdata.create_tm;
                time = time * 1;
                moment.relativeTimeThreshold('ss', 0);
                const tt = moment(time).fromNow();
                const ttime = `${tt.split(' ')[0]}` + ' ' + `${tt.split(' ')[1]}` + ' ' + `${tt.split(' ')[2]}`;

                arr.push(
                    {         
                        "blk": nftdata.blk_num,
                        "createTm": ttime,          
                        "nftName": nftdata.nft_name,
                        "tokenName": nftdata.token_name,
                        "tokenSymbol": nftdata.token_symbol,                       
                        "type": type ,
                        "shortenHash": util.ShortenStringFormat(sc_hash, 12),
                        "tokenIdHexa" : commonUtil.paddy(parseInt(nftdata.sub_id).toString(16), 8).toUpperCase(),                     
                        "hash": sc_hash,
                        "scAction": nftdata.sc_action,
                        "tokenIdDecimal" : nftdata.sub_id,
                        "pRatio" : metaData.ratio 
                    }
                );

                //console.log("arr:" + JSON.stringify(arr) + "\n");            
            };
        };

        res.send({
            result: arr
        });
    });
};



/**
 * Returns shorten action name
 * @method typeFor
 * @return result
 */
function typeFor(action) {
    let result = '';
    if (contract_actions.TOKEN.STT <= action && action <= contract_actions.TOKEN.END) {
        const TEXT = `TX UTIL TOKEN ${action}`;

        if (contract_actions.TOKEN.SECURITY == action) {
            result = `TRANSFER ${action}`;
            //result = `TX SEC TOKEN ${action}`;
        };
        if (contract_actions.TOKEN.UTILITY_PLATINUM.STT < action && action <= contract_actions.TOKEN.UTILITY_PLATINUM.END) {
            result = TEXT;
        };
        if (contract_actions.TOKEN.UTILITY_GOLD.STT < action && action <= contract_actions.TOKEN.UTILITY_GOLD.END) {
            result = TEXT;
        };
        if (contract_actions.TOKEN.UTILITY.STT < action && action <= contract_actions.TOKEN.UTILITY.END) {
            result = TEXT;
        };
    } else if (contract_actions.CONTRACT.STT <= action && action <= contract_actions.CONTRACT.END) {
        const obj = contract_actions.CONTRACT.DEFAULT;

        for (const key in obj) {
            //  console.log("action:", action)
            if (obj[key] == action) {
                //TOKEN_TX -> TRNASFER 사용자에게 노출(contract_actions.json 은 공통이라 수정하면 안됨)
                if (key == 'TOKEN_TX') {
                    result = 'TRANSFER';
                    break;
                }
                else if (key == 'STT' || key == 'TOKEN_CREATION') {
                    result = 'CRT_TKN';
                    break;
                }
                else if (key == 'CHANGE_TOKEN_PUBKEY') {
                    result = 'CNG_TKEY';
                    break;
                }
                else if (key == 'CHANGE_USER_PUBKEY') {
                    result = 'CNG_UKEY';
                    break;
                }
                else if (key == 'CHANGE_TOKEN') {
                    result = 'CNG_TKN';
                    break;
                }
                else if (key == 'LOCK_TOKEN_TX') {
                    result = 'LOC_TKNTX';
                    break;
                }
                else if (key == 'LOCK_TOKEN_TIME') {
                    result = 'LOC_TKNT';
                    break;
                }
                else if (key == 'LOCK_TOKEN_WALLET') {
                    result = 'LOC_TKNW';

                    break;
                }
                else if (key == 'END') {
                    result = 'END';
                    break;
                }
                else {
                    result = key;
                    break;
                }
            }
        };

        if (contract_actions.CONTRACT.SC.STT <= action && action <= contract_actions.CONTRACT.SC.END) {
            result = 'SC';
        };

        if (contract_actions.CONTRACT.NFT.STT <= action && action <= contract_actions.CONTRACT.NFT.END) {
            result = 'NFT';
        };
    };


    return result;
};

/**
 * copyObj
 * @method copyObj
 * @return {clone}
 */
const copyObj = (obj) => {
    let clone = {};
    for (let i in obj) {
        if (typeof (obj[i]) === "object" && obj[i] !== null) {
            clone[i] = copyObj(obj[i]);
        } else {
            clone[i] = obj[i];
        };
    };
    return clone;
};


const isJsonString = (str) => {
    try {
        var isObj = JSON.parse(str);

        if (isObj && typeof isObj === "object") {
            return true;
        }
    } catch (e) {
        return false;
    }

    return false;
};

const WEBAPI_DEFINE = {
    METHOD: {
        POST: 'POST',
        GET: 'GET'
    },
    NOT_FOUND: "Not Found",
    RESULT_CODE: {
        SUCCESS: 0,
        NOT_REGIST: 1001
    },
    HTTP_STATUS_CODE: {
        OK: 200,
        MULTIPLE_CHOICES: 300
    },
    RETRY: {
        THRESHOLD: 3,
        INTERVAL: 1000
    }
};


/**
 * get apiPath
 * @method apiPath
 * @return {userNo} 
 */
function apiPath(userNo) {
    const request = `${url_4000}/contract/tx/token?tAccountAction=0&fromAccount=USER_01&toAccount=USER_0${userNo}&amount=${getRandomInt()}.000&ownerPrikey=%C2%91%C3%90W%C3%B3%3F%C2%AE%C3%88(%C3%93Gu%C3%A2E%5E%C3%97%C3%A2%1A2%C3%BFl%C3%84%C3%B4%C2%96%C2%9Bg%C2%94S_Y%C3%80z1%C2%89%C3%B1_'%C3%9EgS~%C3%93%C2%AB.%7B%C3%9BG%C2%A3%C3%ACw%3A%C2%A5%C2%B9Uq%00%C2%AD%22%C3%90%C3%80%C2%A6%C3%B1%1FS%5DS%C3%91%C2%82G%40%C2%9C%C2%AE%C2%93%C2%BB%16%16%C3%B1I%C3%B3%C2%9D0%C3%A6%C2%9B%17Z%C2%B9%C2%85%C2%93%C2%B8%C3%83%C2%86%C3%90%C3%9B4'%C3%87%2B!H%C3%BB%C3%A0%7B%C3%8B%1F%3C%C3%B2%C2%90%C2%B9T%C2%A2%0Fk%C3%8D%05%C3%9F%C2%82s%C2%98iQ%C2%B8%5B%C2%B4%C3%931%C2%9A_%19%0E&ownerPrikeyPw=asdfQWER1234!%40%23%24&ownerPubkey=0556e1ee126ae9c6d8c65d43688be48ec005a4818d0047901f9efc04f0f370f40b`;
    return request;
};

function getRandomInt() {
    return Math.floor(Math.random() * 101 + 1);
};

/**
 * postBase58
 * @event postBase58
 * @param {req}
 */
export const postBase58 = async (req, res) => {
    try {
        const { body: { owner_pubkey, ownerPubkeyFile } } = req;

        fsStart(await extensionCheck(ownerPubkeyFile), owner_pubkey).then(function (data) {
            res.send({
                data
            });
        });
    } catch (error) {
        errorHandler(req, res, error);
    };
};

/**
 * fsStart
 * @event fsStart
 * @param {path, pubkey}
 */
async function fsStart(path, pubkey) {
    return new Promise(function (resolve, reject) {
        fs.exists(path, async function (exists) {  //파일이 있는지 체크
            if (exists) {

                console.log("it's there");

                fs.unlink(path, function (err) { //파일 있으면 삭제
                    if (err) throw err;
                    console.log(`successfully deleted ${path}`);
                });
            } else {
                fs.writeFileSync(path, pubkey, 'binary'); // 없으면 생성
                fs.exists(path, async function (exists) {  //파일이 있는지 체크
                    if (exists) {
                        const key = await cryptoUtil.getPubkey(path); // getKey

                        fs.unlink(path, function (err) { //파일 있으면 삭제
                            if (err) throw err;
                            console.log(`successfully deleted ${path}`);
                        });

                        resolve(key);
                    };
                });
            };
        });
    });
};

/**
 * getRequest
 * @event getRequest
 * @param {url}
 */
function getRequest(url) {
    // console.log("getRequest_url:"+JSON.stringify(url))

    const options = {
        //   proxy:'PROXY URL', 
        uri: url,
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            try {
                if (error) {
                    // console.log("🚀 ~ file: apiController.js ~ getRequest ~ error", error)
                    console.error(`Request Error : ${error}`);
                    return reject(`Request Error : ${error}`);
                }
                resolve(JSON.parse(body));
            } catch (e) {
                return reject({
                    errorMsg: "Request 실패",
                    error: e
                });
            };
        });
    });
};

/**
 * postRequest
 * @event postRequest
 * @param {apiPath}
 */
function postRequest(apiPath) {
    // console.log("apiPath:"+apiPath)
    const options = {
        uri: apiPath,
        method: 'POST'
    };

    return new Promise(function (resolve, reject) {
        try {
            request.post(options, function (error, response, body) {
                try {
                    if (error) {
                        // console.log("🚀 ~ file: apiController.js ~ postRequest ~ error", error)
                    };

                    if (!error && response.statusCode == 200) {
                        resolve(JSON.parse(body));
                    } else {
                        console.error('Request Error');
                        return reject('Request Error');
                    };
                } catch (e) {
                    return reject({
                        errorMsg: "Request 실패",
                        error: e
                    });
                };
            });
        } catch (error) {
            console.log('error', error);
        };
    });
};

/**
 * extensionCheck
 * @method extensionCheck
 * @return {fileName}
 */
async function extensionCheck(fileName) {
    const
        ran = Math.random().toString(36).substr(2, 11),//랜덤문자열
        extension = fileName.split('.')[1] == 'pem' ? 'pem' : 'fin', //확장자
        path = `./download/ed_${ran}.${extension}`; //path 생성
    return path;
};


/**
 * log
 * @event log
 * @param {params}
 */
function log(params) {
    if (!params) {
        console.log('*************************************************');
    } else {
        console.log(`********************${params}********************`);
    };
};
