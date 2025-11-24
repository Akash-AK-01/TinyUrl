-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "url" TEXT NOT NULL,
    "total_clicks" INTEGER NOT NULL DEFAULT 0,
    "last_clicked" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "links_code_key" ON "links"("code");

-- CreateIndex
CREATE INDEX "links_code_idx" ON "links"("code");
