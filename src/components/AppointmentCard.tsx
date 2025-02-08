// src/components/AppointmentCard.tsx
import React from 'react';
import {
    IonCard,
    IonCardContent,
    IonBadge,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
} from '@ionic/react';
import { 
    time, 
    medkit, 
    timer, 
    newspaper, 
    call,
    person 
} from 'ionicons/icons';
import moment from 'moment';

interface AppointmentCardProps {
    appointment: {
        _id: string;
        time: string;
        treatment: string;
        duration: string;
        status: string;
        notes?: string;
        doctor?: {
            firstName: string;
            lastName: string;
            medicalSpecialty: string;
        };
        patient?: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
        };
    };
    userType: 'doctor' | 'patient';
    onStatusUpdate?: (id: string, status: 'Accepted' | 'Rejected') => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
    appointment,
    userType,
    onStatusUpdate
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'success';
            case 'Pending':
                return 'warning';
            case 'Rejected':
                return 'danger';
            default:
                return 'medium';
        }
    };

    const cardStyle = {
        borderRadius: '12px',
        margin: '10px 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    };

    const headerStyle = {
        borderBottom: '1px solid #eee',
        paddingBottom: '12px',
        marginBottom: '12px',
        position: 'relative' as const
    };

    const nameStyle = {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        margin: '0',
        color: '#333'
    };

    const detailStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px'
    };

    const iconStyle = {
        marginRight: '8px',
        color: 'var(--ion-color-primary)',
        fontSize: '1.2rem'
    };

    return (
        <IonCard style={cardStyle}>
            <IonCardContent>
                <div style={headerStyle}>
                    {userType === 'doctor' && appointment.patient && (
                        <div>
                            <h2 style={nameStyle}>
                                {appointment.patient.firstName} {appointment.patient.lastName}
                            </h2>
                            <div style={detailStyle}>
                                <IonIcon icon={call} style={iconStyle} />
                                <span>{appointment.patient.phoneNumber}</span>
                            </div>
                        </div>
                    )}

                    {userType === 'patient' && appointment.doctor && (
                        <div>
                            <h2 style={nameStyle}>
                                Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                            </h2>
                            <div style={detailStyle}>
                                <IonIcon icon={person} style={iconStyle} />
                                <span>{appointment.doctor.medicalSpecialty}</span>
                            </div>
                        </div>
                    )}

                    <div style={{ position: 'absolute', top: '0', right: '0' }}>
                        <IonBadge 
                            color={getStatusColor(appointment.status)}
                            style={{ padding: '8px 12px', borderRadius: '16px' }}
                        >
                            {appointment.status}
                        </IonBadge>
                    </div>
                </div>

                <IonGrid>
                    <IonRow>
                        <IonCol size="12" size-md="6">
                            <div style={detailStyle}>
                                <IonIcon icon={time} style={iconStyle} />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Date & Time</div>
                                    <div>{moment(appointment.time).format('MMMM Do YYYY, h:mm a')}</div>
                                </div>
                            </div>
                        </IonCol>
                        <IonCol size="12" size-md="6">
                            <div style={detailStyle}>
                                <IonIcon icon={medkit} style={iconStyle} />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Treatment</div>
                                    <div>{appointment.treatment}</div>
                                </div>
                            </div>
                        </IonCol>
                        <IonCol size="12" size-md="6">
                            <div style={detailStyle}>
                                <IonIcon icon={timer} style={iconStyle} />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Duration</div>
                                    <div>{appointment.duration} minutes</div>
                                </div>
                            </div>
                        </IonCol>
                        {appointment.notes && (
                            <IonCol size="12" size-md="6">
                                <div style={detailStyle}>
                                    <IonIcon icon={newspaper} style={iconStyle} />
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Notes</div>
                                        <div>{appointment.notes}</div>
                                    </div>
                                </div>
                            </IonCol>
                        )}
                    </IonRow>
                </IonGrid>

                {userType === 'doctor' &&
                    appointment.status === 'Pending' &&
                    onStatusUpdate && (
                        <div className="ion-text-right ion-padding-top" 
                             style={{ borderTop: '1px solid #eee', marginTop: '12px' }}>
                            <IonButton
                                color="success"
                                size="small"
                                onClick={() => onStatusUpdate(appointment._id, 'Accepted')}
                                style={{ marginRight: '8px' }}
                            >
                                Accept
                            </IonButton>
                            <IonButton
                                color="danger"
                                size="small"
                                onClick={() => onStatusUpdate(appointment._id, 'Rejected')}
                            >
                                Reject
                            </IonButton>
                        </div>
                    )}
            </IonCardContent>
        </IonCard>
    );
};

export default AppointmentCard;