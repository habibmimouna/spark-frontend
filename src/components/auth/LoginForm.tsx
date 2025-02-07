import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonCard,
  IonCardContent,
  IonInput,
  IonItem,
  IonButton,
  IonCheckbox,
  IonText,
  IonLabel,
} from '@ionic/react';
import { authService } from '../../services/authService';

const LoginForm: React.FC = () => {
  const history = useHistory();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log("formData",formData);
      
      await authService.login(formData);
      history.push('/appointments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonCard className="ion-margin" style={{ borderRadius: '16px', backgroundColor: '#ffffff' }}>
      <IonCardContent>
        <div className="ion-text-center ion-margin-bottom">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Welcome Back Doctor</h1>
          <p style={{ color: '#666', marginTop: '8px' }}>Sign in to manage your appointments and patients</p>
        </div>

        <form onSubmit={handleSubmit}>
          <IonItem className="ion-margin-bottom">
            <IonInput
              label="Email *"
              type="email"
              value={formData.email}
              onIonChange={e => setFormData({ ...formData, email: e.detail.value || '' })}
              required
            />
          </IonItem>
          <IonItem className="ion-margin-bottom">
            <IonInput
              label="Password *"
              type="password"
              value={formData.password}
              onIonChange={e => setFormData({ ...formData, password: e.detail.value || '' })}
              required
            />
          </IonItem>
          <IonCheckbox
            className="ion-margin-bottom"
            labelPlacement="end"
            checked={formData.rememberMe}
            onIonChange={e => setFormData({ ...formData, rememberMe: e.detail.checked })}
          >Remember me</IonCheckbox >


          <div className="ion-text-end ion-margin-bottom">
            <IonText>
              <a href="/resetPassword">Forgot password?</a>
            </IonText>
          </div>

          <IonButton shape="round" expand="full" type="submit">
            Login
          </IonButton>

          <div className="ion-text-center ion-margin-top">
            <IonText>
              Don't have an account? <a href="/signup">Sign up now!</a>
            </IonText>
          </div>
        </form>
      </IonCardContent>
    </IonCard>
  );
};

export default LoginForm;