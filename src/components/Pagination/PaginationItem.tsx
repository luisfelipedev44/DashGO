import { Button } from "@chakra-ui/react";

interface PaginationItemProps {
  number: number;
  isCurrent?: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationItem({ 
  isCurrent = false, 
  onPageChange,
  number
  } : PaginationItemProps) {
  if (isCurrent) {
    return(
      <Button 
        size='sm' 
        fontSize='xs' 
        width='4' 
        colorScheme='pink' 
        disabled 
        _disabled={{
          bgColor: 'pink.500',
          cursor: 'default',
      }}>
        {number}
      </Button>
    )
  }

  return(
    <Button 
        size='sm' 
        fontSize='xs' 
        width='4' 
        bg='gray.700'
        color='gray.100'
        _hover={{
          bg: 'gray.200',
          color: 'gray.900', 
        }}
        onClick={() => onPageChange(number)}
      >
        {number}
      </Button>
  )
}