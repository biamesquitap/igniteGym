import { Center, HStack, Heading, Text, VStack } from "native-base";

export function HistoryCard() {
  return (
    <HStack w="full" px={5} py={4} mb={3} bg="gray.600" rounded="md" alignItems="center">
      <VStack mr={5} flex={1}>
        <Heading color="white" fontSize="md" textTransform="capitalize" fontFamily="heading" numberOfLines={1}>
          Posterior
        </Heading>
        <Text color="gray.100" fontSize="lg" numberOfLines={1}>
          Stiff
        </Text>
      </VStack>

      <Text color="gray.300" fontSize="md">
        12:53
      </Text>
    </HStack>
  )
}