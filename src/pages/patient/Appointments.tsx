import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonMenuButton,
    IonRefresher,
    IonRefresherContent,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonModal,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToast,
    IonItem,
    IonButtons,
} from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import { add } from 'ionicons/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import PatientMenu from '../../components/PatientMenu';
import AppointmentCard from '../../components/AppointmentCard';

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
    notes?: string;
}

const PatientAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
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

    const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
        await fetchAppointments();
        event.detail.complete();
    };

    const formik = useFormik({
        initialValues: {
            time: new Date().toISOString(),
            treatment: '',
            duration: '30',
            notes: '',
            doctorId: '',
        },
        validationSchema: Yup.object({
            time: Yup.string().required('Required'),
            treatment: Yup.string().required('Required'),
            duration: Yup.string().required('Required'),
            notes: Yup.string(),
            doctorId: Yup.string(),
        }),
        onSubmit: async (values) => {
            try {
                let currentUser = localStorage.getItem('user')
                let parseduser;
                if (currentUser) {
                    parseduser = JSON.parse(currentUser)
                }
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

    const filteredAppointments = appointments
        .filter(apt => {
            const appointmentDate = new Date(apt.time);
            const now = new Date();

            if (filter === 'upcoming') {
                return appointmentDate >= now;
            } else if (filter === 'past') {
                return appointmentDate < now;
            }
            return true;
        })
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    return (
        <IonPage>
            <PatientMenu />
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>My Appointments</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSegment 
                        value={filter} 
                        onIonChange={e => setFilter(e.detail.value as any)}
                        style={{ padding: '0 8px' }}
                    >
                        <IonSegmentButton value="all">
                            <IonLabel>All</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="upcoming">
                            <IonLabel>Upcoming</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="past">
                            <IonLabel>Past</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <div style={{ 
                    padding: '16px', 
                    maxWidth: '800px', 
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px' 
                }}>
                    {filteredAppointments.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '32px',
                            color: '#666'
                        }}>
                            No appointments found
                        </div>
                    ) : (
                        filteredAppointments.map(appointment => (
                            <AppointmentCard
                                key={appointment._id}
                                appointment={appointment}
                                userType="patient"
                            />
                        ))
                    )}
                </div>

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
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowModal(false)}>
                                    Close
                                </IonButton>
                            </IonButtons>
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
                                    <IonSelectOption value="Treatment">Treatment</IonSelectOption>
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
                                    placeholder="Add any additional notes or concerns..."
                                />
                            </IonItem>

                            <div className="ion-padding">
                                <IonButton
                                    expand="block"
                                    type="submit"
                                    disabled={!formik.isValid || formik.isSubmitting}
                                >
                                    Book Appointment
                                </IonButton>
                            </div>
                        </form>
                    </IonContent>
                </IonModal>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                    position="top"
                    color="dark"
                    style={{ borderRadius: '8px' }}
                />
            </IonContent>
        </IonPage>
    );
};

export default PatientAppointments;