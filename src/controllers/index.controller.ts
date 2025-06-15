import { Controller, Get, Post } from "@/utils/decarators";
import { Request, Response } from "express";
@Controller("/")
export default class IndexController {
  @Get("")
  public async index(_req: Request, res: Response) {
    return res.send("Ok")
  }

  @Get("/version")
  public async version(_req: Request, res: Response) {
    return res.json('Last deployed at 15-06-2025 05:30 PM');
  }
}
