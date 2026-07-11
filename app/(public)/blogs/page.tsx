import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { fetchPublishedPosts } from "@/dal/queries/posts";

type PayloadMedia = { url?: string | null; alt: string };

export const metadata: Metadata = {
  title: "Blog | Digital Shopper",
  description:
    "Tech tips, product guides, and the latest news from Digital Shopper.",
  openGraph: {
    title: "Blog | Digital Shopper",
    description:
      "Tech tips, product guides, and the latest news from Digital Shopper.",
  },
};

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return null;
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

function BlogListSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-2xl ring-1 ring-white/8 bg-surface-low animate-pulse"
        >
          <div className="aspect-video w-full bg-white/6" />
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="h-3 w-20 rounded bg-white/8" />
            <div className="h-5 w-4/5 rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/6" />
            <div className="h-4 w-3/4 rounded bg-white/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function BlogList() {
  const posts = await fetchPublishedPosts();

  if (posts.length === 0) {
    return <p className="text-muted-foreground">No posts published yet.</p>;
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const heroImage =
          post.heroImage && typeof post.heroImage === "object"
            ? (post.heroImage as PayloadMedia)
            : null;

        return (
          <Link
            key={post.id}
            href={`/blogs/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl ring-1 ring-white/8 bg-surface-low transition-shadow hover:ring-white/20"
          >
            {heroImage?.url ? (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt ?? post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="aspect-video w-full bg-white/5" />
            )}

            <div className="flex flex-1 flex-col gap-3 p-5">
              {post.publishedAt && (
                <time
                  dateTime={post.publishedAt}
                  className="text-xs text-white"
                >
                  {formatDate(post.publishedAt)}
                </time>
              )}
              <h2 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-sm text-white line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              <span className="mt-auto text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                Read more →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function BlogsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Tech tips, product guides, and the latest news.
        </p>
      </div>

      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList />
      </Suspense>
    </div>
  );
}

