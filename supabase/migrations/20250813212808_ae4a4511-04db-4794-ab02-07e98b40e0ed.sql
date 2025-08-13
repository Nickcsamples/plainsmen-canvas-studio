-- Create storage bucket for canvas images
INSERT INTO storage.buckets (id, name, public) VALUES ('canvas-uploads', 'canvas-uploads', false);

-- Create policies for canvas uploads
CREATE POLICY "Users can upload their own canvas images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'canvas-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own canvas images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'canvas-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own canvas images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'canvas-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own canvas images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'canvas-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create custom canvas projects table
CREATE TABLE public.canvas_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT,
  layout TEXT NOT NULL,
  size TEXT NOT NULL,
  frame TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.canvas_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for canvas projects
CREATE POLICY "Users can view their own canvas projects" 
ON public.canvas_projects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own canvas projects" 
ON public.canvas_projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own canvas projects" 
ON public.canvas_projects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own canvas projects" 
ON public.canvas_projects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create wishlist table
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  product_image TEXT,
  product_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlists
CREATE POLICY "Users can view their own wishlist" 
ON public.wishlists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist" 
ON public.wishlists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own wishlist" 
ON public.wishlists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create recently viewed products table
CREATE TABLE public.recently_viewed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  product_image TEXT,
  product_price DECIMAL(10,2),
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

-- Create policies for recently viewed
CREATE POLICY "Users can view their own recently viewed products" 
ON public.recently_viewed 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own recently viewed" 
ON public.recently_viewed 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recently viewed" 
ON public.recently_viewed 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for canvas projects
CREATE TRIGGER update_canvas_projects_updated_at
BEFORE UPDATE ON public.canvas_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle recently viewed upsert
CREATE OR REPLACE FUNCTION public.upsert_recently_viewed(
  p_product_id TEXT,
  p_product_title TEXT,
  p_product_image TEXT,
  p_product_price DECIMAL(10,2)
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.recently_viewed (user_id, product_id, product_title, product_image, product_price, viewed_at)
  VALUES (auth.uid(), p_product_id, p_product_title, p_product_image, p_product_price, now())
  ON CONFLICT (user_id, product_id) 
  DO UPDATE SET viewed_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;