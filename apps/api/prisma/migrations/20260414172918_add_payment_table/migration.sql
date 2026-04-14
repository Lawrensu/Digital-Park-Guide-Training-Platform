-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "quiz_attempt_id" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MYR',
    "billplz_bill_id" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_billplz_bill_id_key" ON "payment"("billplz_bill_id");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_quiz_attempt_id_fkey" FOREIGN KEY ("quiz_attempt_id") REFERENCES "quiz_attempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
