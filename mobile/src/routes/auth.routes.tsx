import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SingIn } from '@screens/SignIn'
import { SingUp } from '@screens/SignUp'

type AuthRoutes = {
  singIn: undefined
  singUp: undefined
}

export type AuthNavigationRoutesProps = NativeStackNavigationProp<AuthRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>()

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen
        name='singIn'
        component={SingIn}
      />
      <Screen
        name='singUp'
        component={SingUp}
      />
    </Navigator>
  )
}