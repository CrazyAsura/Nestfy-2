/*
  Warnings:

  - You are about to drop the column `number` on the `phones` table. All the data in the column will be lost.
  - Added the required column `numberPhone` to the `phones` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_phones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ddi" TEXT NOT NULL DEFAULT 'BRA_55',
    "ddd" TEXT NOT NULL,
    "numberPhone" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "phones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_phones" ("createdAt", "ddd", "ddi", "id", "updatedAt", "userId") SELECT "createdAt", "ddd", "ddi", "id", "updatedAt", "userId" FROM "phones";
DROP TABLE "phones";
ALTER TABLE "new_phones" RENAME TO "phones";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
