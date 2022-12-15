import express from "express";
import routes from "../routers";
import {
      getMain,

      getBlocksTotal,
      //getLatestBlocks,
      getBlk,
      getTrans,

      getBpInfo,
      getBpList,
      //getLatestTransactions,
      getTransactionsByBp,
      getTransHash,

      postContractToolJson,
      getCheckAccount,       
     
      getAccountNoById,
      searchAccountDetailInfoByAccId,
      getAccountDetailInfo,
      getNftByAccNum,  

      getUserListData,
      getTokenListData,
      getTransactionsByAccNum,     

      getTrackerInfo,
      getTrackerList,
      getTransferInfo,
      getTransferList,

      getTokenAction,
      searchTokenDetailInfoBySymbol,
      searchTokenDetailInfoByName,
      getTokenDetailInfo,
      getTokenDetailInfoByName,
      getTokenTransfer,
      getTokenHolders,
      getTokenNft,

      getNftList,
      getNftDetail,
      getNftTransfer,
      getNftHolders,
      getNftSubDetail,

      getFinlPrice

} from "../controllers/apiController.js";

const apiRouter = express.Router();

apiRouter.get('/home', (req, res, next) => {    
  res.send(
    {
      result: global.MAIN_PAGE_TEXT_DATA,
      blk: global.latestBlocks.slice(0,20), //랜딩페이지에는 20건만 표시
      txns: global.latestTransactions.slice(0,20) 
    });
}); 

apiRouter.get('/latestBlock', (req, res, next) => {    
  res.send(
    {
      result: global.latestBlocks
    });
}); 

apiRouter.get('/latestTxns', (req, res, next) => {    
  res.send(
    {
      result: global.latestTransactions
    });
}); 

/*Blocks*/
apiRouter.get(routes.blkTotal, getBlocksTotal);
apiRouter.get(routes.blk, getBlk);
apiRouter.get(routes.trans, getTrans);
/*Transactions*/
apiRouter.get(routes.bpInfo, getBpInfo);
apiRouter.get(routes.bpList, getBpList);
apiRouter.get(routes.transactionsByBp, getTransactionsByBp);
apiRouter.get(routes.transHash, getTransHash);
/* Contract*/
apiRouter.post(routes.contractToolJson, postContractToolJson);
apiRouter.get(routes.checkAccount, getCheckAccount);
/*Accounts*/
apiRouter.get(routes.accountNoById, getAccountNoById);
apiRouter.get(routes.accountDetailInfoExistByAccId, searchAccountDetailInfoByAccId);
apiRouter.get(routes.accountDetailInfo, getAccountDetailInfo);
apiRouter.get(routes.nftByAccNum, getNftByAccNum);

apiRouter.get(routes.userList, getUserListData);
apiRouter.get(routes.tokenList, getTokenListData);
apiRouter.get(routes.transactionsByAccNum, getTransactionsByAccNum);
/*Tracker*/
apiRouter.get(routes.trackerInfo, getTrackerInfo);
apiRouter.get(routes.trackerList, getTrackerList);
/*Transfer*/
apiRouter.get(routes.transferInfo, getTransferInfo);
apiRouter.get(routes.transferList, getTransferList);

/*TokenDetails*/
apiRouter.get(routes.tokenAction, getTokenAction);
apiRouter.get(routes.tokenDetailInfo, getTokenDetailInfo);
apiRouter.get(routes.tokenDetailInfoExistBySymbol, searchTokenDetailInfoBySymbol);
apiRouter.get(routes.tokenDetailInfoExistByName, searchTokenDetailInfoByName);
apiRouter.get(routes.tokenDetailInfoByName, getTokenDetailInfoByName);
apiRouter.get(routes.tokenTransfer, getTokenTransfer);
apiRouter.get(routes.tokenHolders, getTokenHolders);
apiRouter.get(routes.tokenNft, getTokenNft);

/*NFT*/
apiRouter.get(routes.nftList, getNftList);
apiRouter.get(routes.nftDetail, getNftDetail);
apiRouter.get(routes.nftTransfer, getNftTransfer);
apiRouter.get(routes.nftHolders, getNftHolders);
apiRouter.get(routes.nftSubDetail, getNftSubDetail);

/*PRICE*/
apiRouter.get(routes.finlPrice, getFinlPrice);

export default apiRouter;
