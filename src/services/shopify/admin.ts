// Shopify Admin API client using axios
import axios, { AxiosInstance } from 'axios';
import { ADMIN_API_CONFIG } from './config';

class ShopifyAdminService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = `https://${ADMIN_API_CONFIG.domain}/admin/api/${ADMIN_API_CONFIG.apiVersion}`;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-Shopify-Access-Token': ADMIN_API_CONFIG.accessToken,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Shopify Admin API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  // Product Management
  async getProducts(limit: number = 250, fields?: string[]): Promise<any[]> {
    try {
      const params: any = { limit };
      if (fields) {
        params.fields = fields.join(',');
      }

      const response = await this.client.get('/products.json', { params });
      return response.data.products || [];
    } catch (error) {
      console.error('Error fetching products from Admin API:', error);
      throw new Error('Failed to fetch products from Shopify Admin API');
    }
  }

  async getProduct(productId: string): Promise<any> {
    try {
      const response = await this.client.get(`/products/${productId}.json`);
      return response.data.product;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw new Error(`Failed to fetch product: ${productId}`);
    }
  }

  async createProduct(productData: any): Promise<any> {
    try {
      const response = await this.client.post('/products.json', {
        product: productData
      });
      return response.data.product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  async updateProduct(productId: string, productData: any): Promise<any> {
    try {
      const response = await this.client.put(`/products/${productId}.json`, {
        product: productData
      });
      return response.data.product;
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      throw new Error(`Failed to update product: ${productId}`);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.client.delete(`/products/${productId}.json`);
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      throw new Error(`Failed to delete product: ${productId}`);
    }
  }

  // Inventory Management
  async getInventoryLevels(inventoryItemIds: string[]): Promise<any[]> {
    try {
      const response = await this.client.get('/inventory_levels.json', {
        params: {
          inventory_item_ids: inventoryItemIds.join(',')
        }
      });
      return response.data.inventory_levels || [];
    } catch (error) {
      console.error('Error fetching inventory levels:', error);
      throw new Error('Failed to fetch inventory levels');
    }
  }

  async updateInventoryLevel(locationId: string, inventoryItemId: string, quantity: number): Promise<any> {
    try {
      const response = await this.client.post('/inventory_levels/set.json', {
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        available: quantity
      });
      return response.data.inventory_level;
    } catch (error) {
      console.error('Error updating inventory level:', error);
      throw new Error('Failed to update inventory level');
    }
  }

  // Order Management
  async getOrders(status?: string, limit: number = 250): Promise<any[]> {
    try {
      const params: any = { limit };
      if (status) {
        params.status = status;
      }

      const response = await this.client.get('/orders.json', { params });
      return response.data.orders || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  async getOrder(orderId: string): Promise<any> {
    try {
      const response = await this.client.get(`/orders/${orderId}.json`);
      return response.data.order;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw new Error(`Failed to fetch order: ${orderId}`);
    }
  }

  async updateOrder(orderId: string, orderData: any): Promise<any> {
    try {
      const response = await this.client.put(`/orders/${orderId}.json`, {
        order: orderData
      });
      return response.data.order;
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      throw new Error(`Failed to update order: ${orderId}`);
    }
  }

  // Collection Management
  async getCollections(): Promise<any[]> {
    try {
      const response = await this.client.get('/custom_collections.json');
      const customCollections = response.data.custom_collections || [];
      
      const smartResponse = await this.client.get('/smart_collections.json');
      const smartCollections = smartResponse.data.smart_collections || [];
      
      return [...customCollections, ...smartCollections];
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw new Error('Failed to fetch collections');
    }
  }

  async createCollection(collectionData: any): Promise<any> {
    try {
      const response = await this.client.post('/custom_collections.json', {
        custom_collection: collectionData
      });
      return response.data.custom_collection;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw new Error('Failed to create collection');
    }
  }

  // Custom Canvas Product Creation
  async createCustomCanvasProduct(canvasData: {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    customAttributes: Record<string, string>;
  }): Promise<any> {
    try {
      const productData = {
        title: `Custom Canvas - ${canvasData.title}`,
        body_html: canvasData.description,
        vendor: 'Plainsmen Art',
        product_type: 'Custom Canvas',
        tags: ['custom', 'canvas', 'personalized'],
        images: [
          {
            src: canvasData.imageUrl,
            alt: canvasData.title
          }
        ],
        variants: [
          {
            title: 'Default',
            price: canvasData.price.toFixed(2),
            inventory_quantity: 1,
            inventory_management: 'shopify',
            inventory_policy: 'deny'
          }
        ],
        metafields: Object.entries(canvasData.customAttributes).map(([key, value]) => ({
          namespace: 'custom_canvas',
          key,
          value,
          value_type: 'string'
        }))
      };

      return await this.createProduct(productData);
    } catch (error) {
      console.error('Error creating custom canvas product:', error);
      throw new Error('Failed to create custom canvas product');
    }
  }

  // Webhook management
  async createWebhook(webhook: {
    topic: string;
    address: string;
    format?: string;
  }): Promise<any> {
    try {
      const response = await this.client.post('/webhooks.json', {
        webhook: {
          ...webhook,
          format: webhook.format || 'json'
        }
      });
      return response.data.webhook;
    } catch (error) {
      console.error('Error creating webhook:', error);
      throw new Error('Failed to create webhook');
    }
  }

  async getWebhooks(): Promise<any[]> {
    try {
      const response = await this.client.get('/webhooks.json');
      return response.data.webhooks || [];
    } catch (error) {
      console.error('Error fetching webhooks:', error);
      throw new Error('Failed to fetch webhooks');
    }
  }

  // Analytics and Reports
  async getAnalytics(startDate: string, endDate: string): Promise<any> {
    try {
      const response = await this.client.get('/analytics/reports/orders.json', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error('Failed to fetch analytics');
    }
  }
}

// Export singleton instance
export const shopifyAdmin = new ShopifyAdminService();
export default shopifyAdmin;