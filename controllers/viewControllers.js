// layout set
const LAYOUT_HOME = 'layouts/layout-home';

const LAYOUT_BLOCKS = 'layouts/layout-blocks';
const LAYOUT_BLOCK_DETAILS = 'layouts/layout-blockDetails';

const LAYOUT_TXNS = 'layouts/layout-txns';
const LAYOUT_TRANS_HASH_DETAILS = 'layouts/layout-transHashDetails';

const LAYOUT_ACCOUNTS = 'layouts/layout-accounts';
const LAYOUT_ACCOUNT_DETAILS = 'layouts/layout-accountDetails';

const LAYOUT_CONTRACT = 'layouts/layout-contract';
const LAYOUT_NODE = 'layouts/layout-node';

const LAYOUT_TRACKER = 'layouts/layout-tracker';
const LAYOUT_TRANSFER = 'layouts/layout-transfer';
const LAYOUT_TOKEN_DETAILS = 'layouts/layout-tokenDetails';

const LAYOUT_NFT = 'layouts/layout-nft';
const LAYOUT_NFT_DETAILS = 'layouts/layout-nftDetails';
const LAYOUT_NFT_SUB_DETAILS = 'layouts/layout-nftSubDetails';

const LAYOUT_TEST = 'layouts/layout-test';
const LAYOUT_SEARCHERROR = 'layouts/layout-searchError';

/* Home */
export const getHome = async (req, res, next) => {  
  console.log('==================getHome==================');    
  try {
    res.render('pages/home', {
      pageTitle: "Home",
      layout: LAYOUT_HOME
    });
  } catch (error) {
    errorHandler(req, res, error);
  };
};

/* Blocks Menu */
export const getLatestBlocks = async (req, res, next) => {  
  console.log('==================getBlocks==================');  
  try {
    res.render('pages/blockchain/blocks', {
      pageTitle: "Blocks",
      layout: LAYOUT_BLOCKS
    });
  } catch (error) {
    errorHandler(req, res, error);
  };
};

export const getBlockDetails = async (req, res) => {
  console.log('==================getBlockDetails==================');
  const { params: { trans, blkNum, blkHash } } = req;

  try {
      res.render("pages/blockchain/blockDetails", {
          pageTitle: "Block Details",
          layout: LAYOUT_BLOCK_DETAILS,        
          trans,
          blkNum,
          blkHash         
      });
  } catch (error) {
      errorHandler(req, res, error);
  };
};

export const getBlockHash = async (req, res) => {

  const { params: { trans, blkNum, blkHash } } = req;
  try {
      res.render("pages/blockchain/blocksHash", {
          pageTitle: "Block Hash",
          layout: LAYOUT_BLOCK_HASH,
          trans,
          blkNum,
          blkHash
      });
  } catch (error) {
      errorHandler(req, res, error);
  };
};

/* Transaction Menu */
export const getLatestTxns = async (req, res, next) => {    
  console.log('==================getLatestTxns==================');
  try {
    res.render('pages/blockchain/txns', {
      pageTitle: "Txns",
      layout: LAYOUT_TXNS
    });
  } catch (error) {
    errorHandler(req, res, error);
  };
};

export const getTransHashDetails = async (req, res) => {
  console.log('==================getTransHashDetails==================');
  const { params: { hash } } = req
  try {
      res.render("pages/blockchain/transHashDetails", {
          pageTitle: "Transaction Hash Details",
          layout: LAYOUT_TRANS_HASH_DETAILS,
          hash: hash,
      });
  } catch (error) {
      errorHandler(req, res, error);
  };
}

/* Contract Menu */
export const getContract = async (req, res, next) => {    
  try {
    res.render('pages/blockchain/contract', {
      pageTitle: "Contract",
      layout: LAYOUT_CONTRACT
    });
  } catch (error) {
    errorHandler(req, res, error);
  };
};

/* Accounts Menu */
export const getAccounts = async (req, res, next) => { 
  console.log('==================getAccounts==================');  
  try { 
    res.render('pages/blockchain/accounts', {
      pageTitle: "Accounts",
      layout: LAYOUT_ACCOUNTS
    });
  } catch (error) {
    errorHandler(req, res, error);
  };
};

export const getAccountDetails = async (req, res) => {
  console.log('==================getAccountDetails==================');
  const { params: { accountNum } } = req;
  //console.log('accountNum:' + accountNum);
  try {
      res.render("pages/blockchain/accountDetails", {
          pageTitle: "Account Details",
          layout: LAYOUT_ACCOUNT_DETAILS,        
          accountNum             
      });
  } catch (error) {
      errorHandler(req, res, error);
  };
};

/* Node Menu */
export const getNode = async (req, res, next) => { 
   try {   
    res.render('pages/blockchain/node', {
      pageTitle: "Node",
      layout: LAYOUT_NODE
    });
  } catch (error) {
    errorHandler(req, res, error);
  };
};

/* Tracker Menu */
export const getTracker = async (req, res, next) => { 
  console.log('==================getTracker==================');   
  try {
    res.render('pages/tokens/tracker', {
      pageTitle: "Tracker",
      layout: LAYOUT_TRACKER
    });
  } catch (error) {
    errorHandler(req, res, error);
  };
};

/* Transfer Menu */
export const getTransfer = async (req, res, next) => {    
  console.log('==================getTransfer==================');    
  try { 
    res.render('pages/tokens/transfer', {
      pageTitle: "Transfer",
      layout: LAYOUT_TRANSFER
    });
  } catch (error) {
    errorHandler(req, res, error);
  };
};

/* TokenDetails Menu */
export const getTokenDetails = async (req, res, next) => {    
  console.log('==================getTokenDetails==================');   
  const { params: { tokenAction } } = req;
 // console.log('tokenAction:' + tokenAction);
  try {  
    res.render('pages/tokens/tokenDetails', {
      pageTitle: "Token Detail",
      layout: LAYOUT_TOKEN_DETAILS,
      tokenAction
    });
  } catch (error) {
    errorHandler(req, res, error);
  };
};

/* NFT Menu */
export const getNft = async (req, res, next) => {    
  console.log('==================getNftList==================');  
  try {  
    res.render('pages/nft/nftList', {
      pageTitle: "NFT",
      layout: LAYOUT_NFT
    });
  } catch (error) {
    errorHandler(req, res, error);
  };
};

export const getNftDetails = async (req, res) => {
  console.log('==================getNftDetails==================');
  const { params: { scAction } } = req;
  //console.log('scAction:' + scAction);
  try {
      res.render("pages/nft/nftDetails", {
          pageTitle: "NFT Details",
          layout: LAYOUT_NFT_DETAILS,        
          scAction             
      });
  } catch (error) {
      errorHandler(req, res, error);
  };
};

export const getNftSubDetails = async (req, res) => {
  console.log('==================getNftSubDetails==================');
  const { params: { accountNum, scAction, subId } } = req;
  // console.log('accountNum:' + accountNum);
  // console.log('scAction:' + scAction);
  // console.log('subId:' + subId);

  try {
      res.render("pages/nft/nftSubDetails", {
          pageTitle: "NFT Sub Details",
          layout: LAYOUT_NFT_SUB_DETAILS,      
          accountNum,  
          scAction, 
          subId, 
      });
  } catch (error) {
      errorHandler(req, res, error);
  };
};


/* Test */
export const getTest = async (req, res, next) => {  
  console.log('==================getTest==================');    
  res.render('pages/test', {
    pageTitle: "Test",
    layout: LAYOUT_TEST
  });
};

/* Error */
export const getErrorWithMsg = async (req, res, next) => { 
  console.log('==================getErrorWithMsg==================');      
  const { params: { errMsg } } = req;

  try{
      res.render('pages/searchError', {
          pageTitle: "Error",
          layout: LAYOUT_SEARCHERROR,
          errMsg
      });
  } catch (error) {
      errorHandler(req, res, error);
  };
};
