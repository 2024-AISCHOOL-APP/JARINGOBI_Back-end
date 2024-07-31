import * as accountRepository from '../data/account.js';

export async function createAccount(req, res) {
  const userId = req.userId;
  const { first, second, amount, description } = req.body;
  const account = await accountRepository.create(userId, first, second, amount, description);
  res.status(201).json(account);
}

export async function getAccounts(req, res) {
  const userId = req.userId;
  let year = req.query.year;
  let month = req.query.month;
  const data = await (
    month ? 
    accountRepository.getAllDateMonth(userId, year, month) 
    : 
    accountRepository.getAllDateYear(userId, year)
  );
  res.status(200).json(data);
}

export async function getAccount(req, res) {
  const userId = req.userId;
  const accId = req.params.id;
  const acc = await accountRepository.getById(accId, userId);
  if (acc) {
    res.status(200).json(acc);
  } else {
    res.status(404).json({ message: `Account id(${accId}) not found` });
  }
}

export async function updateAccount(req, res) {
  const userId = req.userId;
  const accId = req.params.id;
  const { first, second, amount, description } = req.body;
  const acc = await accountRepository.getById(accId);
  if (!acc) {
    res.status(404).json({ message: `Account id(${accId}) not found` });
  }
  if (acc.userId !== userId) {
    return res.sendStatus(403);
  }
  const updated = await accountRepository.update(accId, first, second, amount, description);
  res.status(200).json(updated);
}

export async function deleteAccount(req, res) {
  const userId = req.userId;
  const accId = req.params.id;
  const acc = await accountRepository.getById(accId);
  if (!acc) {
    res.status(404).json({ message: `Account id(${accId}) not found` });
  }
  if (acc.userId !== userId) {
    return res.sendStatus(403);
  }
  await accountRepository.remove(accId);
  res.sendStatus(204);
}
