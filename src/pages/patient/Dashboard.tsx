// src/pages/patient/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonMenuButton,
    IonFab,
    IonFabButton,
    IonModal,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToast,
} from '@ionic/react';
import { add, calendar, time } from 'ionicons/icons';
import moment from 'moment';
import api from '../../services/api';
import PatientMenu from '../../components/PatientMenu';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface Appointment {
    _id: string;
    time: string;
    treatment: string;
    duration: string;
    status: string;
    doctor: {
        firstName: string;
        lastName: string;
        medicalSpecialty: string;
    };
}

const PatientDashboard: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments/patient');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setToastMessage('Failed to load appointments');
            setShowToast(true);
        }
    };

    const formik = useFormik({
        initialValues: {
            time: new Date().toISOString(),
            treatment: '',
            duration: '30',
            notes: '',
        },
        validationSchema: Yup.object({
            time: Yup.string().required('Required'),
            treatment: Yup.string().required('Required'),
            duration: Yup.string().required('Required'),
            notes: Yup.string(),
        }),
        onSubmit: async (values:any) => {
            try {
                console.log("ssss");
                
                let currentUser = localStorage.getItem('user')
                let parseduser;
                if (currentUser) {
                    parseduser = JSON.parse(currentUser)
                }
                console.log("ffff", parseduser);
                await api.post('/appointments/book', { ...values, doctorId: parseduser.assignedDoctor });
                setShowModal(false);
                fetchAppointments();
                setToastMessage('Appointment booked successfully');
                setShowToast(true);
                formik.resetForm();
            } catch (error) {
                console.error('Error booking appointment:', error);
                setToastMessage('Failed to book appointment');
                setShowToast(true);
            }
        },
    });

    return (
        <IonPage>
            <PatientMenu />
            <IonHeader>
                <IonToolbar>
                    <IonMenuButton slot="start" />
                    <IonTitle>Dashboard</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                {/* Upcoming Appointments */}
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Upcoming Appointments</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            {appointments
                                .filter(apt => new Date(apt.time) >= new Date())
                                .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
                                .slice(0, 5)
                                .map(appointment => (
                                    <IonItem key={appointment._id}>
                                        <IonLabel>
                                            <h2>Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</h2>
                                            <p>{appointment.doctor.medicalSpecialty}</p>
                                            <p>{moment(appointment.time).format('MMMM Do YYYY, h:mm a')}</p>
                                        </IonLabel>
                                        <IonBadge color={
                                            appointment.status === 'Accepted' ? 'success' :
                                                appointment.status === 'Pending' ? 'warning' : 'danger'
                                        }>
                                            {appointment.status}
                                        </IonBadge>
                                    </IonItem>
                                ))}
                        </IonList>
                        <IonButton
                            expand="block"
                            routerLink="/patient/appointments"
                            className="ion-margin-top"
                        >
                            View All Appointments
                        </IonButton>
                    </IonCardContent>
                </IonCard>

                {/* Book Appointment FAB */}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => setShowModal(true)}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>

                {/* Book Appointment Modal */}
                <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Book Appointment</IonTitle>
                            <IonButton
                                slot="end"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <form onSubmit={formik.handleSubmit}>
                            <IonItem>
                                <IonLabel position="stacked">Date & Time</IonLabel>
                                <IonDatetime
                                    name="time"
                                    value={formik.values.time}
                                    onIonChange={(e) => formik.setFieldValue('time', e.detail.value)}
                                    min={new Date().toISOString()}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Treatment</IonLabel>
                                <IonSelect
                                    name="treatment"
                                    value={formik.values.treatment}
                                    onIonChange={(e) => formik.setFieldValue('treatment', e.detail.value)}
                                >
                                    <IonSelectOption value="Consultation">Consultation</IonSelectOption>
                                    <IonSelectOption value="Follow-up">Follow-up</IonSelectOption>
                                    <IonSelectOption value="Check-up">Check-up</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Duration (minutes)</IonLabel>
                                <IonSelect
                                    name="duration"
                                    value={formik.values.duration}
                                    onIonChange={(e) => formik.setFieldValue('duration', e.detail.value)}
                                >
                                    <IonSelectOption value="30">30 minutes</IonSelectOption>
                                    <IonSelectOption value="45">45 minutes</IonSelectOption>
                                    <IonSelectOption value="60">60 minutes</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Notes</IonLabel>
                                <IonTextarea
                                    name="notes"
                                    value={formik.values.notes}
                                    onIonChange={(e) => formik.setFieldValue('notes', e.detail.value)}
                                />
                            </IonItem>

                            <IonButton
                                expand="block"
                                type="submit"
                                className="ion-margin-top"
                            >
                                Book Appointment
                            </IonButton>
                        </form>
                    </IonContent>
                </IonModal>

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

export default PatientDashboard;