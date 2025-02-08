import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
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
} from '@ionic/react';

const RegisterPage: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [state, setState] = useState('');
  const [medicalSpecialty, setMedicalSpecialty] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        state,
        medicalSpecialty
      });

      console.log(response.data);
      localStorage.setItem('token', response.data.token);

      history.push('/login');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <form>
              <IonItem>
                <IonLabel position="floating">First Name</IonLabel>
                <IonInput
                  type="text"
                  value={firstName}
                  onIonChange={(e) => setFirstName(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Last Name</IonLabel>
                <IonInput
                  type="text"
                  value={lastName}
                  onIonChange={(e) => setLastName(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Phone Number</IonLabel>
                <IonInput
                  type="text"
                  value={phoneNumber}
                  onIonChange={(e) => setPhoneNumber(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">State</IonLabel>
                <IonInput
                  type="text"
                  value={state}
                  onIonChange={(e) => setState(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Medical Specialty</IonLabel>
                <IonInput
                  type="text"
                  value={medicalSpecialty}
                  onIonChange={(e) => setMedicalSpecialty(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                />
              </IonItem>

              {errorMessage && (
                <IonText color="danger">
                  <p>{errorMessage}</p>
                </IonText>
              )}

              <IonButton expand="block" className="ion-margin-top" onClick={handleRegister}>
                Register
              </IonButton>
            </form>

            <IonText className="ion-text-center ion-margin-top">
              <p>
                Already have an account?{' '}
                <IonButton fill="clear" routerLink="/login" className="ion-no-padding">
                  Login here
                </IonButton>
              </p>
            </IonText>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
