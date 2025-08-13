import { useState } from 'react';
import { useProductReviews, useCreateReview } from '@/hooks/useUserData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AppProduct } from '@/services/shopify/types';
import { useAuthUser } from '@/hooks/useSupabase';
import { toast } from 'sonner';

interface ProductReviewsProps {
  product: AppProduct;
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: '',
  });

  const { data: user } = useAuthUser();
  const { data: reviews = [], isLoading } = useProductReviews(product.id);
  const createReview = useCreateReview();

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 cursor-${interactive ? 'pointer' : 'default'} transition-colors ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'
        }`}
        onClick={interactive ? () => setNewReview({ ...newReview, rating: i + 1 }) : undefined}
      />
    ));
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (newReview.rating === 0 || !newReview.title.trim() || !newReview.content.trim()) {
      toast.error("Please fill in all fields and select a rating");
      return;
    }

    try {
      await createReview.mutateAsync({
        product_id: product.id,
        product_title: product.title,
        rating: newReview.rating,
        title: newReview.title.trim(),
        content: newReview.content.trim(),
      });

      setNewReview({ rating: 0, title: '', content: '' });
      setIsWritingReview(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const ratingCounts = Array.from({ length: 5 }, (_, i) => 
    reviews.filter(review => review.rating === 5 - i).length
  );

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            <Dialog open={isWritingReview} onOpenChange={setIsWritingReview}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Rating *</Label>
                    <div className="flex items-center gap-1 mt-2">
                      {renderStars(newReview.rating, true)}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="review-title">Title *</Label>
                    <Input
                      id="review-title"
                      placeholder="Summarize your review"
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="review-content">Review *</Label>
                    <Textarea
                      id="review-content"
                      placeholder="Share your thoughts about this product"
                      value={newReview.content}
                      onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsWritingReview(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitReview} disabled={createReview.isPending}>
                      {createReview.isPending ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center mb-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingCounts.map((count, index) => {
                  const stars = 5 - index;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  
                  return (
                    <div key={stars} className="flex items-center gap-2 text-sm">
                      <span className="w-8">{stars}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">
                Be the first to review this product!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {review.profiles?.display_name?.[0] || 
                         review.profiles?.first_name?.[0] || 
                         'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {review.profiles?.display_name ||
                         (review.profiles?.first_name && review.profiles?.last_name 
                           ? `${review.profiles.first_name} ${review.profiles.last_name}`
                           : 'Anonymous')}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        <span>•</span>
                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {review.is_verified && (
                    <Badge variant="secondary">Verified Purchase</Badge>
                  )}
                </div>

                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className="text-muted-foreground mb-4">{review.content}</p>

                {review.helpful_count > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.helpful_count} people found this helpful</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}