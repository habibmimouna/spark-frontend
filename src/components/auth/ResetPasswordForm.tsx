import React, { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonInput,
  IonItem,
  IonButton,
  IonText,
} from '@ionic/react';
import { authService } from '../../services/authService';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authService.resetPassword(email);
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset password failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonCard className="ion-margin" style={{ borderRadius: '16px', backgroundColor: '#ffffff' }}>
      <IonCardContent>
        <div className="ion-text-center ion-margin-bottom">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Reset Your Password</h1>
          <p style={{ color: '#666', marginTop: '8px' }}>Enter your email to receive reset instructions</p>
        </div>

        <form onSubmit={handleSubmit}>
          <IonItem className="ion-margin-bottom">
            <IonInput
              label="Email *"
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value || '')}
              required
              disabled={loading}
            />
          </IonItem>

          {error && (
            <IonText color="danger" className="ion-text-center">
              <p className="ion-margin-bottom">{error}</p>
            </IonText>
          )}

          {message && (
            <IonText color="success" className="ion-text-center">
              <p className="ion-margin-bottom">{message}</p>
            </IonText>
          )}

          <IonButton
            shape="round"
            expand="full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </IonButton>

          <div className="ion-text-center ion-margin-top">
            <IonText>
              <a href="/login">Back to Login</a>
            </IonText>
          </div>
        </form>
      </IonCardContent>
    </IonCard>
  );
};

export default ResetPasswordForm;