-- CreateTable
CREATE TABLE "Waiver" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" TEXT NOT NULL,
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactPhone" TEXT NOT NULL,
    "signatureType" TEXT NOT NULL,
    "signatureData" TEXT NOT NULL,
    "agreedToWaiver" BOOLEAN NOT NULL DEFAULT false,
    "mailchimpOptIn" BOOLEAN NOT NULL DEFAULT false,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "waiverId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    CONSTRAINT "FamilyMember_waiverId_fkey" FOREIGN KEY ("waiverId") REFERENCES "Waiver" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
