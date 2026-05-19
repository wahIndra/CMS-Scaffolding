import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublishedPosts } from "@/lib/services/post.service";
import { getAllCategories } from "@/lib/services/category.service";
import { formatDate, truncate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read our latest articles, tutorials, and industry insights.",
};

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageParam, category } = await searchParams;
  const page = parseInt(pageParam ?? "1");
  const categorySlug = category;

  const [{ posts, total, totalPages }, categories] = await Promise.all([
    getPublishedPosts(page, 9, categorySlug),
    getAllCategories(),
  ]);

  return (
    <div className="py-16 md:py-24">
      <div className="container space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Our Blog</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Insights, tutorials, and updates from our team.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/blog">
            <Badge variant={!categorySlug ? "default" : "outline"} className="cursor-pointer px-4 py-1.5">
              All
            </Badge>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/blog?category=${cat.slug}`}>
              <Badge variant={categorySlug === cat.slug ? "default" : "outline"} className="cursor-pointer px-4 py-1.5">
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Post grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-4 opacity-40" />
            <p>No posts found.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow group">
                {post.featuredImage && (
                  <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-6 space-y-3">
                  {post.category && (
                    <Badge variant="secondary" className="text-xs">{post.category.name}</Badge>
                  )}
                  <h2 className="font-semibold leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt ?? truncate(post.content.replace(/<[^>]+>/g, ""), 100)}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author.name}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}${categorySlug ? `&category=${categorySlug}` : ""}`}
              >
                <Button variant={p === page ? "default" : "outline"} size="sm">
                  {p}
                </Button>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
