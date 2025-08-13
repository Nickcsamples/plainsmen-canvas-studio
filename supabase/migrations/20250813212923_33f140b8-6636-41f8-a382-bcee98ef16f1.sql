-- Fix function security issues by setting proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.upsert_recently_viewed(
  p_product_id TEXT,
  p_product_title TEXT,
  p_product_image TEXT,
  p_product_price DECIMAL(10,2)
)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.recently_viewed (user_id, product_id, product_title, product_image, product_price, viewed_at)
  VALUES (auth.uid(), p_product_id, p_product_title, p_product_image, p_product_price, now())
  ON CONFLICT (user_id, product_id) 
  DO UPDATE SET viewed_at = now();
END;
$$;