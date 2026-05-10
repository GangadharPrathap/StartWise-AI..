import * as resendService from "../services/resendService.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/responseFormatter.js";

export const sendEmail = catchAsync(async (req, res, next) => {
  const { to, subject, body } = req.body;
  const data = await resendService.sendEmail({ to, subject, body });
  sendSuccess(res, data, "Email sent successfully");
});
