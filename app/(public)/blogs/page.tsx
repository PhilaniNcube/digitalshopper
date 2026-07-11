import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

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

const BLOG_POSTS = [
  {
    id: "best-desktop-computers-south-africa-2026-guide",
    slug: "best-desktop-computers-south-africa-2026-guide",
    title: "Best Desktop Computers for Home, Office, and Gaming in South Africa (2026 Guide)",
    excerpt: "Finding the right desktop computer in South Africa can be overwhelming. In this guide, we break down the best desktop computers available right now based on exactly what you need them to do.",
    publishedAt: "2026-07-11T16:00:00.000Z",
    heroImage: {
      url: "/images/desktop-computers-guide-hero.png",
      alt: "Best Desktop Computers Guide 2026",
    },
  },
  {
    id: "best-budget-anc-earbuds-and-wireless-headphones-under-R500",
    slug: "best-budget-anc-earbuds-and-wireless-headphones-under-R500",
    title: "Best Budget ANC Earbuds & Wireless Headphones under R500 in South Africa (2026 Guide)",
    excerpt: "You don’t have to compromise on build quality or sound. In this guide, we break down the best budget audio gear available right now in South Africa, focusing on the highly-rated WINX VIBE lineup.",
    publishedAt: "2026-07-11T14:00:00.000Z",
    heroImage: {
      url: "/api/media/file/pexels-swamy-k-3521269-29128040.jpg",
      alt: "Wireless Earphones Guide",
    },
  },
  {
    id: "sticker-shock",
    slug: "sticker-shock",
    title: "Sticker Shock",
    excerpt: "If you’ve looked at the price of a RAM kit lately, you might have noticed a bit of \"sticker shock.\" What used to be one of the most affordable parts of a PC build has suddenly become a major investment.",
    publishedAt: "2026-04-18T13:30:00.000Z",
    heroImage: null,
  },
];

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export default function BlogsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Blog</h1>
        <p className="mt-2 text-muted-foreground font-sans">
          Tech tips, product guides, and the latest news.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => {
          return (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl ring-1 ring-white/8 bg-surface-low transition-all duration-300 hover:ring-white/20 hover:shadow-[0_24px_50px_rgba(0,0,0,0.28)]"
            >
              {post.heroImage?.url ? (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={post.heroImage.url}
                    alt={post.heroImage.alt ?? post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-white/5" />
              )}

              <div className="flex flex-1 flex-col gap-3 p-5 font-sans">
                <time
                  dateTime={post.publishedAt}
                  className="text-xs text-slate-400"
                >
                  {formatDate(post.publishedAt)}
                </time>
                <h2 className="text-lg font-semibold leading-snug text-white group-hover:text-primary transition-colors font-display">
                  {post.title}
                </h2>
                <p className="text-sm text-neutral-300 line-clamp-3">
                  {post.excerpt}
                </p>
                <span className="mt-auto text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                  Read more →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
