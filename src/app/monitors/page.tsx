import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { monitorsQuery, brandsQuery, categoriesQuery } from '@/sanity/lib/queries'

interface Monitor {
  _id: string
  name: string
  slug: string
  mainImage?: any
  description?: string
  screenSize: number
  resolution: string
  panelType: string
  refreshRate: number
  responseTime?: number
  aspectRatio?: string
  curved: boolean
  msrp?: number
  featured: boolean
  releaseDate?: string
  brand?: {
    _id: string
    name: string
    slug: string
    logo?: any
  }
  categories?: Array<{
    _id: string
    name: string
    slug: string
  }>
}

interface Brand {
  _id: string
  name: string
  slug: string
}

interface Category {
  _id: string
  name: string
  slug: string
}

async function getMonitors() {
  return client.fetch<Monitor[]>(monitorsQuery)
}

async function getBrands() {
  return client.fetch<Brand[]>(brandsQuery)
}

async function getCategories() {
  return client.fetch<Category[]>(categoriesQuery)
}

function MonitorCard({ monitor }: { monitor: Monitor }) {
  return (
    <Link
      href={`/monitors/${monitor.slug}`}
      className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-cyan-500/50 transition-all duration-300"
    >
      <div className="aspect-video relative bg-zinc-800">
        {monitor.mainImage ? (
          <Image
            src={urlFor(monitor.mainImage).width(600).height(340).url()}
            alt={monitor.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {monitor.featured && (
          <span className="absolute top-3 left-3 bg-cyan-500 text-black text-xs font-semibold px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        {monitor.brand && (
          <p className="text-cyan-400 text-sm font-medium mb-1">
            {monitor.brand.name}
          </p>
        )}
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
          {monitor.name}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded">
            {monitor.screenSize}&quot;
          </span>
          <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded">
            {monitor.resolution}
          </span>
          <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded">
            {monitor.panelType}
          </span>
          <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded">
            {monitor.refreshRate}Hz
          </span>
        </div>
        {monitor.msrp && (
          <p className="text-xl font-bold text-white">
            £{monitor.msrp.toLocaleString()}
          </p>
        )}
      </div>
    </Link>
  )
}

function MonitorCardSkeleton() {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 animate-pulse">
      <div className="aspect-video bg-zinc-800" />
      <div className="p-4">
        <div className="h-4 bg-zinc-800 rounded w-20 mb-2" />
        <div className="h-6 bg-zinc-800 rounded w-3/4 mb-2" />
        <div className="flex gap-2 mb-3">
          <div className="h-6 bg-zinc-800 rounded w-12" />
          <div className="h-6 bg-zinc-800 rounded w-20" />
          <div className="h-6 bg-zinc-800 rounded w-12" />
        </div>
        <div className="h-7 bg-zinc-800 rounded w-24" />
      </div>
    </div>
  )
}

async function MonitorsGrid() {
  const monitors = await getMonitors()

  if (monitors.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-16 h-16 mx-auto text-zinc-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-white mb-2">No monitors yet</h3>
        <p className="text-zinc-400">
          Monitors will appear here once they&apos;re added to the CMS.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {monitors.map((monitor) => (
        <MonitorCard key={monitor._id} monitor={monitor} />
      ))}
    </div>
  )
}

async function FilterSidebar() {
  const [brands, categories] = await Promise.all([getBrands(), getCategories()])

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 sticky top-24">
        <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>

        {/* Brands */}
        {brands.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">
              Brands
            </h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <Link
                  key={brand._id}
                  href={`/monitors?brand=${brand.slug}`}
                  className="block text-zinc-300 hover:text-cyan-400 transition-colors"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/monitors?category=${category.slug}`}
                  className="block text-zinc-300 hover:text-cyan-400 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Panel Type */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">
            Panel Type
          </h3>
          <div className="space-y-2">
            {['IPS', 'VA', 'OLED', 'QD-OLED', 'Mini-LED'].map((panel) => (
              <Link
                key={panel}
                href={`/monitors?panel=${panel}`}
                className="block text-zinc-300 hover:text-cyan-400 transition-colors"
              >
                {panel}
              </Link>
            ))}
          </div>
        </div>

        {/* Resolution */}
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">
            Resolution
          </h3>
          <div className="space-y-2">
            {['1920x1080', '2560x1440', '3840x2160'].map((res) => (
              <Link
                key={res}
                href={`/monitors?resolution=${res}`}
                className="block text-zinc-300 hover:text-cyan-400 transition-colors"
              >
                {res === '1920x1080'
                  ? '1080p (FHD)'
                  : res === '2560x1440'
                    ? '1440p (QHD)'
                    : '4K (UHD)'}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default function MonitorsPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <section className="bg-gradient-to-b from-zinc-900 to-black py-16 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Monitors
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl">
            Discover the best monitors for gaming, creative work, and everyday use.
            Expert reviews, detailed specs, and community ratings.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <Suspense
              fallback={
                <aside className="w-full lg:w-64 shrink-0">
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 animate-pulse">
                    <div className="h-6 bg-zinc-800 rounded w-20 mb-4" />
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 bg-zinc-800 rounded w-full" />
                      ))}
                    </div>
                  </div>
                </aside>
              }
            >
              <FilterSidebar />
            </Suspense>

            {/* Main Content */}
            <div className="flex-1">
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <MonitorCardSkeleton key={i} />
                    ))}
                  </div>
                }
              >
                <MonitorsGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export const revalidate = 60 // Revalidate every 60 seconds
