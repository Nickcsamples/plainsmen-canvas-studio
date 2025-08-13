// React hooks for Shopify integration using React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopifyStorefront } from '@/services/shopify/storefront';
import type { AppProduct, ProductFilters } from '@/services/shopify/types';

// Query keys for React Query caching
export const QUERY_KEYS = {
  products: (filters?: ProductFilters) => ['products', filters],
  product: (handle: string) => ['product', handle],
  collections: () => ['collections'],
  cart: () => ['cart'],
  featuredProducts: () => ['featured-products'],
  productsByCategory: (category: string) => ['products-by-category', category],
  searchProducts: (searchTerm: string) => ['search-products', searchTerm],
};

// Products hooks
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.products(filters),
    queryFn: () => shopifyStorefront.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProduct = (handle: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.product(handle),
    queryFn: () => shopifyStorefront.getProduct(handle),
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCollections = () => {
  return useQuery({
    queryKey: QUERY_KEYS.collections(),
    queryFn: () => shopifyStorefront.getCollections(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useFeaturedProducts = (count: number = 8) => {
  return useQuery({
    queryKey: QUERY_KEYS.featuredProducts(),
    queryFn: () => shopifyStorefront.getFeaturedProducts(count),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProductsByCategory = (category: string, count: number = 8) => {
  return useQuery({
    queryKey: QUERY_KEYS.productsByCategory(category),
    queryFn: () => shopifyStorefront.getProductsByCategory(category, count),
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
  });
};

export const useSearchProducts = (searchTerm: string, count: number = 20) => {
  return useQuery({
    queryKey: QUERY_KEYS.searchProducts(searchTerm),
    queryFn: () => shopifyStorefront.searchProducts(searchTerm, count),
    enabled: searchTerm.length >= 2, // Only search with 2+ characters
    staleTime: 5 * 60 * 1000,
  });
};

// Cart management hook
export const useCart = () => {
  const queryClient = useQueryClient();

  // Get cart from localStorage
  const getCartId = (): string | null => {
    try {
      return localStorage.getItem('shopify-cart-id');
    } catch {
      return null;
    }
  };

  // Save cart ID to localStorage
  const setCartId = (cartId: string) => {
    try {
      localStorage.setItem('shopify-cart-id', cartId);
    } catch {
      console.warn('Failed to save cart ID to localStorage');
    }
  };

  // Create new cart
  const createCart = useMutation({
    mutationFn: async (lineItems: any[] = []) => {
      const client = shopifyStorefront.getClient();
      const cart = await client.checkout.create();
      
      if (lineItems.length > 0) {
        const updatedCart = await client.checkout.addLineItems(cart.id, lineItems);
        return updatedCart;
      }
      
      return cart;
    },
    onSuccess: (cart) => {
      setCartId(cart.id);
      queryClient.setQueryData(QUERY_KEYS.cart(), cart);
    },
  });

  // Fetch existing cart
  const fetchCart = useQuery({
    queryKey: QUERY_KEYS.cart(),
    queryFn: async () => {
      const cartId = getCartId();
      if (!cartId) return null;

      try {
        const client = shopifyStorefront.getClient();
        return await client.checkout.fetch(cartId);
      } catch (error) {
        console.error('Error fetching cart:', error);
        // Clear invalid cart ID
        localStorage.removeItem('shopify-cart-id');
        return null;
      }
    },
    staleTime: 0, // Always fetch fresh cart data
    retry: false,
  });

  // Add item to cart
  const addToCart = useMutation({
    mutationFn: async ({ variantId, quantity = 1, customAttributes = [] }: {
      variantId: string;
      quantity?: number;
      customAttributes?: Array<{ key: string; value: string }>;
    }) => {
      const client = shopifyStorefront.getClient();
      let cartId = getCartId();

      // Create cart if it doesn't exist
      if (!cartId) {
        const newCart = await client.checkout.create();
        cartId = newCart.id;
        setCartId(cartId);
      }

      const lineItemsToAdd = [{
        variantId,
        quantity,
        customAttributes,
      }];

      return await client.checkout.addLineItems(cartId, lineItemsToAdd);
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(QUERY_KEYS.cart(), cart);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart() });
    },
  });

  // Update cart item
  const updateCartItem = useMutation({
    mutationFn: async ({ lineItemId, quantity }: {
      lineItemId: string;
      quantity: number;
    }) => {
      const cartId = getCartId();
      if (!cartId) throw new Error('No cart found');

      const client = shopifyStorefront.getClient();
      const lineItemsToUpdate = [{
        id: lineItemId,
        quantity,
      }];

      return await client.checkout.updateLineItems(cartId, lineItemsToUpdate);
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(QUERY_KEYS.cart(), cart);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart() });
    },
  });

  // Remove item from cart
  const removeFromCart = useMutation({
    mutationFn: async (lineItemId: string) => {
      const cartId = getCartId();
      if (!cartId) throw new Error('No cart found');

      const client = shopifyStorefront.getClient();
      return await client.checkout.removeLineItems(cartId, [lineItemId]);
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(QUERY_KEYS.cart(), cart);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart() });
    },
  });

  // Clear cart
  const clearCart = useMutation({
    mutationFn: async () => {
      const cartId = getCartId();
      if (!cartId) return null;

      localStorage.removeItem('shopify-cart-id');
      queryClient.removeQueries({ queryKey: QUERY_KEYS.cart() });
      
      // Create a new empty cart
      const client = shopifyStorefront.getClient();
      return await client.checkout.create();
    },
    onSuccess: (cart) => {
      if (cart) {
        setCartId(cart.id);
        queryClient.setQueryData(QUERY_KEYS.cart(), cart);
      }
    },
  });

  return {
    cart: fetchCart.data,
    isLoading: fetchCart.isLoading,
    error: fetchCart.error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    createCart,
    refetch: fetchCart.refetch,
  };
};

// Inventory check hook
export const useInventoryCheck = (variantId: string) => {
  return useQuery({
    queryKey: ['inventory', variantId],
    queryFn: async () => {
      // This would typically call Admin API for real-time inventory
      // For now, we'll return basic availability from Storefront API
      return { available: true, quantity: 10 };
    },
    enabled: !!variantId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};