/**
 * Prisma Seed Script
 *
 * ⚠️  IMPORTANT: Change the default admin password before deploying to production!
 *
 * Run: npm run db:seed
 */

import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Super Admin ──────────────────────────────────────────────────
  const passwordHash = await argon2.hash("Admin@12345");

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@example.com",
      password: passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // ── Categories ───────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "news" },
      update: {},
      create: { name: "News", slug: "news", description: "Company news and announcements" },
    }),
    prisma.category.upsert({
      where: { slug: "tutorials" },
      update: {},
      create: { name: "Tutorials", slug: "tutorials", description: "How-to guides and tutorials" },
    }),
    prisma.category.upsert({
      where: { slug: "insights" },
      update: {},
      create: { name: "Insights", slug: "insights", description: "Industry insights and analysis" },
    }),
  ]);

  console.log(`✅ ${categories.length} categories created`);

  // ── Sample Posts ─────────────────────────────────────────────────
  const post1 = await prisma.post.upsert({
    where: { slug: "welcome-to-our-blog" },
    update: {},
    create: {
      title: "Welcome to Our Blog",
      slug: "welcome-to-our-blog",
      excerpt: "We are excited to launch our new company blog. Stay tuned for updates.",
      content: `<h2>Welcome!</h2><p>We are thrilled to launch our new blog where we will share company updates, tutorials, and industry insights. Bookmark this page and check back regularly for fresh content.</p>`,
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categories[0].id,
      metaTitle: "Welcome to Our Blog",
      metaDescription: "Read our first blog post and learn what to expect from our content.",
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: "getting-started-with-our-platform" },
    update: {},
    create: {
      title: "Getting Started with Our Platform",
      slug: "getting-started-with-our-platform",
      excerpt: "A step-by-step guide to get you up and running in under 10 minutes.",
      content: `<h2>Quick Start Guide</h2><p>Follow these simple steps to get started with our platform and make the most of your experience.</p><ol><li>Create your account</li><li>Complete your profile</li><li>Explore the dashboard</li></ol>`,
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categories[1].id,
      metaTitle: "Getting Started Guide",
      metaDescription: "Learn how to get started with our platform in under 10 minutes.",
    },
  });

  console.log(`✅ Sample posts created: ${post1.slug}, ${post2.slug}`);

  // ── Sample Pages ─────────────────────────────────────────────────
  const aboutPage = await prisma.page.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      title: "About Us",
      slug: "about",
      content: `<h1>About Our Company</h1><p>We are a passionate team dedicated to delivering exceptional solutions for our clients. Founded in 2020, we have grown to serve hundreds of businesses worldwide.</p><h2>Our Mission</h2><p>To empower businesses with innovative technology solutions that drive growth and efficiency.</p><h2>Our Vision</h2><p>To be the most trusted technology partner for businesses of all sizes.</p>`,
      status: "PUBLISHED",
      metaTitle: "About Us",
      metaDescription: "Learn about our company, mission, vision, and the team behind our success.",
    },
  });

  const contactPage = await prisma.page.upsert({
    where: { slug: "contact" },
    update: {},
    create: {
      title: "Contact Us",
      slug: "contact",
      content: `<h1>Get in Touch</h1><p>We would love to hear from you. Reach out to us via the form below or through our contact details.</p>`,
      status: "PUBLISHED",
      metaTitle: "Contact Us",
      metaDescription: "Get in touch with our team. We are here to help.",
    },
  });

  console.log(`✅ Sample pages created: ${aboutPage.slug}, ${contactPage.slug}`);

  // ── Site Settings ────────────────────────────────────────────────
  const settings: Array<{ key: string; value: string }> = [
    { key: "site_name", value: "My Company" },
    { key: "site_description", value: "We build amazing digital products." },
    { key: "contact_email", value: "hello@example.com" },
    { key: "contact_phone", value: "+1 (555) 123-4567" },
    { key: "contact_address", value: "123 Main Street, New York, NY 10001" },
    { key: "social_twitter", value: "https://twitter.com/mycompany" },
    { key: "social_linkedin", value: "https://linkedin.com/company/mycompany" },
    { key: "social_facebook", value: "https://facebook.com/mycompany" },
    { key: "social_instagram", value: "" },
    { key: "seo_default_title", value: "My Company — Digital Solutions" },
    { key: "seo_default_description", value: "We build amazing digital products for businesses of all sizes." },
    { key: "primary_color", value: "#2563eb" },
    { key: "logo_url", value: "" },
    { key: "favicon_url", value: "" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log(`✅ ${settings.length} site settings seeded`);

  console.log("\n🎉 Seeding complete!");
  console.log("───────────────────────────────────────");
  console.log("Admin login:");
  console.log("  Email:    admin@example.com");
  console.log("  Password: Admin@12345");
  console.log("⚠️  CHANGE THIS PASSWORD BEFORE GOING TO PRODUCTION!");
  console.log("───────────────────────────────────────");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
