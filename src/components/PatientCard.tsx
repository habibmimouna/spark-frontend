import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { call, mail, person, time, location } from 'ionicons/icons';
import moment from 'moment';
import { Patient } from '../types';

interface PatientCardProps {
    patient: Patient;
    onClick: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
    const cardStyle = {
        margin: '10px 0',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #eee'
    };

    const nameStyle = {
        margin: '0',
        fontSize: '1.3rem',
        fontWeight: '600',
        color: '#2c3e50'
    };

    const infoGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
    };

    const infoItemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#666'
    };

    const iconStyle = {
        color: 'var(--ion-color-primary)',
        fontSize: '1.2rem'
    };

    return (
        <IonCard
            style={cardStyle}
            onClick={onClick}
            className="ion-activatable ripple-parent"
        >
            <IonCardContent>
                <div style={headerStyle}>
                    <h2 style={nameStyle}>
                        {patient.firstName} {patient.lastName}
                    </h2>
                    <div style={{
                        padding: '4px 12px',
                        borderRadius: '16px',
                        backgroundColor: patient.gender === 'male' ? '#e8f4fd' : '#fce8fd',
                        color: patient.gender === 'male' ? '#1e88e5' : '#e91e63',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <IonIcon icon={person} />
                        {patient.gender}
                    </div>
                </div>

                <div style={infoGridStyle}>
                    <div style={infoItemStyle}>
                        <IonIcon icon={time} style={iconStyle} />
                        <span>{moment(patient.dateOfBirth).format('MMM D, YYYY')}</span>
                    </div>

                    <div style={infoItemStyle}>
                        <IonIcon icon={call} style={iconStyle} />
                        <span>{patient.phoneNumber}</span>
                    </div>

                    <div style={infoItemStyle}>
                        <IonIcon icon={mail} style={iconStyle} />
                        <span>{patient.email}</span>
                    </div>

                    <div style={infoItemStyle}>
                        <IonIcon icon={location} style={iconStyle} />
                        <span>{patient.address.split(',')[0]}</span>
                    </div>
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default PatientCard;