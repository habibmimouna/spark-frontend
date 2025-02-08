import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonModal,
    IonTextarea,
    IonToast,
    IonMenuButton,
    IonButtons,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonFab,
    IonFabButton,
    IonInput,
} from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import { add, call, mail, person, time } from 'ionicons/icons';
import api from '../../services/api';
import { Patient } from '../../types';
import moment from 'moment';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { User } from '../../types/index'
import PatientCard from '../../components/PatientCard';


const DoctorPatients: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'recent'>('name');
    const [doctor, setDoctor] = useState<User>()

    useEffect(() => {

        const userString = localStorage.getItem('user');
        if (userString) {
            const userObject = JSON.parse(userString);

            setDoctor(userObject)

        } else {
            console.log('No user data found in localStorage');
        }


        fetchPatients();
    }, []);

    const validationSchema = Yup.object({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        dateOfBirth: Yup.string().required('Required'),
        gender: Yup.string().required('Required'),
        phoneNumber: Yup.string().required('Required'),
        address: Yup.string().required('Required'),
        medicalHistory: Yup.string(),
        assignedDoctor: Yup.string()
    });

    const createPatientForm = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            dateOfBirth: new Date().toISOString(),
            gender: '',
            phoneNumber: '',
            address: '',
            medicalHistory: '',
            assignedDoctor: doctor?.id,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {

                await api.post('/patient', { ...values, assignedDoctor: doctor?.id });
                setToastMessage('Patient created successfully');
                setShowToast(true);
                setShowCreateModal(false);
                createPatientForm.resetForm();
                fetchPatients();
            } catch (error) {
                console.error('Error creating patient:', error);
                setToastMessage('Failed to create patient');
                setShowToast(true);
            }
        },
    });

    const fetchPatients = async () => {
        try {

            const response = await api.get('/patient');
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

                return 0;
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
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '16px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <IonInput
                            placeholder="Search patients..."
                            value={searchText}
                            onIonChange={e => setSearchText(e.detail.value!)}
                            style={{
                                '--background': '#f4f5f8',
                                '--padding-start': '16px',
                                '--padding-end': '16px',
                                '--border-radius': '8px',
                            }}
                        />
                        <IonSelect
                            value={sortBy}
                            onIonChange={e => setSortBy(e.detail.value)}
                            interface="popover"
                            style={{
                                minWidth: '120px',
                            }}
                        >
                            <IonSelectOption value="name">Sort by Name</IonSelectOption>
                            <IonSelectOption value="recent">Sort by Recent</IonSelectOption>
                        </IonSelect>
                    </div>

                    {filteredPatients.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#666',
                            backgroundColor: '#f4f5f8',
                            borderRadius: '12px',
                            margin: '20px 0'
                        }}>
                            <IonIcon
                                icon={person}
                                style={{
                                    fontSize: '48px',
                                    color: '#999',
                                    marginBottom: '16px'
                                }}
                            />
                            <p style={{ margin: '0' }}>No patients found</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gap: '16px',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                        }}>
                            {filteredPatients.map(patient => (
                                <PatientCard
                                    key={patient._id}
                                    patient={patient}
                                    onClick={() => handlePatientClick(patient)}
                                />
                            ))}
                        </div>
                    )}
                </div>


                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => setShowCreateModal(true)}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>

                <IonModal isOpen={showCreateModal} onDidDismiss={() => setShowCreateModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Create New Patient</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowCreateModal(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent className="ion-padding">
                        <form onSubmit={createPatientForm.handleSubmit}>
                            <IonItem>
                                <IonLabel position="stacked">First Name</IonLabel>
                                <IonInput
                                    name="firstName"
                                    value={createPatientForm.values.firstName}
                                    onIonChange={createPatientForm.handleChange}
                                />
                            </IonItem>
                            {createPatientForm.touched.firstName && createPatientForm.errors.firstName && (
                                <div className="error-message">{createPatientForm.errors.firstName}</div>
                            )}

                            <IonItem>
                                <IonLabel position="stacked">Last Name</IonLabel>
                                <IonInput
                                    name="lastName"
                                    value={createPatientForm.values.lastName}
                                    onIonChange={createPatientForm.handleChange}
                                />
                            </IonItem>
                            {createPatientForm.touched.lastName && createPatientForm.errors.lastName && (
                                <div className="error-message">{createPatientForm.errors.lastName}</div>
                            )}

                            <IonItem>
                                <IonLabel position="stacked">Email</IonLabel>
                                <IonInput
                                    type="email"
                                    name="email"
                                    value={createPatientForm.values.email}
                                    onIonChange={createPatientForm.handleChange}
                                />
                            </IonItem>
                            {createPatientForm.touched.email && createPatientForm.errors.email && (
                                <div className="error-message">{createPatientForm.errors.email}</div>
                            )}

                            <IonItem>
                                <IonLabel position="stacked">Date of Birth</IonLabel>
                                <IonDatetime
                                    name="dateOfBirth"
                                    value={createPatientForm.values.dateOfBirth}
                                    onIonChange={(e) => createPatientForm.setFieldValue('dateOfBirth', e.detail.value)}
                                    max={new Date().toISOString()}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Gender</IonLabel>
                                <IonSelect
                                    name="gender"
                                    value={createPatientForm.values.gender}
                                    onIonChange={(e) => createPatientForm.setFieldValue('gender', e.detail.value)}
                                >
                                    <IonSelectOption value="male">Male</IonSelectOption>
                                    <IonSelectOption value="female">Female</IonSelectOption>
                                    <IonSelectOption value="other">Other</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Phone Number</IonLabel>
                                <IonInput
                                    type="tel"
                                    name="phoneNumber"
                                    value={createPatientForm.values.phoneNumber}
                                    onIonChange={createPatientForm.handleChange}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Address</IonLabel>
                                <IonTextarea
                                    name="address"
                                    value={createPatientForm.values.address}
                                    onIonChange={createPatientForm.handleChange}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Medical History</IonLabel>
                                <IonTextarea
                                    name="medicalHistory"
                                    value={createPatientForm.values.medicalHistory}
                                    onIonChange={createPatientForm.handleChange}
                                />
                            </IonItem>

                            <IonButton
                                expand="block"
                                type="submit"
                                className="ion-margin-top"
                                disabled={!createPatientForm.isValid || createPatientForm.isSubmitting}
                            >
                                Create Patient
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

export default DoctorPatients;