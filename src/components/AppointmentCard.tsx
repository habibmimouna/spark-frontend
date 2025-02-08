// src/components/AppointmentCard.tsx
import React from 'react';
import {
    IonCard,
    IonCardContent,
    IonBadge,
    IonButton,
} from '@ionic/react';
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

    return (
        <IonCard>
            <IonCardContent>
                {userType === 'doctor' && appointment.patient && (
                    <>
                        <h2 className="ion-no-margin">
                            {appointment.patient.firstName} {appointment.patient.lastName}
                        </h2>
                        <p>Phone: {appointment.patient.phoneNumber}</p>
                    </>
                )}

                {userType === 'patient' && appointment.doctor && (
                    <>
                        <h2 className="ion-no-margin">
                            Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                        </h2>
                        <p>{appointment.doctor.medicalSpecialty}</p>
                    </>
                )}

                <p>{moment(appointment.time).format('MMMM Do YYYY, h:mm a')}</p>
                <p>Treatment: {appointment.treatment}</p>
                <p>Duration: {appointment.duration} minutes</p>
                {appointment.notes && <p>Notes: {appointment.notes}</p>}

                <div className="ion-text-right">
                    <IonBadge color={getStatusColor(appointment.status)}>
                        {appointment.status}
                    </IonBadge>
                </div>

                {userType === 'doctor' &&
                    appointment.status === 'Pending' &&
                    onStatusUpdate && (
                        <div className="ion-text-right ion-margin-top">
                            <IonButton
                                color="success"
                                size="small"
                                onClick={() => onStatusUpdate(appointment._id, 'Accepted')}
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