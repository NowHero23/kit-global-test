import { getTokens } from "next-firebase-auth-edge";
import { Metadata } from "../auth/AuthContext";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { toUser } from "../shared/user";
import { UserProfile } from "./UserProfile";
import { TagInput } from "@/ui/TagInput";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const tokens = await getTokens<Metadata>(await cookies(), authConfig);

  const user = tokens ? toUser(tokens) : null;

  const params = await searchParams;
  console.log("params", params);
  const search = params.s || null;
  const tags = params.tag || null;
  return (
    <div>
      <ul>
        <li>uid:{user?.uid}</li>
        <li>metadata.nickname:{user?.metadata.nickname}</li>
      </ul>
      {search && <div>Search:{search}</div>}
      {tags && (
        <ul>
          {Array.isArray(tags) ? tags.map((tag) => <li key={tag}>{tag}</li>):<li>{tags}</li>}
        </ul>
      )}

      


    </div>
  );
}
