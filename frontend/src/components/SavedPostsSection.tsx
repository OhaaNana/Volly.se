import type { SavedPost } from "../lib/savedPosts";

type Props = {
  posts: SavedPost[];
};

function formatAuthorName(post: SavedPost) {
  const fullName = `${post.first_name ?? ""} ${post.last_name ?? ""}`.trim();
  if (fullName) return fullName;
  if (post.author_email) {
    const localPart = post.author_email.split("@")[0] ?? "";
    const parts = localPart.split(/[._-]/).filter(Boolean);
    if (parts.length > 0) {
      return parts
        .slice(0, 2)
        .map((part) => part.replace(/^\w/, (c) => c.toUpperCase()))
        .join(" ");
    }
  }
  return "Okänt namn";
}

function formatHelpLabel(postType?: SavedPost["postType"]) {
  if (postType === "seek") return "Söker hjälp";
  if (postType === "offer") return "Erbjuder hjälp";
  return "Inlägg";
}

function getInitials(post: SavedPost) {
  const first = post.first_name?.trim()?.[0] ?? "";
  const last = post.last_name?.trim()?.[0] ?? "";
  if (first || last) return (first + last).toUpperCase();
  if (post.author_email) {
    return post.author_email
      .split("@")[0]
      .split(/[._-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }
  return "?";
}

export default function SavedPostsSection({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <div className="w-full max-w-[920px] self-stretch inline-flex flex-col justify-start items-start gap-3 overflow-hidden">
      <div className="self-stretch flex flex-col justify-center items-start">
        <div className="inline-flex justify-start items-center gap-2">
          <i
            className="fi fi-rr-bookmark text-Colors-primary text-lg leading-none"
            aria-hidden="true"
          />
          <h2 className="text-foreground text-lg font-bold font-['DM_Sans'] leading-7">
            Dina sparade inlägg
          </h2>
        </div>
        <p className="text-muted-foreground text-xs font-normal font-['DM_Sans'] leading-4">
          Snabb åtkomst till det du sparat
        </p>
      </div>

      <div className="w-full bg-Colors-card rounded-2xl outline outline-1 outline-offset-[-1px] outline-Colors-border flex flex-col justify-start items-start overflow-hidden">
        {posts.map((post, index) => (
          <div key={post.id} className="w-full">
            {index > 0 ? (
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-Colors-border" />
            ) : null}
            <div className="w-full p-3.5 inline-flex justify-center items-center gap-3 overflow-hidden">
              <div className="size-9 shrink-0 rounded-full bg-sky-400 inline-flex flex-col justify-center items-center overflow-hidden">
                <span className="text-white text-xs font-semibold font-['DM_Sans']">
                  {getInitials(post)}
                </span>
              </div>
              <div className="flex-1 min-w-0 inline-flex flex-col justify-start items-start overflow-hidden">
                <div className="text-foreground text-sm font-semibold font-['DM_Sans'] truncate w-full">
                  {post.title}
                </div>
                <div className="inline-flex flex-wrap justify-start items-start gap-2">
                  <span className="text-muted-foreground text-xs font-normal font-['DM_Sans'] leading-4">
                    {formatHelpLabel(post.postType)}
                  </span>
                  {post.category ? (
                    <>
                      <span className="text-muted-foreground text-xs font-normal font-['DM_Sans'] leading-4">
                        •
                      </span>
                      <span className="text-muted-foreground text-xs font-normal font-['DM_Sans'] leading-4">
                        {post.category}
                      </span>
                    </>
                  ) : null}
                  <span className="text-muted-foreground text-xs font-normal font-['DM_Sans'] leading-4">
                    •
                  </span>
                  <span className="text-muted-foreground text-xs font-normal font-['DM_Sans'] leading-4">
                    {formatAuthorName(post)}
                  </span>
                </div>
              </div>
              <div
                className="w-7 shrink-0 p-2.5 inline-flex flex-col justify-center items-center"
                aria-hidden="true"
              >
                <i className="fi fi-rr-angle-small-down text-foreground text-sm leading-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
