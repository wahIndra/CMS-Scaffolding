import type { Metadata } from "next";
import { Users, Target, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our company, mission, vision, and the team behind our success.",
};

const team = [
  { name: "John Smith", role: "CEO & Founder", bio: "15 years of experience in software engineering and product management." },
  { name: "Lisa Park", role: "CTO", bio: "Expert in cloud infrastructure and scalable system design." },
  { name: "Tom Rivera", role: "Head of Design", bio: "Award-winning UX designer with a passion for user-centric products." },
  { name: "Aisha Patel", role: "Lead Engineer", bio: "Full-stack developer specializing in React and Node.js ecosystems." },
];

const milestones = [
  { year: "2020", title: "Company Founded", description: "Started with a small team of 3 passionate developers." },
  { year: "2021", title: "First 50 Clients", description: "Grew rapidly by delivering exceptional results for our early customers." },
  { year: "2022", title: "International Expansion", description: "Expanded services to 15+ countries worldwide." },
  { year: "2023", title: "500 Projects Milestone", description: "Delivered over 500 successful projects across all industries." },
  { year: "2024", title: "Team of 30+", description: "Scaled our team to 30+ expert engineers and designers." },
];

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container space-y-24">

        {/* Overview */}
        <section className="grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-5">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">About Us</span>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Building the Future, <br /> One Product at a Time
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              MyCompany is a full-service digital studio specializing in web development, design, and
              digital strategy. Since 2020, we have helped hundreds of businesses build products that
              people love.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe in clean code, honest communication, and long-term partnerships. Every project
              we take on reflects our commitment to excellence.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, label: "30+ Team Members" },
              { icon: TrendingUp, label: "500+ Projects" },
              { icon: Target, label: "15+ Countries" },
              { icon: Eye, label: "98% Satisfaction" },
            ].map(({ icon: Icon, label }) => (
              <Card key={label}>
                <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
                  <Icon className="h-8 w-8 text-primary" />
                  <p className="font-semibold text-sm">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid gap-6 md:grid-cols-2">
          <Card className="border-primary/30">
            <CardContent className="p-8 space-y-4">
              <Target className="h-10 w-10 text-primary" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground">
                To empower businesses with innovative technology solutions that drive sustainable growth
                and create exceptional user experiences.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/30">
            <CardContent className="p-8 space-y-4">
              <Eye className="h-10 w-10 text-primary" />
              <h2 className="text-2xl font-bold">Our Vision</h2>
              <p className="text-muted-foreground">
                To become the most trusted digital partner for businesses of all sizes, known for our
                craftsmanship, reliability, and integrity.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-10 text-center">Meet the Team</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map(({ name, role, bio }) => (
              <Card key={name} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="mx-auto h-20 w-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                    {name.charAt(0)}
                  </div>
                  <h3 className="font-semibold">{name}</h3>
                  <p className="text-xs text-primary font-medium">{role}</p>
                  <p className="text-xs text-muted-foreground">{bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-10 text-center">Our Journey</h2>
          <div className="relative border-l border-primary/30 pl-8 space-y-8 max-w-2xl mx-auto">
            {milestones.map(({ year, title, description }) => (
              <div key={year} className="relative">
                <div className="absolute -left-[2.75rem] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {year.slice(2)}
                </div>
                <p className="text-xs text-primary font-semibold mb-1">{year}</p>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
