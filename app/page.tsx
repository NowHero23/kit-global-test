import { BlogList } from "@/ui/BlogList";
import { MainTitle } from "@/ui/MainTitle";

export default async function Home() {
  return (
    <>
      <MainTitle>Welcome to the Home Page</MainTitle>
      <BlogList />
    </>
  );
}
