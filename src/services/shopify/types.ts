// Shopify TypeScript interfaces and types

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  images: ShopifyImage[];
  variants: ShopifyProductVariant[];
  tags: string[];
  productType: string;
  vendor: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  collections: ShopifyCollection[];
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  quantityAvailable: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: ShopifyImage;
  sku?: string;
}

export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width: number;
  height: number;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: ShopifyImage;
  products: ShopifyProduct[];
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  webUrl: string;
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalTax: {
    amount: string;
    currencyCode: string;
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: ShopifyLineItem[];
}

export interface ShopifyLineItem {
  id: string;
  title: string;
  quantity: number;
  variant: ShopifyProductVariant;
  customAttributes: {
    key: string;
    value: string;
  }[];
}

// Transform functions to convert Shopify data to app format
export interface AppProduct {
  id: string;
  image: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  category?: string;
  handle?: string;
  description?: string;
  images?: string[];
  variants?: ShopifyProductVariant[];
  availableForSale?: boolean;
}

export interface ProductFilters {
  collection?: string;
  tag?: string;
  productType?: string;
  vendor?: string;
  available?: boolean;
  sortKey?: 'TITLE' | 'PRICE' | 'CREATED_AT' | 'UPDATED_AT' | 'BEST_SELLING' | 'RELEVANCE';
  reverse?: boolean;
  first?: number;
  after?: string;
}

export interface CartLineItemInput {
  variantId: string;
  quantity: number;
  customAttributes?: {
    key: string;
    value: string;
  }[];
}