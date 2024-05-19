/*
  Warnings:

  - Added the required column `height` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resolution` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Made the column `dimensions` on table `Photo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `format` on table `Photo` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "caption" TEXT,
    "format" TEXT NOT NULL,
    "date" TEXT,
    "deviceModel" TEXT,
    "lensModel" TEXT,
    "resolution" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "dimensions" TEXT NOT NULL,
    "iso" TEXT,
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
