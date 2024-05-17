/*
  Warnings:

  - You are about to drop the column `resolution` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Photo` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "caption" TEXT,
    "format" TEXT,
    "date" TEXT,
    "deviceModel" TEXT,
    "lensModel" TEXT,
    "dimensions" TEXT,
    "iso" TEXT,
    "focalLength" TEXT,
    "exposure" TEXT,
    "aperture" TEXT,
    "shutterSpeed" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("aperture", "caption", "createdAt", "date", "deviceModel", "dimensions", "exposure", "focalLength", "format", "id", "iso", "latitude", "lensModel", "longitude", "shutterSpeed", "title", "updatedAt", "url", "userId") SELECT "aperture", "caption", "createdAt", "date", "deviceModel", "dimensions", "exposure", "focalLength", "format", "id", "iso", "latitude", "lensModel", "longitude", "shutterSpeed", "title", "updatedAt", "url", "userId" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
