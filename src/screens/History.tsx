import { Center, Heading, SectionList, Text, VStack } from "native-base";
import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";
import { useState } from "react";


export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "19.03",
      data: ["Stiff", "Agachamento"]
    },
    {
      title: "20.03",
      data: ["Puxada baixa", "Remada alta"]
    },
  ])
  return (
    <VStack flex={1}>
      <ScreenHeader title='Histórico de exercícios' />

      <SectionList
        sections={exercises}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <HistoryCard />
        )}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há exercícios registrados ainda. {"\n"}
            Vamos se exercitar hoje?
          </Text>
        )}
      />
    </VStack>
  )
}