import * as postsRepository from '../data/community.js';

export async function getPosts(req, res) {
  const userId = req.query.userId;
  console.log(req);
  console.log(userId);
  const data = await (userId ? postsRepository.getAllByUserId(userId) : postsRepository.getAll());
  res.status(200).json(data);
}

export async function getPost(req, res) {
  const id = req.params.id;
  const post = await postsRepository.getById(id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: `Post id(${id}) not found` });
  }
}

export async function createPost(req, res) {
  const { text, title, tag } = req.body;
  const post = await postsRepository.create(text, title, tag, req.userId);
  res.status(201).json(post);
}

export async function updatePost(req, res) {
  const id = req.params.id;
  const { text, title, tag } = req.body;
  const post = await postsRepository.getById(id);
  if (!post) {
    return res.status(404).json({ message: `Post not found : ${id}` });
  }
  if (post.userId !== req.userId) {
    return res.sendStatus(403);
  }
  const updated = await postsRepository.update(id, text, title, tag);
  res.status(200).json(updated);
}

export async function deletePost(req, res) {
  const id = req.params.id;
  const post = await postsRepository.getById(id);
  if (!post) {
    return res.status(404).json({ message: `Post not found : ${id}` });
  }
  if (post.userId !== req.userId) {
    return res.sendStatus(403);
  }
  await postsRepository.remove(id);
  res.sendStatus(204);
}
