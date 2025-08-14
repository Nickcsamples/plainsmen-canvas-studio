import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  canonicalUrl?: string;
}

export function SEO({ 
  title = 'Plainsmen Art - Premium Canvas Prints & Custom Art',
  description = 'Transform your space with premium canvas prints and custom art from Plainsmen Art. High-quality prints, custom canvas creation, and exclusive sports memorabilia.',
  keywords = 'canvas prints, custom art, wall art, sports memorabilia, premium prints, custom canvas, art gallery, home decor',
  image = '/hero-gallery-1.jpg',
  url = '',
  type = 'website',
  canonicalUrl 
}: SEOProps) {
  const siteUrl = 'https://your-domain.com'; // Replace with your actual domain
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image?.startsWith('http') ? image : `${siteUrl}${image}`;
  const fullTitle = title.includes('Plainsmen Art') ? title : `${title} | Plainsmen Art`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Plainsmen Art" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Plainsmen Art" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@plainsmenart" />
      <meta name="twitter:creator" content="@plainsmenart" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#1a1a1a" />
      <meta name="msapplication-TileColor" content="#1a1a1a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Plainsmen Art",
          "description": description,
          "url": siteUrl,
          "logo": `${siteUrl}/logo.png`,
          "sameAs": [
            "https://www.facebook.com/plainsmenart",
            "https://www.instagram.com/plainsmenart",
            "https://twitter.com/plainsmenart"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-123-4567",
            "contactType": "Customer Service",
            "areaServed": "US",
            "availableLanguage": "English"
          }
        })}
      </script>
    </Helmet>
  );
}