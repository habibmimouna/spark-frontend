// src/pages/patient/Profile.tsx
import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonMenuButton,
    IonToast,
    IonTextarea,
    IonLoading,
    IonText
} from '@ionic/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import PatientMenu from '../../components/PatientMenu';

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    medicalHistory: string;
    dateOfBirth: string;
    gender: string;
}

const PatientProfile: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const validationSchema = Yup.object({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        phoneNumber: Yup.string().required('Required'),
        address: Yup.string().required('Required'),
        medicalHistory: Yup.string(),
        dateOfBirth: Yup.string().required('Required'),
        gender: Yup.string().required('Required'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            address: '',
            medicalHistory: '',
            dateOfBirth: '',
            gender: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await api.put(`/patient/${values._id}`, values);
                setToastMessage('Profile updated successfully');
                setShowToast(true);
            } catch (error) {
                console.error('Error updating profile:', error);
                setToastMessage('Failed to update profile');
                setShowToast(true);
            }
        },
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/patient/profile');
            formik.setValues(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setToastMessage('Failed to load profile');
            setShowToast(true);
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <PatientMenu />
            <IonHeader>
                <IonToolbar>
                    <IonMenuButton slot="start" />
                    <IonTitle>My Profile</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonLoading isOpen={loading} message="Loading profile..." />

                <form onSubmit={formik.handleSubmit}>
                    <IonCard>
                        <IonCardContent>
                            <IonItem>
                                <IonLabel position="floating">First Name</IonLabel>
                                <IonInput
                                    name="firstName"
                                    value={formik.values.firstName}
                                    onIonChange={formik.handleChange}
                                />
                            </IonItem>
                            {formik.touched.firstName && formik.errors.firstName && (
                                <div className="ion-padding-start ion-padding-top">
                                    <IonText color="danger">{formik.errors.firstName}</IonText>
                                </div>
                            )}

                            <IonItem>
                                <IonLabel position="floating">Last Name</IonLabel>
                                <IonInput
                                    name="lastName"
                                    value={formik.values.lastName}
                                    onIonChange={formik.handleChange}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Email</IonLabel>
                                <IonInput
                                    name="email"
                                    type="email"
                                    value={formik.values.email}
                                    onIonChange={formik.handleChange}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Phone Number</IonLabel>
                                <IonInput
                                    name="phoneNumber"
                                    type="tel"
                                    value={formik.values.phoneNumber}
                                    onIonChange={formik.handleChange}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Address</IonLabel>
                                <IonTextarea
                                    name="address"
                                    value={formik.values.address}
                                    onIonChange={formik.handleChange}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Medical History</IonLabel>
                                <IonTextarea
                                    name="medicalHistory"
                                    value={formik.values.medicalHistory}
                                    onIonChange={formik.handleChange}
                                />
                            </IonItem>

                            <IonButton
                                expand="block"
                                type="submit"
                                className="ion-margin-top"
                            >
                                Update Profile
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                </form>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                />
            </IonContent>
        </IonPage>
    );
};

export default PatientProfile;