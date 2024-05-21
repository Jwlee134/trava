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
    "views" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("aperture", "caption", "createdAt", "date", "deviceModel", "dimensions", "exposure", "focalLength", "format", "height", "id", "iso", "latitude", "lensModel", "longitude", "resolution", "shutterSpeed", "title", "updatedAt", "url", "userId", "width") SELECT "aperture", "caption", "createdAt", "date", "deviceModel", "dimensions", "exposure", "focalLength", "format", "height", "id", "iso", "latitude", "lensModel", "longitude", "resolution", "shutterSpeed", "title", "updatedAt", "url", "userId", "width" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
