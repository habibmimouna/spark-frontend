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
    IonAlert,
} from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import { add, call, mail, person, time, trash, pencil } from 'ionicons/icons';
import api from '../../services/api';
import { Patient } from '../../types';
import moment from 'moment';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { User } from '../../types/index';
import PatientCard from '../../components/PatientCard';

const DoctorPatients: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'recent'>('name');
    const [doctor, setDoctor] = useState<User>();
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
    const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const userObject = JSON.parse(userString);
            setDoctor(userObject);
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

    const editPatientForm = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            dateOfBirth: new Date().toISOString(),
            gender: '',
            phoneNumber: '',
            address: '',
            medicalHistory: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            if (!patientToEdit) return;
            
            try {
                await api.put(`/patient/${patientToEdit._id}`, values);
                setToastMessage('Patient updated successfully');
                setShowToast(true);
                setShowEditModal(false);
                fetchPatients();
            } catch (error) {
                console.error('Error updating patient:', error);
                setToastMessage('Failed to update patient');
                setShowToast(true);
            }
        },
    });

    const handlePatientClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
    };

    const PatientDetailsModal = () => {
        if (!selectedPatient) return null;

        return (
            <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Patient Details</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <div className="ion-padding-bottom">
                        <h2 style={{ margin: '0 0 16px' }}>
                            {selectedPatient.firstName} {selectedPatient.lastName}
                        </h2>

                        <IonItem lines="none">
                            <IonIcon icon={mail} slot="start" />
                            <IonLabel>
                                <h3>Email</h3>
                                <p>{selectedPatient.email}</p>
                            </IonLabel>
                        </IonItem>

                        <IonItem lines="none">
                            <IonIcon icon={call} slot="start" />
                            <IonLabel>
                                <h3>Phone</h3>
                                <p>{selectedPatient.phoneNumber}</p>
                            </IonLabel>
                        </IonItem>

                        <IonItem lines="none">
                            <IonIcon icon={person} slot="start" />
                            <IonLabel>
                                <h3>Gender</h3>
                                <p>{selectedPatient.gender}</p>
                            </IonLabel>
                        </IonItem>

                        <IonItem lines="none">
                            <IonIcon icon={time} slot="start" />
                            <IonLabel>
                                <h3>Date of Birth</h3>
                                <p>{moment(selectedPatient.dateOfBirth).format('MMMM D, YYYY')}</p>
                            </IonLabel>
                        </IonItem>

                        <IonItem lines="none">
                            <IonLabel>
                                <h3>Address</h3>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedPatient.address}</p>
                            </IonLabel>
                        </IonItem>

                        <IonItem lines="none">
                            <IonLabel>
                                <h3>Medical History</h3>
                                <p style={{ whiteSpace: 'pre-wrap' }}>
                                    {selectedPatient.medicalHistory || 'No medical history recorded.'}
                                </p>
                            </IonLabel>
                        </IonItem>
                    </div>

                    <div className="ion-padding" style={{ display: 'flex', gap: '8px' }}>
                        <IonButton
                            expand="block"
                            onClick={(e) => {
                                setShowModal(false);
                                handleEditClick(selectedPatient, e);
                            }}
                        >
                            Edit Patient
                        </IonButton>
                        <IonButton
                            expand="block"
                            color="danger"
                            onClick={(e) => {
                                setShowModal(false);
                                handleDeleteClick(selectedPatient, e);
                            }}
                        >
                            Delete Patient
                        </IonButton>
                    </div>
                </IonContent>
            </IonModal>
        );
    };

    const handleEditClick = (patient: Patient, event: React.MouseEvent) => {
        event.stopPropagation();
        setPatientToEdit(patient);
        editPatientForm.setValues({
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            dateOfBirth: patient.dateOfBirth,
            gender: patient.gender,
            phoneNumber: patient.phoneNumber,
            address: patient.address,
            medicalHistory: patient.medicalHistory || '',
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (patient: Patient, event: React.MouseEvent) => {
        event.stopPropagation();
        setPatientToDelete(patient);
        setShowDeleteAlert(true);
    };

    const handleDeleteConfirm = async () => {
        if (!patientToDelete) return;

        try {
            await api.delete(`/patient/${patientToDelete._id}`);
            setToastMessage('Patient deleted successfully');
            setShowToast(true);
            fetchPatients();
        } catch (error) {
            console.error('Error deleting patient:', error);
            setToastMessage('Failed to delete patient');
            setShowToast(true);
        }
        setShowDeleteAlert(false);
        setPatientToDelete(null);
    };

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

    const renderPatientForm = (formik: any, title: string, onClose: () => void) => (
        <IonModal isOpen={true} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{title}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <form onSubmit={formik.handleSubmit}>
                    <IonItem>
                        <IonLabel position="stacked">First Name</IonLabel>
                        <IonInput
                            name="firstName"
                            value={formik.values.firstName}
                            onIonChange={formik.handleChange}
                        />
                    </IonItem>
                    {formik.touched.firstName && formik.errors.firstName && (
                        <div className="error-message">{formik.errors.firstName}</div>
                    )}

                    <IonItem>
                        <IonLabel position="stacked">Last Name</IonLabel>
                        <IonInput
                            name="lastName"
                            value={formik.values.lastName}
                            onIonChange={formik.handleChange}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Email</IonLabel>
                        <IonInput
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onIonChange={formik.handleChange}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Date of Birth</IonLabel>
                        <IonDatetime
                            name="dateOfBirth"
                            value={formik.values.dateOfBirth}
                            onIonChange={(e) => formik.setFieldValue('dateOfBirth', e.detail.value)}
                            max={new Date().toISOString()}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Gender</IonLabel>
                        <IonSelect
                            name="gender"
                            value={formik.values.gender}
                            onIonChange={(e) => formik.setFieldValue('gender', e.detail.value)}
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
                            value={formik.values.phoneNumber}
                            onIonChange={formik.handleChange}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Address</IonLabel>
                        <IonTextarea
                            name="address"
                            value={formik.values.address}
                            onIonChange={formik.handleChange}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Medical History</IonLabel>
                        <IonTextarea
                            name="medicalHistory"
                            value={formik.values.medicalHistory}
                            onIonChange={formik.handleChange}
                        />
                    </IonItem>

                    <IonButton
                        expand="block"
                        type="submit"
                        className="ion-margin-top"
                        disabled={!formik.isValid || formik.isSubmitting}
                    >
                        {title === 'Create New Patient' ? 'Create Patient' : 'Update Patient'}
                    </IonButton>
                </form>
            </IonContent>
        </IonModal>
    );

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
            }
            return 0;
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
                                <div key={patient._id} style={{ position: 'relative' }}>
                                    <PatientCard
                                        patient={patient}
                                        onClick={() => handlePatientClick(patient)}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        display: 'flex',
                                        gap: '8px'
                                    }}>
                                        <IonButton
                                            fill="clear"
                                            color="primary"
                                            onClick={(e) => handleEditClick(patient, e)}
                                            style={{
                                                '--padding-start': '8px',
                                                '--padding-end': '8px'
                                            }}
                                        >
                                            <IonIcon icon={pencil} />
                                        </IonButton>
                                        <IonButton
                                            fill="clear"
                                            color="danger"
                                            onClick={(e) => handleDeleteClick(patient, e)}
                                            style={{
                                                '--padding-start': '8px',
                                                '--padding-end': '8px'
                                            }}
                                        >
                                            <IonIcon icon={trash} />
                                        </IonButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => setShowCreateModal(true)}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>

                {showCreateModal && renderPatientForm(createPatientForm, 'Create New Patient', () => {
                    setShowCreateModal(false);
                    createPatientForm.resetForm();
                })}

                {showEditModal && renderPatientForm(editPatientForm, 'Edit Patient', () => {
                    setShowEditModal(false);
                    setPatientToEdit(null);
                    editPatientForm.resetForm();
                })}

                <IonAlert
                    isOpen={showDeleteAlert}
                    onDidDismiss={() => {
                        setShowDeleteAlert(false);
                        setPatientToDelete(null);
                    }}
                    header="Confirm Delete"
                    message={`Are you sure you want to delete ${patientToDelete?.firstName} ${patientToDelete?.lastName}? This action cannot be undone.`}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            cssClass: 'secondary'
                        },
                        {
                            text: 'Delete',
                            role: 'destructive',
                            handler: handleDeleteConfirm
                        }
                    ]}
                />

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                />

                {/* Patient Details Modal */}
                <PatientDetailsModal />
            </IonContent>
        </IonPage>
    );
};

export default DoctorPatients;