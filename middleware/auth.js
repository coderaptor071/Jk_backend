const { sendResponse, verifyToken } = require("../utils/HelperFunctions");

const authenticated = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return sendResponse(res, false, 401, "Access token not found");
    let token = req.headers.authorization.split(" ");
    req.user = await verifyToken(token[1].trim());
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendResponse(res, false, 401, "Jwt token Expired");
    }
    return sendResponse(res, false, 500, error);
  }
};

module.exports = {
  authenticated,
};
