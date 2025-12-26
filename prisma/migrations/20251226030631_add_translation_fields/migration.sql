-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "descriptionTranslations" JSONB,
ADD COLUMN     "shortDescTranslations" JSONB,
ADD COLUMN     "titleTranslations" JSONB;

-- AlterTable
ALTER TABLE "HeroSlide" ADD COLUMN     "ctaTextTranslations" JSONB,
ADD COLUMN     "subtitleTranslations" JSONB,
ADD COLUMN     "titleTranslations" JSONB;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "descriptionTranslations" JSONB,
ADD COLUMN     "nameTranslations" JSONB;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "descriptionTranslations" JSONB,
ADD COLUMN     "titleTranslations" JSONB;
