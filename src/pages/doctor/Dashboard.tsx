// src/pages/doctor/Dashboard.tsx
import React, { useEffect, useState } from 'react';
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
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButton,
    IonIcon,
    IonMenuButton,
} from '@ionic/react';
import { calendar, people, time } from 'ionicons/icons';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import DoctorMenu from '../../components/DoctorMenu';

interface DashboardStats {
    totalPatients: number;
    todayAppointments: number;
    pendingAppointments: number;
}

const DoctorDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalPatients: 0,
        todayAppointments: 0,
        pendingAppointments: 0
    });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const history = useHistory();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [appointmentsRes, patientsRes] = await Promise.all([
                api.get('/appointments/doctor'),
                api.get('/patient')
            ]);

            const today = new Date().toISOString().split('T')[0];
            const todayAppointments = appointmentsRes.data.filter(
                (apt: any) => apt.time.split('T')[0] === today
            );

            const pendingAppointments = appointmentsRes.data.filter(
                (apt: any) => apt.status === 'Pending'
            );

            setStats({
                totalPatients: patientsRes.data.length,
                todayAppointments: todayAppointments.length,
                pendingAppointments: pendingAppointments.length
            });

            setRecentAppointments(appointmentsRes.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    return (
        <IonPage>
            <DoctorMenu />
            <IonHeader>
                <IonToolbar>
                    <IonMenuButton slot="start" />
                    <IonTitle>Dashboard</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                {/* Stats Cards */}
                <div className="ion-grid">
                    <IonCard>
                        <IonCardContent className="ion-text-center">
                            <IonIcon icon={people} color="primary" style={{ fontSize: '2em' }} />
                            <h2>{stats.totalPatients}</h2>
                            <p>Total Patients</p>
                        </IonCardContent>
                    </IonCard>

                    <IonCard>
                        <IonCardContent className="ion-text-center">
                            <IonIcon icon={calendar} color="success" style={{ fontSize: '2em' }} />
                            <h2>{stats.todayAppointments}</h2>
                            <p>Today's Appointments</p>
                        </IonCardContent>
                    </IonCard>

                    <IonCard>
                        <IonCardContent className="ion-text-center">
                            <IonIcon icon={time} color="warning" style={{ fontSize: '2em' }} />
                            <h2>{stats.pendingAppointments}</h2>
                            <p>Pending Appointments</p>
                        </IonCardContent>
                    </IonCard>
                </div>

                {/* Recent Appointments */}
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Recent Appointments</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            {recentAppointments.map((appointment: any) => (
                                <IonItem key={appointment._id}>
                                    <IonLabel>
                                        <h2>{appointment.patient.firstName} {appointment.patient.lastName}</h2>
                                        <p>{new Date(appointment.time).toLocaleString()}</p>
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
                            onClick={() => history.push('/doctor/appointments')}
                            className="ion-margin-top"
                        >
                            View All Appointments
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default DoctorDashboard;