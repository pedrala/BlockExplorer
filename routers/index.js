// Global
const HOME = "/";

/*Blocks*/
const LATEST_BLOCKS = "/latest-blocks";
const GET_LATEST_BLOCKS = "/get-latest-blocks";
const BLK_TOTAL = "/blkTotal";
const BLK = "/blk";
const TRANS = "/trans";

/*Transactions*/
const LATEST_TRANSACTIONS = "/latest-transactions";
const GET_LATEST_TRANSACTIONS = "/get-latest-transactions";
const BP_INFO = "/bpInfo";
const BP_LIST = "/bpList";
const TRANSACTIONSBYBP = "/transactionsbybp";
const TRANS_HASH = "/transhash";

/* Contract*/
const CHECK_ACCOUNT = "/check-account";
const CONTRACT_TOOL_JSON = "/tool-json";
const CONTRACT = "/contract";

/*Accounts*/
const ACCOUNTNO_BYID = "/accountNoById";
const ACCOUNT_DETAIL_INFO_EXISTBYACCID = "/accountDetailInfoByAccId";
const ACCOUNT_DETAIL_INFO = "/accountDetailInfo";
const NFTBYACCNUM = "/nftbyaccnum";

const USER_LIST = "/userList"
const TOKEN_LIST = "/tokenList"
const TRANSACTIONSBYACCNUM = "/transactionsbyaccnum";

/*Tracker*/
const TRACKER_INFO = "/trackerInfo";
const TRACKER_LIST = "/trackerList";

/*Transfer*/
const TRANSFER_INFO = "/transferInfo";
const TRANSFER_LIST = "/transferList";

/*TokenDetails*/
const TOKENACTION_BY_TOKENSYMBOL = "/tokenActionByTokenSymbol";
const TOKEN_DETAIL_INFO = "/tokenDetailInfo";
const TOKEN_DETAIL_INFO_EXISTBYSYMBOL = "/searchTokenDetailInfoBySymbol";
const TOKEN_DETAIL_INFO_EXISTBYNAME = "/searchTokenDetailInfoByName";
const TOKEN_DETAIL_INFO_BYNAME = "/tokenDetailInfoByName";
const TOKENTRANSFER = "/tokenTransfer";
const TOKENHOLDERS = "/tokenHolders";
const TOKENNFT = "/tokenNft";

/*NFT*/
const NFT_LIST = "/nftList";
const NFT_DETAIL = "/nftDetail";
const NFTTRANSFER = "/nftTransfer";
const NFTHOLDERS = "/nftHolders";   
const NFT_SUB_DETAIL = "/nftSubDetail";

const FINL_PRICE = "/finlPrice"

/* Search */
const SEARCH = "/search";

 const routes = {   
    home: HOME,

    latestBlocks: LATEST_BLOCKS,
    getLatestBlocks: GET_LATEST_BLOCKS,
    blkTotal:BLK_TOTAL,
    blk: BLK,
    trans: TRANS,

    latestTxns: LATEST_TRANSACTIONS,   
    getLatestTransactions: GET_LATEST_TRANSACTIONS,    
    bpInfo: BP_INFO,   
    bpList: BP_LIST,   
    transactionsByBp: TRANSACTIONSBYBP,
    transHash: TRANS_HASH,  

    checkAccount: CHECK_ACCOUNT,
    contractToolJson: CONTRACT_TOOL_JSON,
    contract: CONTRACT,
    
    accountNoById: ACCOUNTNO_BYID,
    accountDetailInfoExistByAccId: ACCOUNT_DETAIL_INFO_EXISTBYACCID,
    accountDetailInfo: ACCOUNT_DETAIL_INFO,
    accountDetailInfo: ACCOUNT_DETAIL_INFO,
    nftByAccNum: NFTBYACCNUM,

    userList: USER_LIST,
    tokenList:TOKEN_LIST,
    transactionsByAccNum: TRANSACTIONSBYACCNUM,

    trackerInfo: TRACKER_INFO,  
    trackerList: TRACKER_LIST,
    transferInfo: TRANSFER_INFO,  
    transferList: TRANSFER_LIST,

    tokenAction: TOKENACTION_BY_TOKENSYMBOL,
    tokenDetailInfo: TOKEN_DETAIL_INFO,
    tokenDetailInfoExistBySymbol: TOKEN_DETAIL_INFO_EXISTBYSYMBOL,
    tokenDetailInfoExistByName:TOKEN_DETAIL_INFO_EXISTBYNAME,
    tokenDetailInfoByName: TOKEN_DETAIL_INFO_BYNAME,
    tokenTransfer: TOKENTRANSFER,
    tokenHolders: TOKENHOLDERS,    
    tokenNft: TOKENNFT,    

    nftList: NFT_LIST,
    nftDetail: NFT_DETAIL,
    nftHolders: NFTHOLDERS,
    nftTransfer: NFTTRANSFER,
    nftSubDetail: NFT_SUB_DETAIL,

    finlPrice: FINL_PRICE,

    search: SEARCH,
 };


 export default routes;
