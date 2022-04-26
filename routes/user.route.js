import express from 'express';
import bcrypt from 'bcryptjs';
import { readFile } from 'fs/promises';

import userModel from '../models/user.model.js';
import validate from '../middlewares/validate.mdw.js';

const schema = JSON.parse(await readFile(new URL('../schemas/user.json', import.meta.url)));
const router = express.Router();

router.post('/', validate(schema), async function (req, res) {
  let user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  const ret = await userModel.add(user);

  user = {
    id: ret[0],
    ...user
  }
  delete user.password;

  res.status(201).json(user);
})

export default router;