const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
  const { authorization } = req.cookies;
  const [tokenType, token] = (authorization ?? "").split(" ");
  if (tokenType !== "Bearer" || !token) {
    return res.status(401).json({
      errorMessage: "로그인이 필요한 기능입니다.",
    });
  }

  try {
    const decodedToken = jwt.verify(token, "nodejs_lv3_key");
    const userId = decodedToken.userId;

    const user = await Users.findOne({ where: { userId } });

    if (!user) {
      return res.status(401).json({ errorMessage: "회원가입이 필요합니다." });
    }

    res.locals.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
  }
};
