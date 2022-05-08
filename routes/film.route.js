import express from 'express';
import { readFile } from 'fs/promises';

import filmService from '../filmService.js';
import validate from '../middlewares/validate.mdw.js';

const schema = JSON.parse(await readFile(new URL('../schemas/film.json', import.meta.url)));
const router = express.Router();

router.get('/', function (req, res) {
  filmService.list({}, (error, response) => {
    if (!error) {
      return res.json(response);
    }
    return res.status(404).json(error);
  });
});

router.get('/:id', function (req, res) {
  const id = req.params.id || 0;

  filmService.get({ id }, (error, response) => {
    if (!error) {
      return res.json(response);
    }
    return res.status(404).json(error);
  });
});

router.post('/', validate(schema), function (req, res) {
  const { body } = req;

  filmService.create(body, (error, response) => {
    if (!error) {
      return res.json(response);
    }
    return res.status(404).json(error);
  });
});

router.delete('/:id', function (req, res) {
  const id = req.params.id || 0;
  filmService.delete({ id }, (error, response) => {
    if (!error) {
      return res.json(response);
    }
    return res.status(404).json(error);
  });
});

router.patch('/:id', validate(schema), function (req, res) {
  const id = req.params.id || 0;

  filmService.update({ film_id: id, ...req.body }, (error, response) => {
    if (!error) {
      return res.json(response);
    }
    return res.status(404).json(error);
  });
});

export default router;
