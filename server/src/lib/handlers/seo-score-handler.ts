import { Request, Response } from "express";
import getStorySeo from "../story/seo";

export function seoScoreHandler(req: Request, res: Response): void {
  const story = req.body.story;
  const focusKeyword = req.body["focus-keyword"];
  res.status(200);
  res.setHeader("Content-Type", "application/json");
  const seoScore = getStorySeo(story, focusKeyword);
  res.json(seoScore);
}
