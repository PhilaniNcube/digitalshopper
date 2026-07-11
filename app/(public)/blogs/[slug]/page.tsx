import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { fetchPostBySlug, fetchPublishedPosts } from "@/dal/queries/posts";
import { fetchProductsByIds } from "@/dal/queries/products";
import { ProductCard } from "@/components/products/product-card";

type PayloadMedia = { url?: string | null; alt: string };
type PayloadAuthor = { name: string };

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await fetchPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found | Digital Shopper" };
  }

  const heroImage =
    post.heroImage && typeof post.heroImage === "object"
      ? (post.heroImage as PayloadMedia)
      : null;

  return {
    title: `${post.title} | Digital Shopper Blog`,
    description: post.excerpt ?? `Read ${post.title} on the Digital Shopper blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: heroImage?.url ? [heroImage.url] : [],
      type: "article",
    },
  };
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return null;
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

function BlogPostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 aspect-video w-full rounded-2xl bg-white/6" />
      <div className="mb-8 space-y-4">
        <div className="h-8 w-3/4 rounded bg-white/8" />
        <div className="h-4 w-32 rounded bg-white/6" />
        <div className="h-4 w-full rounded bg-white/6" />
        <div className="h-4 w-5/6 rounded bg-white/6" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-white/5" />
        ))}
      </div>
    </div>
  );
}

async function BlogFeaturedProducts({ productIds }: { productIds: string[] }) {
  if (!productIds || productIds.length === 0) return null;

  const products = await fetchProductsByIds(productIds);
  if (products.length === 0) return null;

  return (
    <div className="mt-16 border-t border-white/8 pt-10">
      <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
        Featured Products Mentioned
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

async function BlogPostContent({ slug }: { slug: string }) {
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const heroImage =
    post.heroImage && typeof post.heroImage === "object"
      ? (post.heroImage as PayloadMedia)
      : null;

  const author =
    post.author && typeof post.author === "object"
      ? (post.author as PayloadAuthor)
      : null;

  return (
    <>
      {/* Hero image */}
      {heroImage?.url && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={heroImage.url}
            alt={heroImage.alt ?? post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          )}
          {author && (
            <span>
              By{" "}
              <span className="text-white font-medium">{author.name}</span>
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-invert text-white max-w-none">
        <RichText data={post.content} />
      </div>

      {/* Featured Products */}
      {post.featuredProducts && Array.isArray(post.featuredProducts) && post.featuredProducts.length > 0 && (
        <Suspense fallback={
          <div className="mt-16 border-t border-white/8 pt-10">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-6 animate-pulse">
              Featured Products Mentioned
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: Math.min(3, post.featuredProducts.length) }).map((_, i) => (
                <div key={i} className="aspect-[4/5] w-full rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          </div>
        }>
          <BlogFeaturedProducts productIds={post.featuredProducts as string[]} />
        </Suspense>
      )}
    </>
  );
}

export default function BlogPostPage({ params }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-white">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/blogs" className="hover:text-foreground transition-colors">
          Blog
        </Link>
        <span>/</span>
      </nav>

      <Suspense fallback={<BlogPostSkeleton />}>
        {params.then(({ slug }) => (
          <BlogPostContent slug={slug} />
        ))}
      </Suspense>

      {/* Back link */}
      <div className="mt-12 border-t border-white/8 pt-8">
        <Link
          href="/blogs"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}


