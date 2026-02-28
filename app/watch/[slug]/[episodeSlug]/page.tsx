import WatchPage from "@/app/pages/WatchPage";

export default async function Page({ params }: { params: Promise<{ slug: string; episodeSlug: string }> }) {
  const { slug, episodeSlug } = await params;
  return <WatchPage slug={slug} episodeSlug={episodeSlug} />;
}
