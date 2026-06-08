import {
  breadcrumbJsonLd,
  faqJsonLd,
  type JsonLdObject,
  webApplicationJsonLd,
} from "@/lib/seo";

export function JsonLd({ data }: { data: JsonLdObject }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export function WebAppJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return <JsonLd data={webApplicationJsonLd({ name, description, path: url })} />;
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return <JsonLd data={faqJsonLd(items)} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return <JsonLd data={breadcrumbJsonLd(items)} />;
}
