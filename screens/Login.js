import React, { Component, Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { HideWithKeyboard } from 'react-native-hide-with-keyboard'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import AppLogo from '../components/AppLogo'
import { withFirebaseHOC } from '../config/Firebase'

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a valid email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password must have at least 6 characters ')
})

class Login extends Component {
  state = {
    passwordVisibility: true,
    rightIcon: 'ios-eye'
  }

  goToSignup = () => this.props.navigation.navigate('Signup')
  goToForgotPassword = () => this.props.navigation.navigate('ForgotPassword')

  handlePasswordVisibility = () => {
    this.setState(prevState => ({
      rightIcon: prevState.rightIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
      passwordVisibility: !prevState.passwordVisibility
    }))
  }

  handleOnLogin = async (values, actions) => {
    const { email, password } = values
    try {
      const response = await this.props.firebase.loginWithEmail(email, password)

      if (response.user) {
        this.props.navigation.navigate('App')
      }
    } catch (error) {
      actions.setFieldError('general', error.message)
    } finally {
      actions.setSubmitting(false)
    }
  }

  render() {
    const { passwordVisibility, rightIcon } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <HideWithKeyboard style={styles.logoContainer}>
          <AppLogo />
        </HideWithKeyboard>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(values, actions) => {
            this.handleOnLogin(values, actions)
          }}
          validationSchema={validationSchema}>
          {({
            handleChange,
            values,
            handleSubmit,
            errors,
            isValid,
            touched,
            handleBlur,
            isSubmitting
          }) => (
            <Fragment>
              <FormInput
                name='email'
                value={values.email}
                onChangeText={handleChange('email')}
                placeholder='Enter email'
                autoCapitalize='none'
                iconName='ios-mail'
                iconColor='#fff'
                onBlur={handleBlur('email')}
                 
              />
              <ErrorMessage errorValue={touched.email && errors.email} />
              <FormInput
                name='password'
                value={values.password}
                onChangeText={handleChange('password')}
                placeholder='Enter password'
                secureTextEntry={passwordVisibility}
                iconName='ios-lock'
                iconColor='#fff'
                onBlur={handleBlur('password')}
                rightIcon={
                  <TouchableOpacity onPress={this.handlePasswordVisibility}>
                    <Ionicons name={rightIcon} size={28} color='grey' />
                  </TouchableOpacity>
                }
              />
              <ErrorMessage errorValue={touched.password && errors.password} />
              <View style={styles.buttonContainer}>
                <FormButton
                  buttonType='outline'
                  onPress={handleSubmit}
                  title='Sign In'                 
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                  
                />
              </View>
              <ErrorMessage errorValue={errors.general} />
            </Fragment>
          )}
        </Formik>
         
          <Button
          title="Don't have an account? Add User"
          onPress={this.goToSignup}
          titleStyle={{
            color: '#F57C00'
          }}
          type='clear'
        />
        <Button
          title='Forgot Password?'
          onPress={this.goToForgotPassword}
          titleStyle={{
            color: '#039BE5'
          }}
          type='clear'
        /> 
        
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e2477',
    marginTop: 0,
     color: 'red',
     
  },

textInput: {
    height: 40,
    fontSize:20,
    width: '90%',
    color:'red',
    borderColor: '#9b9b9b',
    borderBottomWidth: 1,
    marginTop: 8,
    marginVertical: 15
  },

 

  logoContainer: {
    marginBottom: 100,
    marginTop: 60,
    alignItems: 'center'
  },
  buttonContainer: {
    margin: 30,
    marginTop:60,
    backgroundColor: '#fff',
    borderRadius:0,

  }
})

export default withFirebaseHOC(Login)
