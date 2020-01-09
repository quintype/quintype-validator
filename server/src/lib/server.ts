import bodyParser from "body-parser";
import compression from 'compression';
import cors from 'cors';
import es from 'event-stream';
import express from 'express';
import multer from 'multer';
import {join} from 'path';
import {  Transform} from 'stream';

// tslint:disable-next-statement
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { seoScoreHandler } from "./handlers/seo-score-handler";
import { validateDomainHandler } from "./handlers/validate-domain-handler";
import { validateRobotsHandler } from "./handlers/validate-robots-handler";
import { validateUrlHandler } from "./handlers/validate-url-handler";
import * as validator from './handlers/validator';


export const app = express();
app.use(compression());
app.use(bodyParser.json({ limit: "1mb" }));

app.set("view engine", "ejs");
app.use(express.static("public", { maxAge: 86400000 }));

const corsMiddleware = cors({ 
  methods: "POST",
  origin(origin, callback): void {
    if(!origin) {
      callback(null, true);
      return;
    }
    if (origin.endsWith("quintype.com") ||
       (process.env.NODE_ENV !== 'production' && origin.startsWith("http://localhost:"))) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
});

app.options("/api/validate.json", corsMiddleware);
app.post("/api/validate.json", corsMiddleware, (req, res) => {
  const url = req.body.url;

  if(url && url.startsWith("http")) {
    return validateUrlHandler(req, res);
  }

  if(url) {
    return validateDomainHandler(req, res);
  }

  return res.status(400).json({error: {message: "Missing url"}});
});

app.options("/api/seo-scores", corsMiddleware);
app.post("/api/seo-scores", corsMiddleware, seoScoreHandler);

app.get("/validate-robots", validateRobotsHandler);

app.get("/", (_, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "public,max-age=60");
  res.redirect(301, "https://developers.quintype.com/quintype-validator");
});


app.get("/ping", (_, res) => res.send("pong"));
const typesPath = join(__dirname,
  '..',
  '..',
  '..',
  'node_modules',
  '@quintype/migration-helpers',
  'build',
  'main',
  'lib',
  'editor-types.d.ts');
app.post('/api/validate', (req: any, res: any) => {
  const { type, data } = req.body;
  res.status(200).send(validator.validator(type,typesPath, data));
})

app.post('/api/validate-file',upload.single('file'), (req: any, res: any) => {
  const stream = new Transform({
    transform(chunk:any,_,cb:any):any{
      cb(null,chunk)
    }
  });
  stream.write(req.file.buffer);
  stream
  .pipe(es.split())
  .pipe(es.map(
    (data: any,cb: any)=>{
      cb(null,
        JSON.stringify(validator.validator('Story',typesPath,JSON.parse(data))))
    }))
    .pipe(process.stdout)
  res.sendStatus(200);
})
