export const dynamic = 'force-dynamic';

import SearchPage from "../pages/SearchPage";

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  return <SearchPage searchParams={resolvedParams} />;
}
