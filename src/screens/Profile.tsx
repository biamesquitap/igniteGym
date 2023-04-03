import { useState } from 'react'
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from "native-base";
import { Alert, TouchableOpacity } from 'react-native';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import * as yup from 'yup'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';

const PHOTO_SIZE = 33

type FormDataProps = {
  name: string
  email: string
  password: string
  oldPassword: string
  confirmPassword: string
}
const ProfileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 dígitos').nullable().transform((value) => !!value ? value : null),
  confirmPassword: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password')], 'As senhas não conferem')
    .when('password', {
      is: (Field: any) => Field,
      then: yup
        .string()
        .nullable()
        .required('Informe a confirmação da senha.')
        .transform((value) => !!value ? value : null)
    }),
})

export function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState("https://github.com/biamesquitap.png")

  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(ProfileSchema)
  })

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

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsLoading(true)

      const userUpdated = user
      userUpdated.name = data.name

      await updateUserProfile(userUpdated)

      await api.put('/users', data)
      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível atualizar o perfil, tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36, paddingHorizontal: 30 }}>
        <Center mt={6}>
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

          <Controller
            control={control}
            name='name'
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Nome"
                bg="gray.600"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='email'
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="E-mail"
                bg="gray.600"
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
          />



        </Center>


        <Heading color="gray.200" fontSize="md" fontWeight="bold" mb={2} fontFamily="heading" alignSelf="flex-start" mt={12}>
          Alterar senha
        </Heading>

        <Controller
          control={control}
          name='oldPassword'
          render={({ field: { onChange } }) => (
            <Input
              placeholder="Senha antiga"
              bg="gray.600"
              secureTextEntry
              onChangeText={onChange}

            />
          )}
        />

        <Controller
          control={control}
          name='password'
          render={({ field: { onChange } }) => (
            <Input
              placeholder="Nova Senha"
              bg="gray.600"
              secureTextEntry
              onChangeText={onChange}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name='confirmPassword'
          render={({ field: { onChange } }) => (
            <Input
              placeholder="Confirmar Nova Senha"
              bg="gray.600"
              secureTextEntry
              onChangeText={onChange}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />





        <Button
          title='Atualizar'
          mt={4}
          onPress={handleSubmit(handleProfileUpdate)}
          isLoading={isLoading}
        />
      </ScrollView>
    </VStack>
  )
}