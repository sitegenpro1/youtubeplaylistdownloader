import { db } from "./db";
import {
  videos,
  type InsertVideo,
  type Video
} from "@shared/schema";
// We include these for completeness, even if the app is client-side mock.

export interface IStorage {
  // Minimal interface
  getStatus(): Promise<{status: string}>;
}

export class DatabaseStorage implements IStorage {
  async getStatus(): Promise<{status: string}> {
    return { status: "ok" };
  }
}

export const storage = new DatabaseStorage();
