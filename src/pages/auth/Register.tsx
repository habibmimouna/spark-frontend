import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
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
  IonText,
  IonCard,
  IonCardContent,
  IonToast,
} from '@ionic/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const DoctorRegisterPage: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Required'),
    phoneNumber: Yup.string().required('Required'),
    state: Yup.string().required('Required'),
    medicalSpecialty: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      state: '',
      medicalSpecialty: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/auth/signup',
          values
        );

        if (response.data.token) {
          setToastColor('success');
          setToastMessage('Registration successful! Redirecting to login...');
          setShowToast(true);
          
          // Wait for toast to be visible before redirecting
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } catch (error: any) {
        setToastColor('danger');
        setToastMessage(error.response?.data?.message || 'Registration failed');
        setShowToast(true);
      }
    },
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Doctor Registration</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <form onSubmit={formik.handleSubmit}>
              <IonItem>
                <IonLabel position="stacked">First Name</IonLabel>
                <IonInput
                  name="firstName"
                  value={formik.values.firstName}
                  onIonChange={formik.handleChange}
                />
              </IonItem>
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="error-message">{formik.errors.firstName}</div>
              )}

              <IonItem>
                <IonLabel position="stacked">Last Name</IonLabel>
                <IonInput
                  name="lastName"
                  value={formik.values.lastName}
                  onIonChange={formik.handleChange}
                />
              </IonItem>
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="error-message">{formik.errors.lastName}</div>
              )}

              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
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
                <IonLabel position="stacked">Password</IonLabel>
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

              <IonItem>
                <IonLabel position="stacked">Phone Number</IonLabel>
                <IonInput
                  type="tel"
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onIonChange={formik.handleChange}
                />
              </IonItem>
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <div className="error-message">{formik.errors.phoneNumber}</div>
              )}

              <IonItem>
                <IonLabel position="stacked">State</IonLabel>
                <IonInput
                  name="state"
                  value={formik.values.state}
                  onIonChange={formik.handleChange}
                />
              </IonItem>
              {formik.touched.state && formik.errors.state && (
                <div className="error-message">{formik.errors.state}</div>
              )}

              <IonItem>
                <IonLabel position="stacked">Medical Specialty</IonLabel>
                <IonInput
                  name="medicalSpecialty"
                  value={formik.values.medicalSpecialty}
                  onIonChange={formik.handleChange}
                />
              </IonItem>
              {formik.touched.medicalSpecialty && formik.errors.medicalSpecialty && (
                <div className="error-message">{formik.errors.medicalSpecialty}</div>
              )}

              <IonButton
                expand="block"
                type="submit"
                className="ion-margin-top"
              >
                Register
              </IonButton>

              <div className="ion-text-center ion-padding-top">
                <IonText>
                  Already have an account?{' '}
                  <IonButton fill="clear" routerLink="/login" className="ion-no-padding">
                    Login here
                  </IonButton>
                </IonText>
              </div>
            </form>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default DoctorRegisterPage;