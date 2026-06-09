import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContractorRateProfessionPage from "@/components/ContractorRateProfessionPage";
import { contractorRateProfessionMap, contractorRateProfessions } from "@/lib/contractor-rate-professions";
import { createMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return contractorRateProfessions.map((profession) => ({ profession: profession.slug }));
}

export function generateMetadata({ params }: { params: { profession: string } }): Metadata {
  const profession = contractorRateProfessionMap[params.profession];
  if (!profession) return {};
  return createMetadata({
    title: profession.title,
    description: profession.description,
    path: `/contractor-rate-calculator/${profession.slug}`,
  });
}

export default function Page({ params }: { params: { profession: string } }) {
  const profession = contractorRateProfessionMap[params.profession];
  if (!profession) notFound();
  return <ContractorRateProfessionPage profession={profession} />;
}
