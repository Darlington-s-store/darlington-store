
interface PlaceholderAvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PlaceholderAvatar = ({ name = 'User', size = 'md', className = '' }: PlaceholderAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const getInitials = (fullName: string) => {
    if (!fullName || fullName.trim() === '') {
      return 'U';
    }
    
    return fullName
      .trim()
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`${sizeClasses[size]} ${className} bg-gray-500 rounded-full flex items-center justify-center text-white font-medium`}>
      {getInitials(name)}
    </div>
  );
};

export default PlaceholderAvatar;
