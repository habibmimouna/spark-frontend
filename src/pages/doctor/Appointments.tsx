// src/pages/doctor/Appointments.tsx
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
    IonToast,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonButtons,
} from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import api from '../../services/api';
import DoctorMenu from '../../components/DoctorMenu';
import AppointmentCard from '../../components/AppointmentCard';

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
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Appointments</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={e => setSearchText(e.detail.value!)}
                        placeholder="Search patients..."
                        style={{ padding: '0 8px' }}
                    />
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
                                userType="doctor"
                                onStatusUpdate={handleStatusUpdate}
                            />
                        ))
                    )}
                </div>

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

export default DoctorAppointments;