import * as commentsRepository from '../data/comment.js';

export async function getComments(req, res) {
  const postId = req.params.id;
  const data = await commentsRepository.getAll(postId);
  res.status(200).json(data);
}

export async function createComments(req, res) {
  const postId = req.params.id;
  const { text } = req.body;
  const comment = await commentsRepository.create(text, req.userId, postId);
  res.status(201).json(comment);
}

export async function updateComment(req, res) {
  const postId = req.params.id;
  const commentId = req.params.commentId;
  const { text } = req.body;
  const comment = await commentsRepository.getById(postId, commentId);
  if (!comment) {
    return res.status(404).json({ message: `Comment not found : ${commentId}` });
  }
  if (comment.userId !== req.userId) {
    return res.sendStatus(403);
  }
  const updated = await commentsRepository.update(postId, commentId, text);
  res.status(200).json(updated);
}

export async function deleteComment(req, res) {
  const postId = req.params.id;
  const commentId = req.params.commentId;
  const comment = await commentsRepository.getById(postId, commentId);
  if (!comment) {
    return res.status(404).json({ message: `Comment not found : ${commentId}` });
  }
  if (comment.userId !== req.userId) {
    return res.sendStatus(403);
  }
  await commentsRepository.remove(postId, commentId);
  res.sendStatus(204);
}
