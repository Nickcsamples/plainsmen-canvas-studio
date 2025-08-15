// Shopify Storefront API client using shopify-buy SDK
import Client from 'shopify-buy';
import { SHOPIFY_CONFIG, PRODUCT_QUERY, SINGLE_PRODUCT_QUERY, COLLECTIONS_QUERY } from './config';
import type { ShopifyProduct, ShopifyCollection, AppProduct, ProductFilters } from './types';

// Initialize Shopify Buy client
const client = Client.buildClient({
  domain: SHOPIFY_CONFIG.domain,
  storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
  apiVersion: SHOPIFY_CONFIG.apiVersion,
});

class ShopifyStorefrontService {
  private client: any;

  constructor() {
    this.client = client;
  }

  // Fetch all products with optional filtering
  async getProducts(filters: ProductFilters = {}): Promise<AppProduct[]> {
    try {
      const {
        first = 50,
        sortKey = 'CREATED_AT',
        reverse = true,
        collection,
        tag,
        productType,
        available
      } = filters;

      // Build query string for filtering
      let query = '';
      if (collection) query += ` collection:${collection}`;
      if (tag) query += ` tag:${tag}`;
      if (productType) query += ` product_type:${productType}`;
      if (available !== undefined) query += ` available:${available}`;

      const products = await this.client.product.fetchAll();
      
      // Transform Shopify products to app format
      return this.transformProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products from Shopify');
    }
  }

  // Fetch products by collection
  async getProductsByCollection(collectionHandle: string, first: number = 20): Promise<AppProduct[]> {
    try {
      const collection = await this.client.collection.fetchWithProducts(collectionHandle, {
        productsFirst: first,
      });
      
      return this.transformProducts(collection.products);
    } catch (error) {
      console.error(`Error fetching products from collection ${collectionHandle}:`, error);
      throw new Error(`Failed to fetch products from collection: ${collectionHandle}`);
    }
  }

  // Fetch single product by handle
  async getProduct(handle: string): Promise<AppProduct | null> {
    try {
      const products = await this.client.product.fetchAll();
      const product = products.find((p: any) => p.handle === handle);
      
      if (!product) return null;
      
      const transformed = this.transformProducts([product]);
      return transformed[0] || null;
    } catch (error) {
      console.error(`Error fetching product ${handle}:`, error);
      throw new Error(`Failed to fetch product: ${handle}`);
    }
  }

  // Fetch all collections
  async getCollections(): Promise<any[]> {
    try {
      const collections = await this.client.collection.fetchAll();
      return collections.map((collection: any) => ({
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
        description: collection.description,
        image: collection.image ? {
          id: collection.image.id,
          url: collection.image.src,
          altText: collection.image.altText,
          width: collection.image.width,
          height: collection.image.height,
        } : null,
      }));
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw new Error('Failed to fetch collections from Shopify');
    }
  }

  // Search products
  async searchProducts(searchTerm: string, first: number = 20): Promise<AppProduct[]> {
    try {
      const products = await this.client.product.fetchAll();
      
      // Filter products based on search term
      const filteredProducts = products.filter((product: any) => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags && product.tags.some && product.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );

      return this.transformProducts(filteredProducts.slice(0, first));
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }
  }

  // Get featured/bestselling products
  async getFeaturedProducts(count: number = 8): Promise<AppProduct[]> {
    try {
      const products = await this.client.product.fetchAll();
      
      // For now, return first N products. In production, you might want to
      // use a specific collection or tag to mark featured products
      return this.transformProducts(products.slice(0, count));
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw new Error('Failed to fetch featured products');
    }
  }

  // Get products by category/tag
  async getProductsByCategory(category: string, count: number = 8): Promise<AppProduct[]> {
    try {
      const products = await this.client.product.fetchAll();
      
      // Filter by product type or tags
      const categoryProducts = products.filter((product: any) => 
        product.productType.toLowerCase() === category.toLowerCase() ||
        (product.tags && product.tags.some && product.tags.some((tag: string) => tag.toLowerCase() === category.toLowerCase()))
      );

      return this.transformProducts(categoryProducts.slice(0, count));
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      return [];
    }
  }

  // Transform Shopify products to app format
  private transformProducts(shopifyProducts: any[]): AppProduct[] {
    return shopifyProducts.map((product: any) => ({
      id: product.id,
      handle: product.handle,
      title: product.title,
      description: product.description,
      image: product.images[0]?.src || '',
      images: product.images.map((img: any) => img.src),
      price: product.variants[0]?.priceV2 || product.priceRange?.minVariantPrice || { amount: "0.00", currencyCode: "USD" },
      category: product.productType || 'Art',
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        price: variant.priceV2 || { amount: variant.price || "0.00", currencyCode: "USD" },
        availableForSale: variant.available,
        quantityAvailable: variant.inventory_quantity || 0,
        selectedOptions: variant.selectedOptions || [],
        image: variant.image ? {
          id: variant.image.id,
          url: variant.image.src,
          altText: variant.image.altText,
          width: variant.image.width,
          height: variant.image.height,
        } : undefined,
        sku: variant.sku,
      })),
      availableForSale: product.availableForSale,
    }));
  }

  // Get client instance for cart operations
  getClient(): any {
    return this.client;
  }
}

// Export singleton instance
export const shopifyStorefront = new ShopifyStorefrontService();
export default shopifyStorefront;