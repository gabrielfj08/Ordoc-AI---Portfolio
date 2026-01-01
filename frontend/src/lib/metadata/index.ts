/**
 * SEO Metadata Utilities
 *
 * Provides utilities for generating dynamic metadata for Next.js App Router pages.
 *
 * Features:
 * - OpenGraph tags
 * - Twitter cards
 * - Structured data (JSON-LD)
 * - Dynamic title/description generation
 *
 * Created as part of Sprint 6 - Frontend Type Safety + SEO
 */

import { Metadata } from 'next';

/**
 * Base URL for the application (production or staging)
 */
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://ordoc-ai.com';

/**
 * Default metadata for the application
 */
export const DEFAULT_METADATA = {
  siteName: 'Ordoc-AI',
  title: 'Ordoc-AI - Ordem Inteligente no Cuidado',
  description:
    'Plataforma inteligente de gestão hospitalar com IA para otimizar processos, reduzir custos e melhorar a qualidade do atendimento.',
  keywords: [
    'gestão hospitalar',
    'inteligência artificial',
    'saúde digital',
    'prontuário eletrônico',
    'automação hospitalar',
    'IA médica',
    'workflow hospitalar',
    'documentação médica',
  ],
  locale: 'pt_BR',
  type: 'website',
};

/**
 * Generate metadata for a page
 */
export interface GenerateMetadataOptions {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
  structuredData?: object;
}

export function generatePageMetadata(options: GenerateMetadataOptions): Metadata {
  const {
    title,
    description = DEFAULT_METADATA.description,
    keywords = DEFAULT_METADATA.keywords,
    ogImage = `${BASE_URL}/og-image.png`,
    ogType = 'website',
    canonical,
    noindex = false,
    structuredData,
  } = options;

  const fullTitle = `${title} | ${DEFAULT_METADATA.siteName}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: DEFAULT_METADATA.siteName }],
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || BASE_URL,
      siteName: DEFAULT_METADATA.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: DEFAULT_METADATA.locale,
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@ordocai',
    },
    alternates: {
      canonical: canonical || BASE_URL,
    },
  };

  if (noindex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

/**
 * Generate structured data for organization
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: DEFAULT_METADATA.siteName,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: DEFAULT_METADATA.description,
    sameAs: [
      'https://www.linkedin.com/company/ordoc-ai',
      'https://twitter.com/ordocai',
    ],
  };
}

/**
 * Generate structured data for SoftwareApplication
 */
export function generateSoftwareApplicationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: DEFAULT_METADATA.siteName,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '120',
    },
  };
}

/**
 * Generate structured data for Article (blog posts, documentation)
 */
export interface ArticleStructuredDataOptions {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  imageUrl: string;
}

export function generateArticleStructuredData(
  options: ArticleStructuredDataOptions
) {
  const { title, description, datePublished, dateModified, authorName, imageUrl } =
    options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_METADATA.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
  };
}

/**
 * Generate structured data for MedicalOrganization
 */
export interface MedicalOrganizationStructuredDataOptions {
  name: string;
  description: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone?: string;
}

export function generateMedicalOrganizationStructuredData(
  options: MedicalOrganizationStructuredDataOptions
) {
  const { name, description, address, telephone } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name,
    description,
    ...(address && { address }),
    ...(telephone && { telephone }),
  };
}

/**
 * Generate breadcrumb structured data
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Helper to combine multiple structured data objects
 */
export function combineStructuredData(...data: object[]) {
  return {
    '@graph': data,
  };
}

/**
 * Dashboard page metadata generator
 */
export interface DashboardPageMetadataOptions {
  pageName: string;
  description?: string;
  metrics?: {
    totalItems?: number;
    recentActivity?: string;
  };
}

export function generateDashboardPageMetadata(
  options: DashboardPageMetadataOptions
): Metadata {
  const { pageName, description, metrics } = options;

  let finalDescription = description || `Painel de ${pageName} - ${DEFAULT_METADATA.siteName}`;

  if (metrics) {
    const metricsParts: string[] = [];
    if (metrics.totalItems !== undefined) {
      metricsParts.push(`${metrics.totalItems} itens`);
    }
    if (metrics.recentActivity) {
      metricsParts.push(metrics.recentActivity);
    }
    if (metricsParts.length > 0) {
      finalDescription += ` - ${metricsParts.join(', ')}`;
    }
  }

  return generatePageMetadata({
    title: pageName,
    description: finalDescription,
    noindex: true, // Dashboard pages should not be indexed
  });
}

/**
 * Report page metadata generator
 */
export interface ReportPageMetadataOptions {
  reportTitle: string;
  reportType?: string;
  createdAt?: string;
  metrics?: {
    totalReports?: number;
    templatesUsed?: number;
  };
}

export function generateReportPageMetadata(
  options: ReportPageMetadataOptions
): Metadata {
  const { reportTitle, reportType, createdAt, metrics } = options;

  let description = `Relatório ${reportTitle}`;

  if (reportType) {
    description += ` - Tipo: ${reportType}`;
  }

  if (metrics) {
    const metricsParts: string[] = [];
    if (metrics.totalReports !== undefined) {
      metricsParts.push(`${metrics.totalReports} relatórios`);
    }
    if (metrics.templatesUsed !== undefined) {
      metricsParts.push(`${metrics.templatesUsed} templates`);
    }
    if (metricsParts.length > 0) {
      description += ` - ${metricsParts.join(', ')}`;
    }
  }

  const structuredData = generateArticleStructuredData({
    title: reportTitle,
    description,
    datePublished: createdAt || new Date().toISOString(),
    authorName: DEFAULT_METADATA.siteName,
    imageUrl: `${BASE_URL}/og-image-report.png`,
  });

  return generatePageMetadata({
    title: reportTitle,
    description,
    noindex: true, // Report pages should not be indexed
    structuredData,
  });
}
