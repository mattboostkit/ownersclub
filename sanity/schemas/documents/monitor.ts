import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'monitor',
  title: 'Monitor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Monitor Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),

    // Display Specifications
    defineField({
      name: 'screenSize',
      title: 'Screen Size (inches)',
      type: 'number',
      validation: (Rule) => Rule.required().min(10).max(100),
    }),
    defineField({
      name: 'resolution',
      title: 'Resolution',
      type: 'string',
      options: {
        list: [
          { title: '1920x1080 (FHD)', value: '1920x1080' },
          { title: '2560x1080 (UW-FHD)', value: '2560x1080' },
          { title: '2560x1440 (QHD)', value: '2560x1440' },
          { title: '3440x1440 (UW-QHD)', value: '3440x1440' },
          { title: '3840x1600 (UW-QHD+)', value: '3840x1600' },
          { title: '3840x2160 (4K UHD)', value: '3840x2160' },
          { title: '5120x1440 (DQHD)', value: '5120x1440' },
          { title: '5120x2160 (5K)', value: '5120x2160' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'panelType',
      title: 'Panel Type',
      type: 'string',
      options: {
        list: [
          { title: 'IPS', value: 'IPS' },
          { title: 'VA', value: 'VA' },
          { title: 'TN', value: 'TN' },
          { title: 'OLED', value: 'OLED' },
          { title: 'QD-OLED', value: 'QD-OLED' },
          { title: 'Mini-LED', value: 'Mini-LED' },
          { title: 'Nano IPS', value: 'Nano IPS' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'refreshRate',
      title: 'Refresh Rate (Hz)',
      type: 'number',
      validation: (Rule) => Rule.required().min(30).max(600),
    }),
    defineField({
      name: 'responseTime',
      title: 'Response Time (ms)',
      type: 'number',
      description: 'GtG response time in milliseconds',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: '16:9', value: '16:9' },
          { title: '21:9', value: '21:9' },
          { title: '32:9', value: '32:9' },
          { title: '16:10', value: '16:10' },
          { title: '4:3', value: '4:3' },
        ],
      },
    }),
    defineField({
      name: 'curved',
      title: 'Curved Display',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'curveRadius',
      title: 'Curve Radius (R)',
      type: 'string',
      description: 'e.g., 1000R, 1500R, 1800R',
      hidden: ({ parent }) => !parent?.curved,
    }),

    // HDR & Colour
    defineField({
      name: 'hdrSupport',
      title: 'HDR Support',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'HDR10', value: 'HDR10' },
          { title: 'HDR10+', value: 'HDR10+' },
          { title: 'Dolby Vision', value: 'Dolby Vision' },
          { title: 'DisplayHDR 400', value: 'DisplayHDR 400' },
          { title: 'DisplayHDR 600', value: 'DisplayHDR 600' },
          { title: 'DisplayHDR 1000', value: 'DisplayHDR 1000' },
          { title: 'DisplayHDR 1400', value: 'DisplayHDR 1400' },
          { title: 'DisplayHDR True Black 400', value: 'DisplayHDR True Black 400' },
          { title: 'DisplayHDR True Black 500', value: 'DisplayHDR True Black 500' },
        ],
      },
    }),
    defineField({
      name: 'colourGamut',
      title: 'Colour Gamut',
      type: 'object',
      fields: [
        { name: 'srgb', title: 'sRGB Coverage (%)', type: 'number' },
        { name: 'adobeRgb', title: 'Adobe RGB Coverage (%)', type: 'number' },
        { name: 'dcip3', title: 'DCI-P3 Coverage (%)', type: 'number' },
      ],
    }),
    defineField({
      name: 'brightness',
      title: 'Peak Brightness (nits)',
      type: 'number',
    }),
    defineField({
      name: 'contrastRatio',
      title: 'Contrast Ratio',
      type: 'string',
      description: 'e.g., 1000:1, 3000:1, Infinite (OLED)',
    }),

    // Gaming Features
    defineField({
      name: 'adaptiveSync',
      title: 'Adaptive Sync',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'AMD FreeSync', value: 'FreeSync' },
          { title: 'AMD FreeSync Premium', value: 'FreeSync Premium' },
          { title: 'AMD FreeSync Premium Pro', value: 'FreeSync Premium Pro' },
          { title: 'NVIDIA G-Sync Compatible', value: 'G-Sync Compatible' },
          { title: 'NVIDIA G-Sync', value: 'G-Sync' },
          { title: 'NVIDIA G-Sync Ultimate', value: 'G-Sync Ultimate' },
        ],
      },
    }),

    // Connectivity
    defineField({
      name: 'ports',
      title: 'Ports',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'type', title: 'Port Type', type: 'string' },
            { name: 'count', title: 'Count', type: 'number' },
            { name: 'version', title: 'Version', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'usbHub',
      title: 'USB Hub',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'speakers',
      title: 'Built-in Speakers',
      type: 'boolean',
      initialValue: false,
    }),

    // Physical
    defineField({
      name: 'standAdjustments',
      title: 'Stand Adjustments',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Height', value: 'Height' },
          { title: 'Tilt', value: 'Tilt' },
          { title: 'Swivel', value: 'Swivel' },
          { title: 'Pivot', value: 'Pivot' },
        ],
      },
    }),
    defineField({
      name: 'vesaMount',
      title: 'VESA Mount',
      type: 'string',
      description: 'e.g., 100x100, 75x75',
    }),
    defineField({
      name: 'weight',
      title: 'Weight (kg)',
      type: 'number',
    }),

    // Pricing
    defineField({
      name: 'msrp',
      title: 'MSRP (GBP)',
      type: 'number',
      description: 'Manufacturer suggested retail price in GBP',
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
    }),

    // Status
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      brand: 'brand.name',
      media: 'mainImage',
    },
    prepare({ title, brand, media }) {
      return {
        title,
        subtitle: brand,
        media,
      }
    },
  },
})
