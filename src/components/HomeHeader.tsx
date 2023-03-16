import { Heading, HStack, Text, VStack } from "native-base";
import { UserPhoto } from "./UserPhoto";


export function HomeHeader() {
  return (
    <HStack bg='gray.600' pt={16} pb={5} px={8} alignItems='center'>
      <UserPhoto
        source={{ uri: 'https://github.com/biamesquitap.png' }}
        alt='Imagem do usuário'
        size={16}
      />
      <VStack>
        <Text color='gray.100' fontSize="md">
          Olá,
        </Text>
        <Heading color='gray.100' fontSize="md" fontWeight='bold'>
          Bia!
        </Heading>
      </VStack>
    </HStack>
  )
}