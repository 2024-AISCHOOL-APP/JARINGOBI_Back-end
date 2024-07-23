import * as postsRepository from '../data/community.js';

export async function createPost(req, res) {
  const { text, title, tag } = req.body;
  const post = await postsRepository.create(text, title, tag, req.userId);
  res.status(201).json(post);
}
