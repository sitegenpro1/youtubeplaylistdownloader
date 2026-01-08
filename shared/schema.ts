import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default('pending'),
  progress: integer("progress").default(0),
});

export const insertVideoSchema = createInsertSchema(videos);
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export interface PlaylistData {
  id: string;
  title: string;
  videoCount: number;
  videos: Video[];
}

export const seoContent = {
  home: {
    title: "YouTube Playlist Downloader - Best Free Batch Downloader 2024",
    description: "Download entire YouTube playlists for free. Fast, high-quality, and easy to use. No registration required. Save videos in bulk effortlessly.",
  },
  howTo: {
    title: "How to Download YouTube Playlists - Step-by-Step Guide",
    description: "Learn how to use our YouTube Playlist Downloader. Simple 3-step process to save all your favorite videos locally.",
  },
  faq: {
    title: "Frequently Asked Questions - YT Playlist Downloader",
    description: "Find answers to common questions about our free YouTube downloader tool. Safety, limits, and compatibility explained.",
  }
};
