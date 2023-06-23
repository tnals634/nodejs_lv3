const express = require("express");
const router = express();
const { Op } = require("sequelize");
const authMiddleware = require("../middlewares/auth-middleware");

const { Posts, Users } = require("../models");

//게시글 작성 API
router.post("/posts", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const { userId } = res.locals.user;

  const user = await Users.findOne({ where: { userId } });
  if (!title || !content) {
    return res
      .status(412)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  } else if (typeof title !== "string") {
    return res
      .status(412)
      .json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
  } else if (typeof content !== "string") {
    return res
      .status(412)
      .json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
  }

  try {
    await Posts.create({
      UserId: userId,
      nickname: user.nickname,
      title,
      content,
    });

    res.status(201).json({ message: "게시글 작성에 성공하였습니다." });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "게시글 작성에 실패하였습니다." });
  }
});

//게시글 목록 조회 API
router.get("/posts", async (req, res) => {
  const posts = await Posts.findAll({
    attributes: [
      "postId",
      "UserId",
      "nickname",
      "title",
      "createdAt",
      "updatedAt",
    ],
    order: [["createdAt", "DESC"]],
  });

  res.json({ posts: posts });
});

//게시글 상세 조회 API
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Posts.findOne({
      attribute: [
        "postId",
        "UserId",
        "nickname",
        "title",
        "content",
        "createdAt",
        "updatedAt",
      ],
      where: { postId },
    });

    res.json({ post: post });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "게시글 조회에 실패했습니다." });
  }
});

//게시글 수정 API
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  const { userId } = res.locals.user;

  const post = await Posts.findOne({ where: { postId } });

  if (!title || !content) {
    return res
      .status(412)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  } else if (typeof title !== "string") {
    return res
      .status(412)
      .json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
  } else if (typeof content !== "string") {
    return res
      .status(412)
      .json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
  } else if (!post) {
    return res
      .status(403)
      .json({ errorMessage: "게시글이 존재하지 않습니다." });
  } else if (userId !== post.UserId) {
    return res
      .status(403)
      .json({ errorMessage: "게시글 수정 권한이 존재하지 않습니다." });
  }
  try {
    await Posts.update(
      { title, content },
      {
        where: {
          [Op.and]: [{ postId }, { UserId: userId }],
        },
      }
    );
    return res.status(200).json({ message: "게시글이 수정되었습니다." });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "게시글 수정에 실패하였습니다." });
  }
});

//게시글 삭제 API
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  const post = await Posts.findOne({ where: { postId } });

  if (!post) {
    return res
      .status(404)
      .json({ errorMessage: "게시글이 존재하지 않습니다." });
  } else if (userId !== post.UserId) {
    return res
      .status(403)
      .json({ errorMessage: "게시글의 삭제 권한이 존재하지 않습니다." });
  }
  try {
    await Posts.destroy({
      where: { [Op.and]: [{ postId }, { UserId: userId }] },
    });

    res.json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "게시글이 정상적으로 삭제되지 않았습니다." });
  }
});

module.exports = router;
