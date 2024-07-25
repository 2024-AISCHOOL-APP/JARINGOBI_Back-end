import * as accountRepository from '../data/account.js';

export async function createAccount(req, res) {
  const userId = req.userId;
  const { first, second, amount, description } = req.body;
  const account = await accountRepository.create(userId, first, second, amount, description);
  res.status(201).json(account);
}
