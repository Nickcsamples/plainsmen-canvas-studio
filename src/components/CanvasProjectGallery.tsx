import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CanvasProject } from '@/hooks/useSupabase';
import { Image, Eye, Download, Trash2, Edit, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CanvasProjectGalleryProps {
  projects: CanvasProject[];
  isLoading: boolean;
}

export function CanvasProjectGallery({ projects, isLoading }: CanvasProjectGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="aspect-square w-full mb-4 rounded" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-3 w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No canvas projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first custom canvas print to get started.
            </p>
            <Button asChild>
              <Link to="/create-canvas">Create Canvas</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {/* Project Image */}
                <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-muted">
                  {project.image_url ? (
                    <>
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="icon" variant="secondary">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="secondary">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="secondary">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm leading-tight">{project.title}</h3>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs">
                      <Badge variant="outline" className="text-xs">
                        {project.layout}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {project.size}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <DollarSign className="h-3 w-3" />
                      {project.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex gap-1 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{project.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                      <span>{project.layout} • {project.size}</span>
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <DollarSign className="h-3 w-3" />
                        {project.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}