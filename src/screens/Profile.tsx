import { useState } from 'react'
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from "native-base";
import { Alert, TouchableOpacity } from 'react-native';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

export function Profile() {
  const PHOTO_SIZE = 33
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState("https://github.com/biamesquitap.png")

  const toast = useToast()

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)

        if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
            placement: 'top',
            bgColor: "red.500"
          })
        }
        setUserPhoto(photoSelected.assets[0].uri)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
        <Center mt={6} px={10}>
          {
            photoIsLoading ?
              <Skeleton
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded="full"
                startColor="gray.500"
                endColor="gray.400"
              />
              :
              <UserPhoto
                source={{ uri: userPhoto }}
                alt="Foto do usuário"
                size={PHOTO_SIZE}
              />
          }
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Input
            placeholder="Nome"
            bg="gray.600"
          />
          <Input
            placeholder="E-mail"
            bg="gray.600"
            isDisabled
          />
        </Center>


        <Heading color="gray.200" fontSize="md" fontWeight="bold" mb={2} fontFamily="heading" alignSelf="flex-start" mt={12}>
          Alterar senha
        </Heading>
        <Input
          placeholder="Senha antiga"
          bg="gray.600"
          secureTextEntry
        />
        <Input
          placeholder="Nova Senha"
          bg="gray.600"
          secureTextEntry
        />
        <Input
          placeholder="Confirmar Nova Senha"
          bg="gray.600"
          secureTextEntry
        />

        <Button
          title='Atualizar'
          mt={4}
        />
      </ScrollView>
    </VStack>
  )
}