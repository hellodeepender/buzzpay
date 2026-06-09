import GuideArticlePage from "@/components/GuideArticlePage";
import { getGuideArticle } from "@/lib/contractor-finance-guides";
import { createMetadata } from "@/lib/seo";

const article = getGuideArticle("how-to-calculate-a-contractor-hourly-rate")!;

export const metadata = createMetadata({
  title: article.title,
  description: article.description,
  path: article.path,
});

export default function Page() {
  return <GuideArticlePage article={article} />;
}
