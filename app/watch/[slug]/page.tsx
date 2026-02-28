import WatchPage from "@/app/pages/WatchPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <WatchPage slug={slug} />;
}
