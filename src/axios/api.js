export default {
  "get_buyCryptoInfo": '/crypto/buy/v1', ///v1
  "post_sendEmail": '/mail/sending',
  "post_login": '/user/login',
  "get_network": '/crypto/network',
  "get_inquiryFee": '/crypto/fee',
  "post_coinSupportedWallet": '/crypto/wallet/check',
  "post_buy": '/trade/create',
  "post_indonesiaBuy": '/pay/idr/submit',
  "post_internationalCard": '/pay/card/submit',
  "post_saveCardInfo": '/user/card/submit',
  "post_getCardInfo": '/trade/confirm',
  "get_transactionHistory": '/trade/list',
  "get_payResult": '/pay/result/check',
  "post_outLogin": '/login/to-logout',
  "post_basisIdAuth": '/kyc/auth/check',
  "post_storageBasisIdAuth": '/kyc/auth/create',
  "get_isbasisIdAuth": '/kyc/auth/status',
  "get_orderVerification": '/merchant/order/check',
  "post_mxnSubmit": '/pay/mxn/submit',
  //查询货币支持的支付方式
  "get_payMethods": '/crypto/payment/',


  "get_countryList": '/crypto/world/list',
  "get_networkList":'/crypto/sell/network',
  "get_userCard":'/user/card/query/sell',
  "get_PlayCurrencyStatus":'/trade/query/sellOrder',

  //卖币查询费用
  "get_inquiryFeeSell": '/crypto/sell/fee',
  //银行列表
  "get_bank": '/world/bank/list',
  //获取卖币用户卡信息
  "get_userSellCardInfo": '/user/card/query/sell',
  //卖币确认订单接口
  "post_sellConfirmOrder": '/trade/confirm/sell/order',
}
