import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import randomstring from 'randomstring';
import { readFile } from 'fs/promises';

import userModel from '../models/user.model.js';
import validate from '../middlewares/validate.mdw.js';

const schema = JSON.parse(await readFile(new URL('../schemas/login.json', import.meta.url)));
const rfSchema = JSON.parse(await readFile(new URL('../schemas/rf.json', import.meta.url)));
const router = express.Router();

router.post('/', validate(schema), async function (req, res) {
  const user = await userModel.findByUsername(req.body.username);
  if (user === null) {
    return res.status(401).json({
      authenticated: false
    });
  }

  if (bcrypt.compareSync(req.body.password, user.password) === false) {
    return res.status(401).json({
      authenticated: false
    });
  }

  const payload = {
    userId: user.id,
    // roles: ['film:list', 'film:add', 'film:update', ...]
  }
  const opts = {
    expiresIn: 100 * 60 // seconds
  }
  const accessToken = jwt.sign(payload, 'SECRET_KEY', opts);

  const refreshToken = randomstring.generate(80);
  await userModel.patch(user.id, {
    rfToken: refreshToken
  })

  res.json({
    authenticated: true,
    accessToken,
    refreshToken
  })
})

router.post('/refresh', validate(rfSchema), async function (req, res) {
  const { accessToken, refreshToken } = req.body;
  try {
    const opts = {
      ignoreExpiration: true
    };
    const { userId } = jwt.verify(accessToken, 'SECRET_KEY', opts);
    const ret = await userModel.isValidRefreshToken(userId, refreshToken);
    if (ret === true) {
      const newAccessToken = jwt.sign({ userId }, 'SECRET_KEY', { expiresIn: 600 });
      return res.json({
        accessToken: newAccessToken
      })
    }

    return res.status(401).json({
      message: 'RefreshToken is revoked.'
    })
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: 'Invalid accessToken.'
    })
  }
})

export default router;