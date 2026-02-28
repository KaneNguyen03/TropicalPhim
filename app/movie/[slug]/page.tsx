import DetailPage from "@/app/pages/DetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DetailPage slug={slug} />;
}
