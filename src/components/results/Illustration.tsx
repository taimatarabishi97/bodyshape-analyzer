import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface IllustrationProps {
  src?: string;
  alt: string;
  type?: 'silhouette' | 'icon' | 'outfit' | 'generic';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: React.ReactNode;
}

const Illustration = ({
  src,
  alt,
  type = 'generic',
  size = 'md',
  className,
  fallback,
}: IllustrationProps) => {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-32 w-32',
    lg: 'h-48 w-48',
    xl: 'h-64 w-64',
  };

  const typeClasses = {
    silhouette: 'bg-gradient-to-br from-gray-800 to-gray-900',
    icon: 'bg-gray-800/50',
    outfit: 'bg-gradient-to-br from-gray-700 to-gray-800',
    generic: 'bg-gray-800',
  };

  const renderFallback = () => {
    if (fallback) return fallback;
    
    const fallbackContent = {
      silhouette: (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-4xl mb-2">👗</div>
          <p className="text-xs text-gray-500">Silhouette</p>
        </div>
      ),
      icon: (
        <div className="flex items-center justify-center h-full">
          <span className="text-2xl">👕</span>
        </div>
      ),
      outfit: (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-3xl mb-2">👚👖</div>
          <p className="text-xs text-gray-500">Outfit</p>
        </div>
      ),
      generic: (
        <div className="flex items-center justify-center h-full">
          <span className="text-2xl">🖼️</span>
        </div>
      ),
    };

    return fallbackContent[type];
  };

  return (
    <Card className={cn(
      'overflow-hidden border-gray-700 bg-transparent',
      className
    )}>
      <CardContent className="p-0">
        <div className={cn(
          'flex items-center justify-center rounded-lg',
          sizeClasses[size],
          typeClasses[type],
          !src && 'border border-dashed border-gray-600'
        )}>
          {src ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-contain p-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // We'll handle fallback through CSS sibling selector
              }}
            />
          ) : (
            renderFallback()
          )}
          
          {/* Hidden fallback container that shows when image fails */}
          {src && (
            <div className="hidden [.img-failed+&]:flex items-center justify-center h-full w-full">
              {renderFallback()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Illustration;