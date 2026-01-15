import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { monitorBySlugQuery, monitorSlugsQuery } from '@/sanity/lib/queries'
import { DetailCompareButton } from '@/components/monitors/detail-compare-button'

interface Monitor {
  _id: string
  name: string
  slug: string
  mainImage?: any
  images?: any[]
  description?: string
  screenSize: number
  resolution: string
  panelType: string
  refreshRate: number
  responseTime?: number
  aspectRatio?: string
  curved: boolean
  curveRadius?: string
  hdrSupport?: string[]
  colourGamut?: {
    srgb?: number
    adobeRgb?: number
    dcip3?: number
  }
  brightness?: number
  contrastRatio?: string
  adaptiveSync?: string[]
  ports?: Array<{
    type: string
    count: number
    version?: string
  }>
  usbHub: boolean
  speakers: boolean
  standAdjustments?: string[]
  vesaMount?: string
  weight?: number
  msrp?: number
  releaseDate?: string
  featured: boolean
  brand?: {
    _id: string
    name: string
    slug: string
    logo?: any
    website?: string
    description?: string
  }
  categories?: Array<{
    _id: string
    name: string
    slug: string
    icon?: string
  }>
}

async function getMonitor(slug: string) {
  return client.fetch<Monitor | null>(monitorBySlugQuery, { slug })
}

export async function generateStaticParams() {
  const monitors = await client.fetch<Array<{ slug: string }>>(monitorSlugsQuery)
  return monitors.map((monitor) => ({
    slug: monitor.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const monitor = await getMonitor(slug)

  if (!monitor) {
    return {
      title: 'Monitor Not Found',
    }
  }

  return {
    title: `${monitor.name} - Owners Club`,
    description: monitor.description || `${monitor.name} - ${monitor.screenSize}" ${monitor.panelType} ${monitor.resolution} monitor`,
  }
}

function SpecItem({ label, value }: { label: string; value: string | number | undefined }) {
  if (!value) return null
  return (
    <div className="flex justify-between py-3 border-b border-zinc-800">
      <span className="text-zinc-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  )
}

function SpecBadge({ value }: { value: string }) {
  return (
    <span className="bg-zinc-800 text-zinc-300 text-sm px-3 py-1 rounded-full">
      {value}
    </span>
  )
}

export default async function MonitorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const monitor = await getMonitor(slug)

  if (!monitor) {
    notFound()
  }

  return (
    <div className="bg-black">
      {/* Breadcrumbs */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/monitors" className="hover:text-cyan-400 transition-colors">
              Monitors
            </Link>
            <span>/</span>
            <span className="text-white">{monitor.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="aspect-video relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                {monitor.mainImage ? (
                  <Image
                    src={urlFor(monitor.mainImage).width(800).height(450).url()}
                    alt={monitor.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                    <svg
                      className="w-24 h-24"
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
              </div>

              {/* Additional Images */}
              {monitor.images && monitor.images.length > 0 && (
                <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                  {monitor.images.map((image, index) => (
                    <div
                      key={index}
                      className="w-24 h-16 relative flex-shrink-0 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800"
                    >
                      <Image
                        src={urlFor(image).width(96).height(64).url()}
                        alt={`${monitor.name} image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Brand */}
              {monitor.brand && (
                <Link
                  href={`/monitors?brand=${monitor.brand.slug}`}
                  className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
                >
                  {monitor.brand.name}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                {monitor.name}
              </h1>

              {/* Quick Specs */}
              <div className="flex flex-wrap gap-2 mb-6">
                <SpecBadge value={`${monitor.screenSize}"`} />
                <SpecBadge value={monitor.resolution} />
                <SpecBadge value={monitor.panelType} />
                <SpecBadge value={`${monitor.refreshRate}Hz`} />
                {monitor.curved && <SpecBadge value="Curved" />}
              </div>

              {/* Price */}
              {monitor.msrp && (
                <div className="mb-6">
                  <p className="text-sm text-zinc-400 mb-1">MSRP</p>
                  <p className="text-4xl font-bold text-white">
                    £{monitor.msrp.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Description */}
              {monitor.description && (
                <p className="text-zinc-300 leading-relaxed mb-6">
                  {monitor.description}
                </p>
              )}

              {/* Categories */}
              {monitor.categories && monitor.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {monitor.categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/monitors?category=${category.slug}`}
                      className="bg-cyan-500/10 text-cyan-400 text-sm px-3 py-1 rounded-full hover:bg-cyan-500/20 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Compare Button */}
              <DetailCompareButton monitor={monitor} />
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Specifications</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Display */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Display</h3>
              <SpecItem label="Screen Size" value={`${monitor.screenSize}"`} />
              <SpecItem label="Resolution" value={monitor.resolution} />
              <SpecItem label="Panel Type" value={monitor.panelType} />
              <SpecItem label="Aspect Ratio" value={monitor.aspectRatio} />
              <SpecItem label="Refresh Rate" value={`${monitor.refreshRate}Hz`} />
              <SpecItem
                label="Response Time"
                value={monitor.responseTime ? `${monitor.responseTime}ms` : undefined}
              />
              {monitor.curved && (
                <>
                  <SpecItem label="Curved" value="Yes" />
                  <SpecItem label="Curve Radius" value={monitor.curveRadius} />
                </>
              )}
            </div>

            {/* HDR & Colour */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">HDR & Colour</h3>
              {monitor.hdrSupport && monitor.hdrSupport.length > 0 && (
                <div className="py-3 border-b border-zinc-800">
                  <span className="text-zinc-400 block mb-2">HDR Support</span>
                  <div className="flex flex-wrap gap-1">
                    {monitor.hdrSupport.map((hdr) => (
                      <span
                        key={hdr}
                        className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded"
                      >
                        {hdr}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <SpecItem
                label="Brightness"
                value={monitor.brightness ? `${monitor.brightness} nits` : undefined}
              />
              <SpecItem label="Contrast Ratio" value={monitor.contrastRatio} />
              {monitor.colourGamut && (
                <>
                  <SpecItem
                    label="sRGB Coverage"
                    value={monitor.colourGamut.srgb ? `${monitor.colourGamut.srgb}%` : undefined}
                  />
                  <SpecItem
                    label="Adobe RGB Coverage"
                    value={
                      monitor.colourGamut.adobeRgb
                        ? `${monitor.colourGamut.adobeRgb}%`
                        : undefined
                    }
                  />
                  <SpecItem
                    label="DCI-P3 Coverage"
                    value={monitor.colourGamut.dcip3 ? `${monitor.colourGamut.dcip3}%` : undefined}
                  />
                </>
              )}
            </div>

            {/* Gaming Features */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Gaming Features</h3>
              {monitor.adaptiveSync && monitor.adaptiveSync.length > 0 && (
                <div className="py-3 border-b border-zinc-800">
                  <span className="text-zinc-400 block mb-2">Adaptive Sync</span>
                  <div className="flex flex-wrap gap-1">
                    {monitor.adaptiveSync.map((sync) => (
                      <span
                        key={sync}
                        className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded"
                      >
                        {sync}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <SpecItem
                label="Response Time"
                value={monitor.responseTime ? `${monitor.responseTime}ms GtG` : undefined}
              />
              <SpecItem label="Refresh Rate" value={`${monitor.refreshRate}Hz`} />
            </div>

            {/* Connectivity */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Connectivity</h3>
              {monitor.ports && monitor.ports.length > 0 && (
                <div className="py-3 border-b border-zinc-800">
                  <span className="text-zinc-400 block mb-2">Ports</span>
                  <div className="space-y-1">
                    {monitor.ports.map((port, index) => (
                      <div key={index} className="text-white text-sm">
                        {port.count}x {port.type}
                        {port.version && ` (${port.version})`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <SpecItem label="USB Hub" value={monitor.usbHub ? 'Yes' : 'No'} />
              <SpecItem label="Built-in Speakers" value={monitor.speakers ? 'Yes' : 'No'} />
            </div>

            {/* Physical */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Physical</h3>
              {monitor.standAdjustments && monitor.standAdjustments.length > 0 && (
                <div className="py-3 border-b border-zinc-800">
                  <span className="text-zinc-400 block mb-2">Stand Adjustments</span>
                  <div className="flex flex-wrap gap-1">
                    {monitor.standAdjustments.map((adj) => (
                      <span
                        key={adj}
                        className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded"
                      >
                        {adj}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <SpecItem label="VESA Mount" value={monitor.vesaMount} />
              <SpecItem
                label="Weight"
                value={monitor.weight ? `${monitor.weight}kg` : undefined}
              />
            </div>

            {/* Additional Info */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Additional Info</h3>
              {monitor.brand?.website && (
                <div className="py-3 border-b border-zinc-800">
                  <span className="text-zinc-400 block mb-1">Manufacturer</span>
                  <a
                    href={monitor.brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {monitor.brand.name} Website →
                  </a>
                </div>
              )}
              {monitor.releaseDate && (
                <SpecItem
                  label="Release Date"
                  value={new Date(monitor.releaseDate).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                  })}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export const revalidate = 60
