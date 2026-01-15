import { groq } from 'next-sanity'

// Get all monitors with brand info
export const monitorsQuery = groq`
  *[_type == "monitor" && published == true] | order(releaseDate desc) {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    description,
    screenSize,
    resolution,
    panelType,
    refreshRate,
    responseTime,
    aspectRatio,
    curved,
    msrp,
    featured,
    releaseDate,
    "brand": brand->{
      _id,
      name,
      "slug": slug.current,
      logo
    },
    "categories": categories[]->{
      _id,
      name,
      "slug": slug.current
    }
  }
`

// Get featured monitors
export const featuredMonitorsQuery = groq`
  *[_type == "monitor" && published == true && featured == true] | order(releaseDate desc)[0...6] {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    screenSize,
    resolution,
    panelType,
    refreshRate,
    msrp,
    "brand": brand->{
      name,
      "slug": slug.current
    }
  }
`

// Get single monitor by slug with full details
export const monitorBySlugQuery = groq`
  *[_type == "monitor" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    images,
    description,
    screenSize,
    resolution,
    panelType,
    refreshRate,
    responseTime,
    aspectRatio,
    curved,
    curveRadius,
    hdrSupport,
    colourGamut,
    brightness,
    contrastRatio,
    adaptiveSync,
    ports,
    usbHub,
    speakers,
    standAdjustments,
    vesaMount,
    weight,
    msrp,
    releaseDate,
    featured,
    "brand": brand->{
      _id,
      name,
      "slug": slug.current,
      logo,
      website,
      description
    },
    "categories": categories[]->{
      _id,
      name,
      "slug": slug.current,
      icon
    }
  }
`

// Get all monitor slugs for static generation
export const monitorSlugsQuery = groq`
  *[_type == "monitor" && published == true] {
    "slug": slug.current
  }
`

// Get monitors by category
export const monitorsByCategoryQuery = groq`
  *[_type == "monitor" && published == true && $categorySlug in categories[]->slug.current] | order(releaseDate desc) {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    screenSize,
    resolution,
    panelType,
    refreshRate,
    msrp,
    "brand": brand->{
      name,
      "slug": slug.current
    }
  }
`

// Get monitors by brand
export const monitorsByBrandQuery = groq`
  *[_type == "monitor" && published == true && brand->slug.current == $brandSlug] | order(releaseDate desc) {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    screenSize,
    resolution,
    panelType,
    refreshRate,
    msrp,
    "brand": brand->{
      name,
      "slug": slug.current
    }
  }
`

// Get all brands
export const brandsQuery = groq`
  *[_type == "brand"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    logo,
    website,
    description
  }
`

// Get all categories
export const categoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    icon
  }
`
