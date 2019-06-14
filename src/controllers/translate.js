import { Router } from 'express';
import translate from '@vitalets/google-translate-api';

const router = Router();

router.post('/', (req, res) => {
  if (!req.body.text) {
    res.status(500).json({ code: 500, message: 'No text specified' });
  } else if (!req.body.to) {
    res.status(500).json({ code: 500, message: 'No target language specified' });
  } else if (!req.body.from) {
    translate(decodeURIComponent(req.body.text), { to: req.body.to })
      .then((output) => {
        res
          .status(200)
          .json({
            code: 200,
            message: output.text,
            lang: {
              from: output.from.language.iso,
              to: req.body.to,
              autocorrect: output.from.text.autoCorrected,
            },
          });
      })
      .catch((err) => {
        res.status(500).json({ code: 500, message: 'Error when translating' });
      });
  } else {
    res.status(500).json({ code: 500, message: 'No valid arguments found' });
  }
});

export default router;
