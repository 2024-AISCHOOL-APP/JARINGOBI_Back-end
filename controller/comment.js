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
