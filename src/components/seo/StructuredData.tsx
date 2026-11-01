const SITE_URL = 'https://playzo-eight.vercel.app'
const BRAND_ID = `${SITE_URL}/#organization`

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

export function HomeStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': BRAND_ID,
        name: 'PLAYZO',
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/playzo-icon.svg`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'PLAYZO',
        url: `${SITE_URL}/`,
        description:
          'Discover free online browser games at PLAYZO. Play arcade, puzzle and brain games instantly, with no downloads or registration.',
        publisher: { '@id': BRAND_ID },
        inLanguage: 'en',
      },
    ],
  }

  return <JsonLd data={data} />
}

type GameStructuredDataProps = {
  slug: string
  name: string
  description: string
  genre: string
}

export function GameStructuredData({
  slug,
  name,
  description,
  genre,
}: GameStructuredDataProps) {
  const pageUrl = `${SITE_URL}/games/${slug}`
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'VideoGame',
        '@id': `${pageUrl}#videogame`,
        name,
        description,
        url: pageUrl,
        gamePlatform: 'Web browser',
        applicationCategory: 'Game',
        genre,
        inLanguage: 'en',
        isAccessibleForFree: true,
        publisher: { '@id': BRAND_ID },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Games',
            item: `${SITE_URL}/#games`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name,
            item: pageUrl,
          },
        ],
      },
    ],
  }

  return <JsonLd data={data} />
}

