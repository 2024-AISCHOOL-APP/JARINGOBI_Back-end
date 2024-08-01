import * as likeRepository from '../data/like.js';

export async function like(req, res) {
  const postId = req.params.id;
  const userId = req.userId;
  const commentId = req.params.commentId;

  const existingLike = await likeRepository.existingLike(postId, userId, commentId);
  if (existingLike) {
    return res.status(400).json({ message: '이미 좋아요를 누른 게시물 혹은 댓글임' });
  }
  const like = likeRepository.addLike(postId, userId, commentId);
  res.status(201).json(like);
}

export async function likeCount(req, res) {
  const postId = parseInt(req.params.id, 10);
  const commentId = req.params.commentId;
  let likeCount;
  if (commentId) {
    commentId = parseInt(req.params.commentId, 10);
    likeCount = await likeRepository.likeCount(postId, commentId);
  }
  likeCount = await likeRepository.likeCount(postId);
  res.status(200).json(likeCount);
}

export async function deleteLike(req, res) {
  const postId = req.params.id;
  const userId = req.userId;
  const commentId = req.params.commentId;
  const existingLike = await likeRepository.existingLike(postId, userId, commentId);
  if (!existingLike) {
    return res.status(400).json({ message: '좋아요가 눌러지지 않은 게시물 혹은 댓글임' });
  }
  if (existingLike.userId !== req.userId) {
    return res.sendStatus(403);
  }
  await likeRepository.remove(postId, userId, commentId);
  res.sendStatus(204);
}
