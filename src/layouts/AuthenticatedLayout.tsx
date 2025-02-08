import React from 'react';
import { IonContent, IonPage, IonSplitPane } from '@ionic/react';
import DoctorMenu from '../components/DoctorMenu';
import PatientMenu from '../components/PatientMenu';
import AuthService from '../services/auth.service';

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
    const userType = AuthService.getUserType();

    return (
        <IonPage>
            <IonSplitPane contentId="main">
                {userType === 'doctor' ? <DoctorMenu /> : <PatientMenu />}
                <IonPage id="main">
                    {children}
                </IonPage>
            </IonSplitPane>
        </IonPage>
    );
};

export default AuthenticatedLayout;