import express from 'express';
import path, { join } from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import { seoScoreHandler } from './handlers/seo-score-handler';
import { validateDomainHandler } from './handlers/validate-domain-handler';
import { validateRobotsHandler } from './handlers/validate-robots-handler';
import { validateUrlHandler } from './handlers/validate-url-handler';
import * as validator from './handlers/validator';
import multer from 'multer';
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
import { Duplex } from 'stream';
import split2 from 'split2'


const typesPath = join(
  path.dirname(require.resolve('@quintype/migration-helpers')),
  'lib',
  'editor-types.d.ts'
);

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

app.post('/api/validate.json', corsMiddleware, (req, res) => {
  const url = req.body.url;

  if (url && url.startsWith('http')) {
    return validateUrlHandler(req, res);
  }

  if (url) {
    return validateDomainHandler(req, res);
  }

  return res.status(400).json({ error: { message: 'Missing url' } });
});

app.post('/api/seo-scores', corsMiddleware, seoScoreHandler);

app.get('/validate-robots', validateRobotsHandler);

app.get('/', (_, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public,max-age=60');
  res.redirect(301, 'https://developers.quintype.com/quintype-validator');
});

app.get('/ping', (_, res) => res.send('pong'));

app.post('/api/validate', corsMiddleware,(request: any, response: any) => {
  const { type, data } = request.body;
  const result = validator.validator(type, typesPath, JSON.parse(data));
  response.json({
   result
  });
});

app.post('/api/validate-file', corsMiddleware, upload.single('file'), (request: any, response: any) => {
  const { type } = request.body
  let result: any[] = []
 
  function bufferToStream(buffer: Buffer) {  
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
  const stream = bufferToStream(request.file.buffer)
  stream
  .pipe(split2(JSON.parse))
  .on('data', (obj) => {
    result.push(validator.validator(type, typesPath, obj))
  })

  stream.on('end', () => {
    response.json({result})
  })
});