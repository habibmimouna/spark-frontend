import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonToast,
  IonCard,
  IonCardContent,
  IonText,
} from '@ionic/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';

const LoginPage: React.FC = () => {
  const history = useHistory();
  const [userType, setUserType] = useState<'doctor' | 'patient'>('doctor');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (userType === 'doctor') {
          const response = await AuthService.login(values);
          localStorage.setItem('userType', 'doctor');
          history.push('/doctor/dashboard');
        } else {
          const response = await AuthService.patientLogin(values);
          
          localStorage.setItem('userType', 'patient');
          history.push('/patient/dashboard');
        }
      } catch (error: any) {
        setToastMessage(error.response?.data?.message || 'Login failed');
        setShowToast(true);
      }
    },
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonSegment 
              value={userType} 
              onIonChange={e => setUserType(e.detail.value as 'doctor' | 'patient')}
            >
              <IonSegmentButton value="doctor">
                <IonLabel>Doctor</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="patient">
                <IonLabel>Patient</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            <form onSubmit={formik.handleSubmit}>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onIonChange={formik.handleChange}
                />
              </IonItem>
              {formik.touched.email && formik.errors.email && (
                <div className="error-message">{formik.errors.email}</div>
              )}

              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onIonChange={formik.handleChange}
                />
              </IonItem>
              {formik.touched.password && formik.errors.password && (
                <div className="error-message">{formik.errors.password}</div>
              )}

              <IonButton expand="block" type="submit" className="ion-margin-top">
                Login
              </IonButton>

              <IonButton 
                expand="block" 
                fill="clear" 
                routerLink="/reset-password"
              >
                Forgot Password?
              </IonButton>
            </form>

            {/* Add a link to the registration page */}
            <IonText className="ion-text-center ion-margin-top">
              <p>
                Don't have an account?{' '}
                <IonButton 
                  fill="clear" 
                  routerLink="/register" 
                  className="ion-no-padding"
                >
                  Register here
                </IonButton>
              </p>
            </IonText>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;