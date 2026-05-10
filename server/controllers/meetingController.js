import * as dailyService from "../services/dailyService.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/responseFormatter.js";

export const generateMeetingLink = catchAsync(async (req, res, next) => {
  const link = await dailyService.generateDailyRoom();
  sendSuccess(res, { link }, "Meeting link generated successfully");
});
