import { Box, Flex, Text, Avatar} from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true } : ProfileProps) {
  return (
    <Flex align='center'>
      {showProfileData && (
        <Box mr='4' textAlign='right'>
        <Text>Luis Felipe</Text>
        <Text color='gray.300' fontSize='small'>
          lluisfelipe1619@gmail.com
        </Text>
      </Box>
      )} 

      <Avatar size='md' name='Luis Felipe' src='https://github.com/luisfelipedev44'/>
    </Flex>
  )
}