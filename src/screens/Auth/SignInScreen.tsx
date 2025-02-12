import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm } from 'react-hook-form'
import { EMAIL_REGEX } from '../../constant'
import { useTheme, useRoute, useNavigation } from '@react-navigation/native'
import { SignInScreenRouteProps, SignInScreenNavigationProps } from '../../types/NavigationProps'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useAuth } from '../../hooks/useAuth'

//  components
import Button from '../../components/common/Button'
import IconFacebookRounded from '../../components/Svg/IconFacebookRounded'
import IconGoogle from '../../components/Svg/IconGoogle'
import Input from '../../components/common/Input'
import LoadingModal from '../../components/common/LoadingModal'
import NotificationModal from '../../components/common/NotificationModal'

interface formData {
  email: string,
  password: string
}

interface modalProps {
  show: boolean,
  message: string
}

const SignInScreen = () => {
  const { control, resetField, handleSubmit, setValue } = useForm<formData>()

  const navigation = useNavigation<SignInScreenNavigationProps>()

  const isDarkMode = useTheme().dark

  const route = useRoute<SignInScreenRouteProps>()

  const { signIn, signInIsLoading } = useAuth()

  useEffect(() => {
    setValue('email', route.params?.email)
  }, [])

  const cleanEmailField = () => resetField('email')

  const cleanPasswordField = () => resetField('password')

  const goToForgotPassword = () => navigation.navigate('ForgotPassword')

  const [modal, setModal] = useState<modalProps>({ show: false, message: '' })

  const onPressSignIn = async (data: formData) => {
    if (signInIsLoading) return

    const { email, password } = data

    signIn({ email, password }, {
      onError: (error) => {
        console.log(error)

        setModal({
          show: true,
          message: 'Oh no! correo electronico o contraseña invalidos'
        })
      }
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <Button
            text='Continuar con Facebook'
            buttonStyles={styles.buttonFacebook}
            onPress={() => console.log('facebook!')}
            iconLeft={<IconFacebookRounded color='#fff' />}
          />

          <Button
            text='Continuar con Google'
            buttonStyles={styles.buttonGoogle}
            onPress={() => console.log('google')}
            iconLeft={<IconGoogle size={26} />}
          />

          <Text style={[styles.or, { color: isDarkMode ? '#fff' : '#000' }]}>O</Text>

          <Input
            name='email'
            control={control}
            placeholder='Correo'
            resetField={cleanEmailField}
            rules={{
              required: { value: true, message: 'Ingresa tu correo electronico' },
              validate: (value: string) => EMAIL_REGEX.test(value.trim()) || 'Este correo electronico no parece ser válido'
            }}
            containerStyles={styles.emailInput}
          />

          <Input
            name='password'
            control={control}
            placeholder='Ingresa tu contraseña'
            resetField={cleanPasswordField}
            secureTextEntry
            rules={{
              required: { value: true, message: 'Ingresa tu contraseña' }
            }}
            containerStyles={styles.passwordInput}
          />

          <Button
            text='Continuar'
            buttonStyles={styles.buttonContinue}
            onPress={handleSubmit(onPressSignIn)}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={() => goToForgotPassword()}>
            <Text style={styles.forgotPassword}>¿Has olvidado tu contraseña?</Text>
          </TouchableOpacity>

          {signInIsLoading && <LoadingModal isVisible={signInIsLoading} />}
          {modal.show && <NotificationModal isVisible={modal.show} isError message={modal.message} onCloseModal={() => setModal({ show: false, message: '' })} />}

        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  body: {
    marginTop: 15,
    alignItems: 'center'
  },

  buttonFacebook: {
    backgroundColor: '#1178f2',
    marginVertical: 10
  },

  buttonGoogle: {
    backgroundColor: '#4d4d4d'
  },

  or: {
    marginVertical: 35,
    fontSize: 20
  },

  emailInput: {
    marginBottom: 10
  },

  passwordInput: {
    marginBottom: 55
  },

  buttonContinue: {
    marginBottom: 15
  },

  forgotPassword: {
    fontSize: 16,
    color: '#808080'
  }
})

export default SignInScreen
