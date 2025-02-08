// src/pages/doctor/Patients.tsx
import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonModal,
    IonTextarea,
    IonToast,
    IonBadge,
    IonMenuButton,
    IonButtons,
    IonSelect,
    IonSelectOption,
} from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import { call, mail, person, time } from 'ionicons/icons';
import api from '../../services/api';
import { Patient } from '../../types';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import moment from 'moment';

const DoctorPatients: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'recent'>('name');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setToastMessage('Failed to load patients');
            setShowToast(true);
        }
    };

    const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
        await fetchPatients();
        event.detail.complete();
    };

    const handlePatientClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
    };

    const updatePatientNotes = async (patientId: string, notes: string) => {
        try {
            await api.patch(`/patients/${patientId}/notes`, { notes });
            setToastMessage('Patient notes updated successfully');
            setShowToast(true);
            fetchPatients();
        } catch (error) {
            console.error('Error updating patient notes:', error);
            setToastMessage('Failed to update patient notes');
            setShowToast(true);
        }
    };

    const filteredPatients = patients
        .filter(patient =>
            searchText === '' ||
            `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchText.toLowerCase()) ||
            patient.phoneNumber.includes(searchText)
        )
        .sort((a, b) => {
            if (sortBy === 'name') {
                return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
            } else {
                // Sort by most recent appointment
                return 0; // You would need to implement this based on your data structure
            }
        });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Patients</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <div className="ion-padding-bottom">
                    <IonSearchbar
                        value={searchText}
                        onIonChange={e => setSearchText(e.detail.value!)}
                        placeholder="Search patients..."
                    />

                    <div className="ion-text-end">
                        <IonSelect
                            value={sortBy}
                            onIonChange={e => setSortBy(e.detail.value)}
                            interface="popover"
                        >
                            <IonSelectOption value="name">Sort by Name</IonSelectOption>
                            <IonSelectOption value="recent">Sort by Recent</IonSelectOption>
                        </IonSelect>
                    </div>
                </div>

                <IonList>
                    {filteredPatients.map(patient => (
                        <IonCard key={patient.id} onClick={() => handlePatientClick(patient)}>
                            <IonCardContent>
                                <div className="ion-justify-content-between ion-align-items-center">
                                    <h2 className="ion-no-margin">
                                        {patient.firstName} {patient.lastName}
                                    </h2>
                                    <p className="ion-no-margin">
                                        <IonIcon icon={person} /> {patient.gender}
                                    </p>
                                    <p className="ion-no-margin">
                                        <IonIcon icon={time} /> {moment(patient.dateOfBirth).format('MMMM D, YYYY')}
                                    </p>
                                    <p className="ion-no-margin">
                                        <IonIcon icon={call} /> {patient.phoneNumber}
                                    </p>
                                    <p className="ion-no-margin">
                                        <IonIcon icon={mail} /> {patient.email}
                                    </p>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    ))}
                </IonList>

                {/* Patient Details Modal */}
                <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                    {selectedPatient && (
                        <>
                            <IonHeader>
                                <IonToolbar>
                                    <IonTitle>
                                        {selectedPatient.firstName} {selectedPatient.lastName}
                                    </IonTitle>
                                    <IonButtons slot="end">
                                        <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
                                    </IonButtons>
                                </IonToolbar>
                            </IonHeader>

                            <IonContent className="ion-padding">
                                <IonList>
                                    <IonItem>
                                        <IonLabel>
                                            <h2>Contact Information</h2>
                                            <p>Phone: {selectedPatient.phoneNumber}</p>
                                            <p>Email: {selectedPatient.email}</p>
                                            <p>Address: {selectedPatient.address}</p>
                                        </IonLabel>
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel>
                                            <h2>Personal Information</h2>
                                            <p>Date of Birth: {moment(selectedPatient.dateOfBirth).format('MMMM D, YYYY')}</p>
                                            <p>Gender: {selectedPatient.gender}</p>
                                        </IonLabel>
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel>
                                            <h2>Medical History</h2>
                                            <p>{selectedPatient.medicalHistory}</p>
                                        </IonLabel>
                                    </IonItem>
                                </IonList>

                                <IonButton
                                    expand="block"
                                    routerLink={`/doctor/appointments?patientId=${selectedPatient.id}`}
                                    className="ion-margin-top"
                                >
                                    View Appointments
                                </IonButton>
                            </IonContent>
                        </>
                    )}
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

export default DoctorPatients;