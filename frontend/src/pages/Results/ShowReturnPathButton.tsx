import { Button } from '@/components/ui/button';

type props = {
  onClick: () => void;
};

export const ShowReturnPathButton: React.FC<props> = ({ onClick }) => {
  return (
    <Button
      variant='outline'
      size='icon'
      className='rounded-full'
      onClick={onClick}
      style={{ display: 'flex', flexDirection: 'column', gap:"0" }}
    >
      <span>→</span>
      <span>←</span>
    </Button>
  );
};
