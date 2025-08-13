import { useState } from 'react';
import { useUserProfile, useUserOrders, useUserReviews } from '@/hooks/useUserData';
import { useWishlist, useAuthUser, useCanvasProjects } from '@/hooks/useSupabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileForm } from '@/components/ProfileForm';
import { OrderHistory } from '@/components/OrderHistory';
import { ReviewsList } from '@/components/ReviewsList';
import { CanvasProjectGallery } from '@/components/CanvasProjectGallery';
import { User, Package, Heart, Star, Image, Settings, ShoppingBag } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: user, isLoading: userLoading } = useAuthUser();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: canvasProjects = [], isLoading: projectsLoading } = useCanvasProjects();
  const { data: orders = [], isLoading: ordersLoading } = useUserOrders();
  const { data: reviews = [], isLoading: reviewsLoading } = useUserReviews();
  const { data: wishlist = [], isLoading: wishlistLoading } = useWishlist();

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-4 w-32 mx-auto mb-2" />
                <Skeleton className="h-3 w-24 mx-auto" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const displayName = profile?.display_name || 
    (profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : null) ||
    user.email?.split('@')[0] || 
    'User';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
                  <AvatarFallback className="text-lg">{getInitials(displayName)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{displayName}</h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
              
              <nav className="space-y-2">
                <Button
                  variant={activeTab === 'overview' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('overview')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Overview
                </Button>
                <Button
                  variant={activeTab === 'profile' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('profile')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profile Settings
                </Button>
                <Button
                  variant={activeTab === 'orders' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('orders')}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Order History
                </Button>
                <Button
                  variant={activeTab === 'projects' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('projects')}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Canvas Projects
                </Button>
                <Button
                  variant={activeTab === 'reviews' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('reviews')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  My Reviews
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/wishlist">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist ({wishlist.length})
                  </Link>
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <>
              <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{ordersLoading ? '--' : orders.length}</p>
                      </div>
                      <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Canvas Projects</p>
                        <p className="text-2xl font-bold">{projectsLoading ? '--' : canvasProjects.length}</p>
                      </div>
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Reviews Written</p>
                        <p className="text-2xl font-bold">{reviewsLoading ? '--' : reviews.length}</p>
                      </div>
                      <Star className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Wishlist Items</p>
                        <p className="text-2xl font-bold">{wishlistLoading ? '--' : wishlist.length}</p>
                      </div>
                      <Heart className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest order activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        ))}
                      </div>
                    ) : orders.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No orders yet</p>
                    ) : (
                      <div className="space-y-3">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{order.order_number}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={
                              order.status === 'delivered' ? 'default' :
                              order.status === 'shipped' ? 'secondary' :
                              order.status === 'processing' ? 'outline' : 'destructive'
                            }>
                              {order.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>Your latest canvas creations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {projectsLoading ? (
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-24 mb-1" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : canvasProjects.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No projects yet. <Link to="/create-canvas" className="text-primary underline">Create your first canvas</Link>
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {canvasProjects.slice(0, 5).map((project) => (
                          <div key={project.id} className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded overflow-hidden bg-muted">
                              {project.image_url && (
                                <img 
                                  src={project.image_url} 
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{project.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(project.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeTab === 'profile' && (
            <>
              <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
              <ProfileForm profile={profile} />
            </>
          )}

          {activeTab === 'orders' && (
            <>
              <h1 className="text-3xl font-bold mb-8">Order History</h1>
              <OrderHistory orders={orders} isLoading={ordersLoading} />
            </>
          )}

          {activeTab === 'projects' && (
            <>
              <h1 className="text-3xl font-bold mb-8">Canvas Projects</h1>
              <CanvasProjectGallery projects={canvasProjects} isLoading={projectsLoading} />
            </>
          )}

          {activeTab === 'reviews' && (
            <>
              <h1 className="text-3xl font-bold mb-8">My Reviews</h1>
              <ReviewsList reviews={reviews} isLoading={reviewsLoading} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}