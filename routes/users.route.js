const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { Users } = require("../models");

//회원 가입 API
router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;
  const isExistUser = await Users.findOne({
    where: {
      nickname: nickname,
    },
  });
  //데이터 형식이 맞는지 검사
  const scriptTag = /[~!@#\$%\^&\*\(\)_\+\-={}\[\];:<>,\.\/\?\"\'\/\|\\]/; // 특수문자들
  const validationNickname = /^(?=.*[a-zA-Z])(?=.*[0-9]).{3,20}$/;
  const validationPassword =
    /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{4,25}$/;
  try {
    if (
      validationNickname.test(nickname) === false ||
      scriptTag.test(nickname) === true
    ) {
      return res
        .status(412)
        .json({ errorMessage: "닉네임 형식이 일치하지 않습니다." });
    } else if (validationPassword.test(password) === false) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드 형식이 일치하지 않습니다." });
    } else if (isExistUser) {
      return res.status(409).json({ errorMessage: "중복된 닉네임입니다." });
    } else if (password !== confirm) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드가 일치하지 않습니다." });
    } else if (password.search(nickname) > -1) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
    }

    await Users.create({ nickname, password });

    return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
  }
});
//로그인
router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;

  const user = await Users.findOne({
    where: { nickname: nickname },
  });

  if (!user || user.password !== password) {
    return res
      .status(412)
      .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
  }
  try {
    const token = jwt.sign(
      {
        userId: user.userId,
      },
      "nodejs_lv3_key"
    );
    res.cookie("authorization", `Bearer ${token}`);
    return res.json({ token: token });
  } catch (error) {
    return res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
  }
});

module.exports = router;
