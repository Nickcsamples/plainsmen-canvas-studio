import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types
export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'billing' | 'shipping';
  first_name: string;
  last_name: string;
  company: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductReview {
  id: string;
  user_id: string;
  product_id: string;
  product_title: string;
  rating: number;
  title: string;
  content: string;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  currency: string;
  shipping_address: any;
  billing_address: any;
  items: any[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Profile Hooks
export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as UserProfile | null;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profile: Partial<UserProfile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .upsert([{ ...profile, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Address Hooks
export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Address[];
    },
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('addresses')
        .insert([address])
        .select()
        .single();
      
      if (error) throw error;
      return data as Address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast({
        title: "Address added",
        description: "Your address has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding address",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Review Hooks
export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          profiles:user_id (
            display_name,
            first_name,
            last_name
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (review: Omit<ProductReview, 'id' | 'user_id' | 'is_verified' | 'helpful_count' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('product_reviews')
        .insert([review])
        .select()
        .single();
      
      if (error) throw error;
      return data as ProductReview;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
      toast({
        title: "Review submitted",
        description: "Your review has been submitted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error submitting review",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Order Hooks
export function useUserOrders() {
  return useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    },
  });
}

export function useUserReviews() {
  return useQuery({
    queryKey: ['user-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ProductReview[];
    },
  });
}