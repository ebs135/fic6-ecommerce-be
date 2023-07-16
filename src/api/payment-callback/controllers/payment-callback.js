"use strict";

/**
 * payment-callback controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::payment-callback.payment-callback",
  ({ strapi }) => ({
    async create(ctx) {
      const request = ctx.request.body;
      console.log("request", request);

      let order = await strapi
        .service("api::order.order")
        .findOne(request.order_id);

      let params = {};

      if (request.transaction_status == "settlement") {
        params = { data: { orderStatus: "paid" } };
      } else if (request.transaction_status == "pending") {
        params = { data: { orderStatus: "waitingPayment" } };
      } else {
        params = { data: { orderStatus: "cancel" } };
      }

      let updateOrder = await strapi
        .service("api::order.order")
        .update(request.order_id, params);

      console.log("update data: ", updateOrder);

      return { result: "ok", data: updateOrder };
    },
  })
);