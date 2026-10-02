import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let bucket: GridFSBucket | null = null;

export function getGridFSBucket() {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB is not connected");
  }

  if (!bucket) {
    bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "certificates",
    });
  }

  return bucket;
}