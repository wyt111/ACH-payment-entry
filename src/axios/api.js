export default {
  //------------------------- 公共接口 -------------------------
  "post_sendEmail": '/mail/sending',
  "post_login": '/user/login',
  "post_outLogin": '/login/to-logout',
  "get_transactionHistory": '/trade/list',
  "get_buyCryptoInfo": '/crypto/buy/v2',
  //国家法币列表
  "get_countryList": '/crypto/world/list',

  //------------------------- 买币接口 -------------------------
  "get_network": '/crypto/network',
  "get_inquiryFee": '/crypto/fee',
  "post_coinSupportedWallet": '/crypto/wallet/check',
  "post_buy": '/trade/create',
  "post_indonesiaBuy": '/pay/idr/submit',
  "post_internationalCard": '/pay/card/submit',
  "post_saveCardInfo": '/user/card/submit',
  "post_getCardInfo": '/trade/confirm',
  "get_payResult": '/pay/result/check',
  "post_basisIdAuth": '/kyc/auth/check',
  "post_storageBasisIdAuth": '/kyc/auth/create',
  "get_isbasisIdAuth": '/kyc/auth/status',
  "get_orderVerification": '/merchant/order/check',
  "post_mxnSubmit": '/pay/mxn/submit',
  //查询货币支持的支付方式
  "get_payMethods": '/crypto/payment/v2',
  //查询订单状态
  "get_orderState": '/trade/',

  //------------------------- 卖币接口 -------------------------
  //卖币查询费用
  "get_inquiryFeeSell": '/crypto/sell/fee',
  //银行列表
  "get_bank": '/world/bank/list',
  //获取卖币用户卡信息
  "get_userSellCardInfo": '/user/card/query/sell',
  //卖币确认订单
  // "post_sellConfirmOrder": '/trade/confirm/sell/order',
  //查询卖币订单订单状态
  "get_PlayCurrencyStatus":'/trade/query/sellOrder',
  //获取卖币支持网络
  "get_networkList":'/crypto/sell/network',
  //卖币确认订单
  "post_sellForm": '/trade/create/sell/coin/order',
  //历史卡信息列表
  "get_cardList": '/user/card/query/sell/list',
    //------------------------- kyc验证获取token接口 -------------------------
    //获取kyc验证token
  "post_getKycToken":'/kyc/getKycToken',
  //买币是否要kyc验证
  "post_getKycThrough":'/rypto/buyKycThrough'
}
