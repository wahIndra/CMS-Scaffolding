import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Star, ChevronDown,
  Zap, Shield, BarChart2, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublishedPosts } from "@/lib/services/post.service";
import { formatDate, truncate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Home",
  description: "We build amazing digital products for businesses of all sizes.",
};

const services = [
  { icon: Zap, title: "Fast Development", description: "Ship products quickly without sacrificing quality." },
  { icon: Shield, title: "Secure & Reliable", description: "Enterprise-grade security built in from day one." },
  { icon: BarChart2, title: "Data-Driven", description: "Make smarter decisions with actionable analytics." },
  { icon: Globe, title: "Global Scale", description: "Infrastructure that grows with your business." },
];

const testimonials = [
  { name: "Sarah Johnson", role: "CEO, TechStart", text: "Working with MyCompany transformed how we build products. Highly recommended!" },
  { name: "Michael Chen", role: "CTO, ScaleUp", text: "The team delivered beyond our expectations. Clean code, great communication." },
  { name: "Emily Davis", role: "Founder, BrandCo", text: "Our website traffic doubled in 3 months. The results speak for themselves." },
];

const faqs = [
  { q: "How long does a typical project take?", a: "Most projects are completed within 4–12 weeks depending on scope and complexity." },
  { q: "Do you offer ongoing support?", a: "Yes, we offer flexible maintenance and support plans for all our clients." },
  { q: "Can you work with our existing tech stack?", a: "Absolutely. We adapt to your current technology and team workflows." },
  { q: "What industries do you serve?", a: "We work with startups, SMBs, and enterprises across all industries." },
];

export default async function HomePage() {
  const { posts } = await getPublishedPosts(1, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background py-24 md:py-36">
        <div className="container text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            Your Trusted Digital Partner
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            We Build Products <br className="hidden md:block" />
            <span className="text-primary">That Drive Growth</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            From concept to launch, we help businesses build modern web applications with cutting-edge technology.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/contact">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">View Our Work</Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            {["500+ Projects Delivered", "98% Client Satisfaction", "15+ Countries Served"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">What We Do</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              We offer end-to-end digital services to help your business succeed online.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="py-20">
        <div className="container grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Who We Are</h2>
            <p className="text-muted-foreground">
              Founded in 2020, MyCompany is a team of passionate engineers and designers dedicated to
              crafting exceptional digital experiences. We partner with businesses to bring their
              vision to life.
            </p>
            <ul className="space-y-3">
              {["Expert team of 30+ engineers", "Agile & transparent process", "Long-term partnership focus"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline">
              <Link href="/about">Learn More About Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="rounded-2xl bg-muted aspect-video flex items-center justify-center text-muted-foreground text-sm">
            Company Image Placeholder
          </div>
        </div>
      </section>

      {/* Blog preview */}
      {posts.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Latest News</h2>
              <Button variant="ghost" asChild>
                <Link href="/blog">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-3">
                    {post.category && (
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {post.category.name}
                      </span>
                    )}
                    <h3 className="font-semibold leading-snug hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt ?? truncate(post.content.replace(/<[^>]+>/g, ""), 120)}
                    </p>
                    <div className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">What Our Clients Say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map(({ name, role, text }) => (
              <Card key={name}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{text}"</p>
                  <div>
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group border rounded-lg p-4">
                <summary className="flex cursor-pointer items-center justify-between font-medium list-none">
                  {q}
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Ready to Build Something Great?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Let's turn your vision into a reality. Contact us today and get a free consultation.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">
              Contact Us Today <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
