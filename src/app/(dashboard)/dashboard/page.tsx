"use client";

import Link from "next/link";
import { FileText, Package, Eye, Users, PlusCircle, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import RecentPosts from "@/components/dashboard/RecentPosts";
import FeaturedProducts from "@/components/dashboard/FeaturedProducts";
import { useDashboard } from "@/hooks/useDashboard";

function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-card p-6 animate-pulse space-y-3">
      <div className="h-4 w-28 rounded bg-muted" />
      <div className="h-8 w-16 rounded bg-muted" />
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();
  const stats = data?.data?.stats;
  const recentPosts = data?.data?.recentPosts ?? [];
  const featuredProducts = data?.data?.featuredProducts ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to Nut Milk CMS. Manage your blog posts, products, and content.
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load dashboard data.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Posts"
            value={stats?.posts ?? 0}
            icon={<FileText className="h-5 w-5" />}
            description="All blog posts"
          />
          <StatCard
            title="Total Products"
            value={stats?.products ?? 0}
            icon={<Package className="h-5 w-5" />}
            description="All products"
          />
          <StatCard
            title="Total Views"
            value={stats?.views ?? 0}
            icon={<Eye className="h-5 w-5" />}
            description="Page views recorded"
          />
          <StatCard
            title="Total Users"
            value={stats?.users ?? 0}
            icon={<Users className="h-5 w-5" />}
            description="CMS users"
          />
        </div>
      )}

      {/* Recent Posts & Featured Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Posts</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 rounded bg-muted" />
                ))}
              </div>
            ) : (
              <RecentPosts posts={recentPosts} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Featured Products</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 rounded bg-muted" />
                ))}
              </div>
            ) : (
              <FeaturedProducts products={featuredProducts} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/blog/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products/new">
              <Package className="mr-2 h-4 w-4" />
              New Product
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/analytics">
              <BarChart2 className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
