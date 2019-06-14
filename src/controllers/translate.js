import { Router } from 'express';
import translate from '@vitalets/google-translate-api';

const router = Router();

router.get('/', (req, res) => {
  if (!req.query.text) {
    res.status(500).json({ code: 500, message: 'No text specified' });
  }
  else if (!req.query.to) {
    res.status(500).json({ code: 500, message: 'No target language specified' });
  }
  else if (!req.query.from) {
    translate(decodeURIComponent(req.query.text), { to: req.query.to }).then(output => {
      res.status(200).json({ code: 200, message: output.text, lang: { from: output.from.language.iso, to: req.query.to, autocorrect: output.from.text.autoCorrected } });
    }).catch(err => {
      res.status(500).json({ code: 500, message: 'Error when translating' });
    });
  }
  else {
    res.status(500).json({ code: 500, message: 'No valid arguments found' });
  }
});

export default router;