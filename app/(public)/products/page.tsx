import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Products & Services",
  description: "Explore our full range of digital products and services.",
};

const products = [
  {
    name: "Starter Website",
    category: "Web Development",
    description: "A professional, responsive website to establish your online presence.",
    features: ["Up to 10 pages", "Mobile-first design", "SEO optimized", "Contact form", "1 year support"],
    price: "From $2,999",
    cta: "Get Started",
  },
  {
    name: "Business Platform",
    category: "Web Application",
    description: "A full-featured web application tailored to your business workflows.",
    features: ["Custom features", "Admin dashboard", "API integration", "Authentication", "Ongoing support"],
    price: "From $9,999",
    cta: "Request Quote",
    featured: true,
  },
  {
    name: "E-Commerce Store",
    category: "E-Commerce",
    description: "A high-converting online store with a seamless checkout experience.",
    features: ["Product catalog", "Payment gateway", "Inventory system", "Order management", "Analytics"],
    price: "From $5,999",
    cta: "Get Started",
  },
  {
    name: "CMS Solution",
    category: "Content Management",
    description: "A custom CMS to manage your website content without technical knowledge.",
    features: ["Rich text editor", "Media library", "User roles", "SEO tools", "Scheduled publishing"],
    price: "From $4,499",
    cta: "Learn More",
  },
];

export default function ProductsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container space-y-16">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Products & Services</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to build and grow your digital presence.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <Card
              key={product.name}
              className={`relative hover:shadow-lg transition-shadow ${
                product.featured ? "border-primary shadow-md" : ""
              }`}
            >
              {product.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-4">Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-8 space-y-5">
                <div>
                  <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                  <p className="text-muted-foreground text-sm mt-2">{product.description}</p>
                </div>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{product.price}</span>
                  <Button asChild variant={product.featured ? "default" : "outline"}>
                    <Link href="/contact">
                      {product.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-bold">Not Sure Which Plan Fits?</h2>
          <p className="text-muted-foreground">Let's talk and find the perfect solution for your needs.</p>
          <Button asChild size="lg">
            <Link href="/contact">Schedule a Free Consultation</Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
