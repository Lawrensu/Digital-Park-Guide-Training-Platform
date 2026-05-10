-- AlterTable
ALTER TABLE "enrolment" ADD COLUMN     "completed_at" TIMESTAMPTZ(6),
ADD COLUMN     "progress_pct" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "content_item_progress" (
    "id" TEXT NOT NULL,
    "enrolment_id" TEXT NOT NULL,
    "content_item_id" TEXT NOT NULL,
    "completed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_item_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_item_progress_enrolment_id_content_item_id_key" ON "content_item_progress"("enrolment_id", "content_item_id");

-- AddForeignKey
ALTER TABLE "content_item_progress" ADD CONSTRAINT "content_item_progress_enrolment_id_fkey" FOREIGN KEY ("enrolment_id") REFERENCES "enrolment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_item_progress" ADD CONSTRAINT "content_item_progress_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "content_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
