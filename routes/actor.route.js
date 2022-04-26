import express from 'express';
import { readFile } from 'fs/promises';

import actorService from '../actorService.js';
import validate from '../middlewares/validate.mdw.js';

const schema = JSON.parse(await readFile(new URL('../schemas/actor.json', import.meta.url)));
const router = express.Router();

router.get('/', function (req, res) {
  actorService.list({}, (error, response) => {
    if (!error) {
      return res.json(response);
    }
    return res.status(404).json(error);
  });
});

router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;

  actorService.get({ id }, (error, response) => {
    if (!error) {
      return res.json(response);
    }
    return res.status(404).json(error);
  });
});

router.post('/', validate(schema), async function (req, res) {
  const { first_name, last_name } = req.body;

  actorService.create({ first_name, last_name }, (error, response) => {
    if (!error) {
      return res.json(response);
    }
    return res.status(404).json(error);
  });
});

router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  actorService.delete({ id }, (error, response) => {
    if (!error) {
      return res.json(response);
    }
    return res.status(404).json(error);
  });
});

router.patch('/:id', validate(schema), async function (req, res) {
  const id = req.params.id || 0;
  const { first_name, last_name } = req.body;
  actorService.update({ actor_id: id, first_name, last_name }, (error, response) => {
    if (!error) {
      return res.json(response);
    }
    return res.status(404).json(error);
  });
});

export default router;
