import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import { seoScoreHandler } from './handlers/seo-score-handler';
import { validateDomainHandler } from './handlers/validate-domain-handler';
import { validateRobotsHandler } from './handlers/validate-robots-handler';
import { validateUrlHandler } from './handlers/validate-url-handler';
import { fileValidator, textInputValidator } from './handlers/intermediate-file-validator'

export const app = express();
app.use(compression());
app.use(bodyParser.json({ limit: '1mb' }));

app.set('view engine', 'ejs');
app.use(express.static('public', { maxAge: 86400000 }));

const corsMiddleware = cors({
  methods: 'POST',
  origin(origin, callback): void {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (
      origin.endsWith('quintype.com') ||
      (process.env.NODE_ENV !== 'production' &&
        origin.startsWith('http://localhost:'))
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
});

app.options('/api/*', corsMiddleware)

app.get('/', (_, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public,max-age=60');
  res.redirect(301, 'https://developers.quintype.com/quintype-validator');
});

app.post('/api/validate.json', corsMiddleware, (req, res) => {
  const url = req.body.url;
  if (url) {
    const handler = url.startsWith('http') ? validateUrlHandler : validateDomainHandler   
    return handler(req, res) 
  }
  return res.status(400).json({ error: { message: 'Missing url' } });
});

app.post('/api/seo-scores', corsMiddleware, seoScoreHandler);

app.get('/validate-robots', validateRobotsHandler);

app.get('/ping', (_, res) => res.send('pong'));

app.post('/api/validate', corsMiddleware, textInputValidator);

app.post('/api/validate-file', corsMiddleware, fileValidator);
