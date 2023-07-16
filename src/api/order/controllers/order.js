"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const result = await super.create(ctx);

    console.log("result", result);

    // const midtransClient = require("midtrans-client");
    // // Create Snap API instance
    // let snap = new midtransClient.Snap({
    //   isProduction: false,
    //   serverKey: "SB-Mid-server-2sjK-ByTmr-t9t-eJ-I6ljHN",
    //   clientKey: "SB-Mid-client-lRcQRKg7yZaJ9y11",
    // });

    // let parameter = {
    //   transaction_details: {
    //     order_id: result.data.id,
    //     gross_amount: result.data.attributes.totalPrice,
    //   },
    //   credit_card: {
    //     secure: true,
    //   },
    // };

    // let response = await snap.createTransaction(parameter);

    const midtransClient = require("midtrans-client");
    let core = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: "SB-Mid-server-2sjK-ByTmr-t9t-eJ-I6ljHN",
      clientKey: "SB-Mid-client-lRcQRKg7yZaJ9y11",
    });
    // Payment Method: Bank Transfer
    // let parameter = {
    //   payment_type: "bank_transfer",
    //   transaction_details: {
    //     gross_amount: result.data.attributes.totalPrice,
    //     order_id: result.data.id,
    //   },
    //   bank_transfer: {
    //     bank: "bni",
    //   },
    // };
    // Payment Method: Alfamart
    let parameter = {
      payment_type: "cstore",
      transaction_details: {
        gross_amount: result.data.attributes.totalPrice,
        order_id: result.data.id,
      },
      cstore: {
        store: "alfamart",
        alfamart_free_text1: "Thanks for shopping with us!,",
        alfamart_free_text2: "Like us on our Facebook page,",
        alfamart_free_text3: "and get 10% discount on your next purchase.",
      },
      customer_details: {
        first_name: "Budi",
        last_name: "Utomo",
        email: "budi.utomo@midtrans.com",
        phone: "0811223344",
      },
      // item_details: result.data.attributes.items,
    };

    let response = await core.charge(parameter);

    return { result: "ok", data: response };
  },
}));
