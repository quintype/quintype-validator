import { validateRobotsHandler } from "./handlers/validate-robots-handler";

import { seoScoreHandler } from "./handlers/seo-score-handler";

import { validateUrlHandler } from "./handlers/validate-url-handler";

import compression from 'compression';
import express from 'express';

import bodyParser from "body-parser";
import cors from 'cors';


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
app.post("/api/validate.json", corsMiddleware, validateUrlHandler);

app.options("/api/seo-scores", corsMiddleware);
app.post("/api/seo-scores", corsMiddleware, seoScoreHandler);

app.get("/validate-robots", validateRobotsHandler);

app.get("/", (_, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "public,max-age=60");
  res.redirect(301, "https://developers.quintype.com/quintype-validator");
});

app.get("/ping", (_, res) => res.send("pong"));
