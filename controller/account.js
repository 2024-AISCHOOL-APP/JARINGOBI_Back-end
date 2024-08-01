import * as accountRepository from '../data/account.js';

export async function createAccount(req, res) {
  const userId = req.userId;
  const { first, second, amount, description, title } = req.body;
  const account = await accountRepository.create(userId, first, second, amount, description, title);
  res.status(201).json(account);
}

export async function getAccounts(req, res) {
  const userId = req.userId;
  let year = req.query.year;
  let month = req.query.month;
  let day = req.query.day;
  let data;
  if (month) {
      if (day) data = await accountRepository.getAllDateDay(userId, year, month, day);
      else data = await accountRepository.getAllDateMonth(userId, year, month);
  } else data = await accountRepository.getAllDateYear(userId, year);
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
  const { accId, first, second, amount, description, title } = req.body
  const acc = await accountRepository.getById(accId);
  if (!acc) {
    res.status(404).json({ message: `Account id(${accId}) not found` });
  }
  if (acc.userId !== userId) {
    return res.sendStatus(403);
  }
  const updated = await accountRepository.update(accId, first, second, amount, description, title);
  res.status(200).json(updated);
}

export async function deleteAccount(req, res) {
  const userId = req.userId;
  // const accId = req.params.id;
  const { accId } = req.body
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
