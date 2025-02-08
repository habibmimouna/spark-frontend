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
    IonCard,
    IonCardContent,
    IonToast,
    IonBackButton,
    IonButtons,
} from '@ionic/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';

const ResetPassword: React.FC = () => {
    const history = useHistory();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await AuthService.resetPassword(values.email);
                setResetSent(true);
                setToastMessage('Password reset instructions have been sent to your email');
                setShowToast(true);
            } catch (error: any) {
                setToastMessage(error.response?.data?.message || 'Failed to send reset instructions');
                setShowToast(true);
            }
        },
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/login" />
                    </IonButtons>
                    <IonTitle>Reset Password</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardContent>
                        {!resetSent ? (
                            <>
                                <p className="ion-text-center">
                                    Enter your email address and we'll send you instructions
                                    to reset your password.
                                </p>

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
                                        <div className="error-message">
                                            {formik.errors.email}
                                        </div>
                                    )}

                                    <IonButton
                                        expand="block"
                                        type="submit"
                                        className="ion-margin-top"
                                        disabled={!formik.isValid || formik.isSubmitting}
                                    >
                                        Send Reset Instructions
                                    </IonButton>
                                </form>
                            </>
                        ) : (
                            <div className="ion-text-center">
                                <h2>Check Your Email</h2>
                                <p>
                                    We've sent password reset instructions to {formik.values.email}.
                                    Please check your email and follow the instructions to reset your password.
                                </p>
                                <IonButton
                                    expand="block"
                                    onClick={() => history.push('/login')}
                                    className="ion-margin-top"
                                >
                                    Return to Login
                                </IonButton>
                            </div>
                        )}

                        <div className="ion-text-center ion-margin-top">
                            <IonButton
                                fill="clear"
                                routerLink="/login"
                            >
                                Back to Login
                            </IonButton>
                        </div>
                    </IonCardContent>
                </IonCard>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                    position="top"
                    color={resetSent ? 'success' : 'danger'}
                />
            </IonContent>
        </IonPage>
    );
};

export default ResetPassword;