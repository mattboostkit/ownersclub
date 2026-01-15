import Link from "next/link";
import { ArrowRight, Star, Users, Monitor, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const stats = [
  { icon: Star, label: "Reviews", value: "2,500+" },
  { icon: Users, label: "Members", value: "10K+" },
  { icon: Monitor, label: "Monitors", value: "500+" },
  { icon: MessageSquare, label: "Discussions", value: "5K+" },
];

const categories = [
  { name: "Gaming Monitors", slug: "gaming", description: "High refresh rate displays for competitive gaming" },
  { name: "Professional", slug: "professional", description: "Colour-accurate displays for creative work" },
  { name: "Ultrawide", slug: "ultrawide", description: "Immersive curved displays for productivity" },
  { name: "4K & Beyond", slug: "4k", description: "Ultra-high resolution for stunning clarity" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
              Join 10,000+ monitor enthusiasts
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Honest Reviews from{" "}
              <span className="text-primary">Real Owners</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Discover the perfect monitor with in-depth reviews, detailed comparisons, and insights from our passionate community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/monitors">
                <Button size="lg" className="glow-cyan-sm">
                  Browse Monitors
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" size="lg">
                  Join the Community
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="container mx-auto mt-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="text-center py-6">
                    <CardContent className="p-0">
                      <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Explore by Category
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              Find the right monitor for your needs, whether you&apos;re a gamer, creative professional, or productivity enthusiast.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link key={category.slug} href={`/monitors?category=${category.slug}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors group">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Monitor className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
