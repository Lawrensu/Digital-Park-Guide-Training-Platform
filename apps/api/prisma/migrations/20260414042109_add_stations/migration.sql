-- AlterTable
ALTER TABLE "user" ADD COLUMN     "station_id" TEXT;

-- CreateTable
CREATE TABLE "station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "station_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "station_name_key" ON "station"("name");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "station"("id") ON DELETE SET NULL ON UPDATE CASCADE;
