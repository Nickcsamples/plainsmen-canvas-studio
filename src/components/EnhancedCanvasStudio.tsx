import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Palette,
  Type,
  Image as ImageIcon,
  Layers,
  Download,
  Upload,
  Undo,
  Redo,
  Trash2,
  Copy,
  Move,
  RotateCw,
  Square,
  Circle,
  Triangle,
  Minus
} from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { toast } from 'sonner';

interface CanvasObject {
  id: string;
  type: 'image' | 'text' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  data: any;
}

interface EnhancedCanvasStudioProps {
  width?: number;
  height?: number;
  onSave?: (imageData: string) => void;
  className?: string;
}

export function EnhancedCanvasStudio({
  width = 800,
  height = 600,
  onSave,
  className
}: EnhancedCanvasStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [history, setHistory] = useState<CanvasObject[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tool, setTool] = useState<'select' | 'text' | 'image' | 'shape'>('select');
  const [brushSize, setBrushSize] = useState(5);
  const [textSize, setTextSize] = useState(24);
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const { announcePageChange } = useAccessibility();

  useEffect(() => {
    announcePageChange('Canvas studio loaded');
  }, [announcePageChange]);

  const addToHistory = (newObjects: CanvasObject[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newObjects]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setObjects([...history[historyIndex - 1]]);
      toast.success('Undid last action');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setObjects([...history[historyIndex + 1]]);
      toast.success('Redid action');
    }
  };

  const addTextObject = () => {
    const newObject: CanvasObject = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: width / 2 - 50,
      y: height / 2 - 12,
      width: 100,
      height: 24,
      rotation: 0,
      data: {
        text: 'New Text',
        fontSize: textSize,
        color: textColor,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        textAlign: 'left'
      }
    };
    
    const newObjects = [...objects, newObject];
    setObjects(newObjects);
    setSelectedObject(newObject.id);
    addToHistory(newObjects);
    toast.success('Text added to canvas');
  };

  const addShapeObject = (shapeType: 'rectangle' | 'circle' | 'triangle' | 'line') => {
    const newObject: CanvasObject = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      x: width / 2 - 50,
      y: height / 2 - 50,
      width: 100,
      height: 100,
      rotation: 0,
      data: {
        shape: shapeType,
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2
      }
    };
    
    const newObjects = [...objects, newObject];
    setObjects(newObjects);
    setSelectedObject(newObject.id);
    addToHistory(newObjects);
    toast.success(`${shapeType} added to canvas`);
  };

  const deleteSelectedObject = () => {
    if (!selectedObject) return;
    
    const newObjects = objects.filter(obj => obj.id !== selectedObject);
    setObjects(newObjects);
    setSelectedObject(null);
    addToHistory(newObjects);
    toast.success('Object deleted');
  };

  const duplicateSelectedObject = () => {
    const obj = objects.find(o => o.id === selectedObject);
    if (!obj) return;

    const newObject: CanvasObject = {
      ...obj,
      id: `${obj.type}-${Date.now()}`,
      x: obj.x + 20,
      y: obj.y + 20
    };
    
    const newObjects = [...objects, newObject];
    setObjects(newObjects);
    setSelectedObject(newObject.id);
    addToHistory(newObjects);
    toast.success('Object duplicated');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const maxWidth = width * 0.5;
        const maxHeight = height * 0.5;
        
        let objWidth = maxWidth;
        let objHeight = maxWidth / aspectRatio;
        
        if (objHeight > maxHeight) {
          objHeight = maxHeight;
          objWidth = maxHeight * aspectRatio;
        }

        const newObject: CanvasObject = {
          id: `image-${Date.now()}`,
          type: 'image',
          x: width / 2 - objWidth / 2,
          y: height / 2 - objHeight / 2,
          width: objWidth,
          height: objHeight,
          rotation: 0,
          data: {
            src: e.target?.result as string,
            originalWidth: img.width,
            originalHeight: img.height
          }
        };
        
        const newObjects = [...objects, newObject];
        setObjects(newObjects);
        setSelectedObject(newObject.id);
        addToHistory(newObjects);
        toast.success('Image added to canvas');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    onSave?.(dataURL);
    
    // Create download link
    const link = document.createElement('a');
    link.download = `canvas-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    toast.success('Canvas exported successfully');
  };

  const clearCanvas = () => {
    setObjects([]);
    setSelectedObject(null);
    addToHistory([]);
    toast.success('Canvas cleared');
  };

  return (
    <div className={className} role="application" aria-label="Enhanced Canvas Studio">
      <div className="flex gap-4 mb-4">
        <Card className="flex-1 p-4">
          {/* Main Toolbar */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Button
              variant={tool === 'select' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('select')}
              aria-label="Select tool"
            >
              <Move className="h-4 w-4" />
            </Button>
            
            <Button
              variant={tool === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setTool('text');
                addTextObject();
              }}
              aria-label="Add text"
            >
              <Type className="h-4 w-4" />
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Upload image"
              />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addShapeObject('rectangle')}
                aria-label="Add rectangle"
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addShapeObject('circle')}
                aria-label="Add circle"
              >
                <Circle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addShapeObject('triangle')}
                aria-label="Add triangle"
              >
                <Triangle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addShapeObject('line')}
                aria-label="Add line"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="border-l pl-2 ml-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
                aria-label="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                aria-label="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            
            {selectedObject && (
              <div className="border-l pl-2 ml-2 flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={duplicateSelectedObject}
                  aria-label="Duplicate selected object"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteSelectedObject}
                  aria-label="Delete selected object"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="border-l pl-2 ml-2 flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={exportCanvas}
                aria-label="Export canvas"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                aria-label="Clear canvas"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="border rounded-lg overflow-hidden bg-white" style={{ aspectRatio: `${width}/${height}` }}>
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="w-full h-full cursor-crosshair"
              style={{ backgroundColor }}
              aria-label="Drawing canvas"
              tabIndex={0}
            />
          </div>
        </Card>

        {/* Properties Panel */}
        <Card className="w-80 p-4">
          <Tabs defaultValue="canvas" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="canvas">Canvas</TabsTrigger>
              <TabsTrigger value="object">Object</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="canvas" className="space-y-4">
              <div>
                <Label htmlFor="bg-color">Background Color</Label>
                <Input
                  id="bg-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="canvas-width">Canvas Size</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input placeholder={width.toString()} disabled />
                  <Input placeholder={height.toString()} disabled />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="object" className="space-y-4">
              {selectedObject ? (
                <>
                  <div>
                    <Label htmlFor="text-size">Text Size</Label>
                    <Slider
                      id="text-size"
                      value={[textSize]}
                      onValueChange={([value]) => setTextSize(value)}
                      min={8}
                      max={72}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">{textSize}px</div>
                  </div>
                  
                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <Input
                      id="text-color"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select an object to edit its properties
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="layers" className="space-y-2">
              {objects.map((obj, index) => (
                <div
                  key={obj.id}
                  className={`p-2 border rounded cursor-pointer flex items-center justify-between ${
                    selectedObject === obj.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setSelectedObject(obj.id)}
                >
                  <div className="flex items-center gap-2">
                    {obj.type === 'text' && <Type className="h-4 w-4" />}
                    {obj.type === 'image' && <ImageIcon className="h-4 w-4" />}
                    {obj.type === 'shape' && <Square className="h-4 w-4" />}
                    <span className="text-sm">
                      {obj.type === 'text' ? obj.data.text : `${obj.type} ${index + 1}`}
                    </span>
                  </div>
                </div>
              ))}
              
              {objects.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No layers yet. Add some content to get started.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}