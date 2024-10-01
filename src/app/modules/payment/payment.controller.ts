import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import { join } from "path";
import { readFileSync } from "fs";
const createPayment = catchAsync(async (req, res) => {
  const result = await paymentService.createPaymentIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment successful",
    data: result,
  });
});
const paymentConfirmation = catchAsync(async (req, res) => {
  const confirmationFile = join(
    __dirname,
    "../../../../public/confirmation.html"
  );
  const template = readFileSync(confirmationFile, "utf-8");

  res.send(template);
});

export const paymentController = {
  createPayment,
  paymentConfirmation,
};
