import Tag from "@/app/types/tag";

type TagsListProps = React.ComponentProps<"div"> & {
  tags: Tag[];
};

export function TagsList({ tags, ...props }: TagsListProps) {
  return (
    <div {...props} className="flex gap-2 mt-2 flex-wrap">
      {tags.map((tag) => (
        <span className="px-1 bg-white text-black rounded-xl" key={tag.id}>
          {tag.id}
        </span>
      ))}
    </div>
  );
}
