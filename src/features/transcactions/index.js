const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: false,
  clientKey: process.env.MIDTRANS_PUBLIC_CLIENT,
  serverKey: process.env.MIDTRANS_PUBLIC_SECRET,
});

async function transcationProcess(name ,price, order_id, gross_amount) {
  const parameter = {
    items_detail: {
      name: name,
      price: price,
    },
    transaction_details: {
      order_id: order_id,
      gross_amount: gross_amount,
    },
  };

  const token = await snap.createTransaction(parameter)

  return token
}

module.exports = {
    transcationProcess
}
