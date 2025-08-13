import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ProductReview } from '@/hooks/useUserData';
import { Star, Edit, Trash2, ThumbsUp } from 'lucide-react';

interface ReviewsListProps {
  reviews: ProductReview[];
  isLoading: boolean;
}

export function ReviewsList({ reviews, isLoading }: ReviewsListProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-6">
              Start shopping and leave reviews for products you purchase.
            </p>
            <Button asChild>
              <a href="/">Browse Products</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{review.title}</CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
                {review.is_verified && (
                  <Badge variant="secondary">Verified Purchase</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Product: {review.product_title}</span>
              <span>•</span>
              <span>{new Date(review.created_at).toLocaleDateString()}</span>
              {review.helpful_count > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {review.helpful_count} helpful
                  </span>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{review.content}</p>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Review
              </Button>
              <Button size="sm" variant="ghost">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}