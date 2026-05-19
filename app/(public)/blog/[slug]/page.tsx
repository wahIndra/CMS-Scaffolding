import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublishedPostBySlug } from "@/lib/services/post.service";
import { formatDate } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      images: post.ogImage ? [post.ogImage] : post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await getPublishedPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="py-16 md:py-24">
      <div className="container max-w-3xl">

        <Button variant="ghost" asChild className="mb-8 -ml-2">
          <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog</Link>
        </Button>

        {post.category && (
          <Badge variant="secondary" className="mb-4">{post.category.name}</Badge>
        )}

        <h1 className="text-4xl font-extrabold tracking-tight mb-6">{post.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{post.author.name}</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(post.publishedAt)}</span>
          {post.tags.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              {post.tags.map((t) => t.tag.name).join(", ")}
            </span>
          )}
        </div>

        {post.featuredImage && (
          <div className="mb-10 aspect-video overflow-hidden rounded-xl bg-muted">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

      </div>
    </article>
  );
}
