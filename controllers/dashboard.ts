import { Request, Response } from "express";
import News from "../models/news";
import { getStartOfWeek } from "../helpers/helperFunctions";
import Client from "../models/client";

export const getTotalNewsCount = async (req: Request, res: Response) => {
  try {
    const count = await News.countDocuments();
    res.json({ totalNews: count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch total news count" });
  }
};

export const getNewsThisWeek = async (req: Request, res: Response) => {
  try {
    const startOfWeek = getStartOfWeek();
    const count = await News.countDocuments({
      createdAt: { $gte: startOfWeek },
    });
    res.json({ newsThisWeek: count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news count for this week" });
  }
};

export const getTotalViews = async (req: Request, res: Response) => {
  try {
    const allNews = await News.find({}, "views");
    const totalViews = allNews.reduce(
      (acc, news) => acc + news.views.length,
      0
    );
    res.json({ totalViews });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch total views" });
  }
};

export const getViewsThisWeek = async (req: Request, res: Response) => {
  try {
    const startOfWeek = getStartOfWeek();
    const allNews = await News.find({}, "views");
    const viewsThisWeek = allNews.reduce((acc, news) => {
      const count = news.views.filter((v) => v.viewedAt >= startOfWeek).length;
      return acc + count;
    }, 0);
    res.json({ viewsThisWeek });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch views for this week" });
  }
};

export const getTotalClients = async (req: Request, res: Response) => {
  const count = await Client.countDocuments();
  res.json({ totalClients: count });
  res.status(500).json({ error: "Failed to get total clients" });
};

export const getClientsLast7Days = async (
  req: Request,
  res: Response
) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const count = await Client.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  res.json({ clientsLast7Days: count });
  res.status(500).json({ error: "Failed to get clients from last 7 days" });
};
