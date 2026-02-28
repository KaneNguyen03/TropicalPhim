import WatchPage from "@/app/pages/WatchPage";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sv?: string }>;
}) {
  const { slug } = await params;
  const { sv } = await searchParams;
  const serverIndex = sv ? parseInt(sv, 10) || 0 : 0;
  return <WatchPage slug={slug} serverIndex={serverIndex} />;
}
