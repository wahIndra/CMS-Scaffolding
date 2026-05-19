import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText, BookOpen, Image, Users,
  TrendingUp, Plus, ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { getRecentActivity } from "@/lib/services/activity.service";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

async function getDashboardStats() {
  const [totalPosts, totalPages, totalMedia, totalUsers] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.media.count(),
    prisma.user.count(),
  ]);
  return { totalPosts, totalPages, totalMedia, totalUsers };
}

export default async function DashboardPage() {
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(8),
  ]);

  const statCards = [
    { label: "Total Posts", value: stats.totalPosts, icon: BookOpen, href: "/admin/posts", color: "text-blue-600" },
    { label: "Total Pages", value: stats.totalPages, icon: FileText, href: "/admin/pages", color: "text-green-600" },
    { label: "Media Files", value: stats.totalMedia, icon: Image, href: "/admin/media", color: "text-purple-600" },
    { label: "Users", value: stats.totalUsers, icon: Users, href: "/admin/users", color: "text-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/admin/posts/new"><Plus className="mr-2 h-4 w-4" />New Post</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, href, color }) => (
          <Card key={label} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{value}</div>
              <Link href={href} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { href: "/admin/posts/new", label: "Write a new post", icon: BookOpen },
              { href: "/admin/pages/new", label: "Create a new page", icon: FileText },
              { href: "/admin/media", label: "Upload media", icon: Image },
              { href: "/admin/users/new", label: "Add a user", icon: Users },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-md p-3 hover:bg-muted transition-colors text-sm"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {activity.map((log) => (
                  <li key={log.id} className="flex items-start gap-3 text-sm">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                      <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {log.action.replace(/_/g, " ")} — {log.entity}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.user?.name ?? "System"} · {formatDate(log.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
