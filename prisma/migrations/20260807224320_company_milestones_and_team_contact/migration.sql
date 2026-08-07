-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "email" TEXT,
ADD COLUMN     "linkedin" TEXT;

-- CreateTable
CREATE TABLE "CompanyMilestone" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionAr" TEXT,
    "descriptionEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompanyMilestone_published_sortOrder_idx" ON "CompanyMilestone"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "CompanyMilestone_year_sortOrder_idx" ON "CompanyMilestone"("year", "sortOrder");
