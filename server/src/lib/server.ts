import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import {
  getFiles,
  intermediateValidator
} from './handlers/intermediate-file-validator';
import { seoScoreHandler } from './handlers/seo-score-handler';
import { validateDomainHandler } from './handlers/validate-domain-handler';
import { validateRobotsHandler } from './handlers/validate-robots-handler';
import { validateUrlHandler } from './handlers/validate-url-handler';
import { WorkerThreadPool } from './utils/worker-thread-pool';
const config = require('js-yaml').load(fs.readFileSync('config/migrator.yml'));

export const app = express();

//creating thread poll with s3 validator file
const workerPool = new WorkerThreadPool(
  path.join(__dirname, 'runners/validate-s3-files.js'),
  config['workerThreads'] || 2
);
workerPool.setMaxListeners(500);
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

app.options('/api/*', corsMiddleware);

app.get('/', (_, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public,max-age=60');
  res.redirect(301, 'https://developers.quintype.com/quintype-validator');
});

app.post('/api/validate.json', corsMiddleware, (req, res) => {
  const url = req.body.url;
  if (url) {
    const handler = url.startsWith('http')
      ? validateUrlHandler
      : validateDomainHandler;
    return handler(req, res);
  }
  return res.status(400).json({ error: { message: 'Missing url' } });
});

app.post('/api/seo-scores', corsMiddleware, seoScoreHandler);

app.get('/validate-robots', validateRobotsHandler);

app.get('/ping', (_, res) => res.send('pong'));

app.post('/api/get-s3-files', corsMiddleware, getFiles);

app.post('/api/validate', corsMiddleware, (request, response) =>
  intermediateValidator(request, response, workerPool)
);
