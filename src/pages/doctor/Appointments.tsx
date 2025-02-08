// src/pages/doctor/Appointments.tsx
import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonMenuButton,
    IonCard,
    IonCardContent,
    IonAlert,
    IonToast,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import api from '../../services/api';
import DoctorMenu from '../../components/DoctorMenu';
import moment from 'moment';

interface Appointment {
    _id: string;
    patient: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    };
    time: string;
    treatment: string;
    duration: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    notes?: string;
}

const DoctorAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
    const [searchText, setSearchText] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments/doctor');
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

    const handleStatusUpdate = async (appointmentId: string, newStatus: 'Accepted' | 'Rejected') => {
        try {
            await api.patch(`/appointments/${appointmentId}/status`, { status: newStatus });
            setAppointments(appointments.map(apt =>
                apt._id === appointmentId ? { ...apt, status: newStatus } : apt
            ));
            setToastMessage(`Appointment ${newStatus.toLowerCase()} successfully`);
            setShowToast(true);
        } catch (error) {
            console.error('Error updating appointment status:', error);
            setToastMessage('Failed to update appointment status');
            setShowToast(true);
        }
    };

    const filteredAppointments = appointments
        .filter(apt => filter === 'all' || apt.status.toLowerCase() === filter)
        .filter(apt =>
            searchText === '' ||
            `${apt.patient.firstName} ${apt.patient.lastName}`.toLowerCase().includes(searchText.toLowerCase())
        )
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    return (
        <IonPage>
            <DoctorMenu />
            <IonHeader>
                <IonToolbar>
                    <IonMenuButton slot="start" />
                    <IonTitle>Appointments</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <div className="ion-padding">
                    <IonSearchbar
                        value={searchText}
                        onIonChange={e => setSearchText(e.detail.value!)}
                        placeholder="Search patients..."
                    />

                    <IonSegment value={filter} onIonChange={e => setFilter(e.detail.value as any)}>
                        <IonSegmentButton value="all">
                            <IonLabel>All</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="pending">
                            <IonLabel>Pending</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="accepted">
                            <IonLabel>Accepted</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="rejected">
                            <IonLabel>Rejected</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    <IonList>
                        {filteredAppointments.map(appointment => (
                            <IonCard key={appointment._id}>
                                <IonCardContent>
                                    <h2 className="ion-no-margin">
                                        {appointment.patient.firstName} {appointment.patient.lastName}
                                    </h2>
                                    <p className="ion-no-margin">
                                        {moment(appointment.time).format('MMMM Do YYYY, h:mm a')}
                                    </p>
                                    <p>Treatment: {appointment.treatment}</p>
                                    <p>Duration: {appointment.duration}</p>
                                    <p>Phone: {appointment.patient.phoneNumber}</p>

                                    <div className="ion-text-right">
                                        <IonBadge color={
                                            appointment.status === 'Accepted' ? 'success' :
                                                appointment.status === 'Pending' ? 'warning' : 'danger'
                                        }>
                                            {appointment.status}
                                        </IonBadge>
                                    </div>

                                    {appointment.status === 'Pending' && (
                                        <div className="ion-text-right ion-margin-top">
                                            <IonButton
                                                color="success"
                                                size="small"
                                                onClick={() => handleStatusUpdate(appointment._id, 'Accepted')}
                                            >
                                                Accept
                                            </IonButton>
                                            <IonButton
                                                color="danger"
                                                size="small"
                                                onClick={() => handleStatusUpdate(appointment._id, 'Rejected')}
                                            >
                                                Reject
                                            </IonButton>
                                        </div>
                                    )}
                                </IonCardContent>
                            </IonCard>
                        ))}
                    </IonList>
                </div>

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

export default DoctorAppointments;