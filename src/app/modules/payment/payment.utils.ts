import config from "../../config";
import axios from "axios";

type TPaymentData = {
  name: string;
  email: string;
  phone: number;
  address: string;
  totalCost: number;
  transactionId: string;
};

export const initiatePayment = async (paymentData: TPaymentData) => {
  const url = config.payment_url;

  const response = await axios.post(url!, {
    store_id: config.store_id,
    signature_key: config.signature_key,
    tran_id: paymentData.transactionId,
    success_url:
      "https://car-rent-server-theta.vercel.app/api/payment/payment-confirmation",
    fail_url: "http://www.merchantdomain.com/failedpage.html",
    cancel_url: "http://www.merchantdomain.com/cancellpage.html",
    amount: paymentData.totalCost,
    currency: "BDT",
    desc: "Car Reservation Payment",
    cus_name: paymentData.name,
    cus_email: paymentData.email,
    cus_add1: paymentData.address,
    cus_add2: "",
    cus_city: "",
    cus_state: "",
    cus_postcode: "",
    cus_country: "",
    cus_phone: paymentData.phone,
    type: "json",
  });
  return response.data;
};
