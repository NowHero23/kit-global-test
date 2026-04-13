import { BlogList } from "@/ui/BlogList";
import { MainTitle } from "@/ui/MainTitle";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string; lastId?: string }>;
}) {
  return (
    <>
      <MainTitle>Welcome to the Home Page</MainTitle>
      <BlogList searchParams={await searchParams} />
    </>
  );
}
