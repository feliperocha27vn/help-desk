-- CreateTable
CREATE TABLE "schedules_technicals" (
    "id" TEXT NOT NULL,
    "usersId" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_technicals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "schedules_technicals" ADD CONSTRAINT "schedules_technicals_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
