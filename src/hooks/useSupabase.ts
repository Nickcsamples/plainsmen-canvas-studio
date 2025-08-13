import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CanvasProject {
  id: string;
  user_id: string;
  title: string;
  image_url: string | null;
  layout: string;
  size: string;
  frame: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product_title: string;
  product_image: string | null;
  product_price: number | null;
  created_at: string;
}

export interface RecentlyViewedItem {
  id: string;
  user_id: string;
  product_id: string;
  product_title: string;
  product_image: string | null;
  product_price: number | null;
  viewed_at: string;
}

// Canvas Projects Hooks
export function useCanvasProjects() {
  return useQuery({
    queryKey: ['canvas-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canvas_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CanvasProject[];
    },
  });
}

export function useCreateCanvasProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (project: Omit<CanvasProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('canvas_projects')
        .insert([project])
        .select()
        .single();
      
      if (error) throw error;
      return data as CanvasProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvas-projects'] });
      toast({
        title: "Canvas project saved!",
        description: "Your custom canvas has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving project",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Wishlist Hooks
export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WishlistItem[];
    },
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (item: Omit<WishlistItem, 'id' | 'user_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('wishlists')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data as WishlistItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: "Added to wishlist!",
        description: "Item has been added to your wishlist.",
      });
    },
    onError: (error) => {
      if (error.message.includes('duplicate')) {
        toast({
          title: "Already in wishlist",
          description: "This item is already in your wishlist.",
        });
      } else {
        toast({
          title: "Error adding to wishlist",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('product_id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing from wishlist",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Recently Viewed Hooks
export function useRecentlyViewed() {
  return useQuery({
    queryKey: ['recently-viewed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recently_viewed')
        .select('*')
        .order('viewed_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as RecentlyViewedItem[];
    },
  });
}

export function useTrackRecentlyViewed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: { 
      product_id: string; 
      product_title: string; 
      product_image: string | null; 
      product_price: number | null; 
    }) => {
      const { error } = await supabase.rpc('upsert_recently_viewed', {
        p_product_id: item.product_id,
        p_product_title: item.product_title,
        p_product_image: item.product_image,
        p_product_price: item.product_price,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed'] });
    },
  });
}

// Image Upload Hook
export function useUploadImage() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (file: File) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User must be authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('canvas-uploads')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('canvas-uploads')
        .getPublicUrl(data.path);

      return publicUrl;
    },
    onError: (error) => {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Auth Hook
export function useAuthUser() {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });
}