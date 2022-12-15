import express from 'express';
import { 
  getHome,

  getLatestBlocks,  
  getBlockDetails,
  getBlockHash,

  getLatestTxns,
  getTransHashDetails,

  getAccounts,
  getAccountDetails,

  getNode,

  getContract,

  getTracker,
  getTransfer,
  getTokenDetails,

  getNft,
  getNftDetails,
  getNftSubDetails,
  
  getTest,

  getErrorWithMsg
} 
from "../controllers/viewControllers.js";
const router = express.Router();

router.get('/', getHome);

//Blocks
router.get('/blocks', getLatestBlocks);
router.get('/block-details/:blkNum', getBlockDetails);
router.get('/block-hash/:blkHash', getBlockHash);

//Transactions
router.get('/txns', getLatestTxns);
router.get('/trans-hash-details/:hash', getTransHashDetails);

//Node
router.get('/node', getNode);

//Contract
router.get('/contract', getContract);

//Account
router.get('/accounts', getAccounts);
router.get('/account-details/:accountNum', getAccountDetails);

//Tokens
router.get('/tracker', getTracker);
router.get('/transfer', getTransfer);
router.get('/token-details/:tokenAction', getTokenDetails);

//NFT
router.get('/nft', getNft);
router.get('/nft-details/:scAction', getNftDetails);
router.get('/nft-sub-details/:accountNum/:scAction/:subId', getNftSubDetails);

//Test
router.get('/test', getTest);

//Error
router.get('/error-page/:errMsg', getErrorWithMsg);



export default router;
