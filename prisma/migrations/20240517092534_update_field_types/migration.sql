/*
  Warnings:

  - You are about to alter the column `iso` on the `Photo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `latitude` on the `Photo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `longitude` on the `Photo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.

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
    "iso" INTEGER,
    "focalLength" TEXT,
    "exposure" TEXT,
    "aperture" TEXT,
    "shutterSpeed" TEXT,
    "latitude" REAL,
    "longitude" REAL,
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
