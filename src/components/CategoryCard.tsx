interface CategoryCardProps {
  title: string;
  image: string;
  onClick?: () => void;
  className?: string;
}

const CategoryCard = ({ title, image, onClick, className = "" }: CategoryCardProps) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-lg cursor-pointer group transition-transform duration-300 hover:scale-105 h-48 ${className}`}
      onClick={onClick}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-white text-xl font-bold text-center px-4">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;