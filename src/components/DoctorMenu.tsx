import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonButton,
} from '@ionic/react';
import {
  home,
  calendar,
  people,
  logOut,
} from 'ionicons/icons';
import { Router, useHistory, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';

const DoctorMenu: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const user = AuthService.getCurrentUser();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    AuthService.logout();
    window.location.href = '/login';
  
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          <IonMenuToggle autoHide={false}>
            <IonItem 
              button 
              routerLink="/doctor/dashboard" 
              routerDirection="root"
              lines="none"
              color={location.pathname === '/doctor/dashboard' ? 'primary' : ''}
            >
              <IonIcon slot="start" icon={home} />
              <IonLabel>Dashboard</IonLabel>
            </IonItem>

            <IonItem 
              button 
              routerLink="/doctor/appointments" 
              routerDirection="root"
              lines="none"
              color={location.pathname === '/doctor/appointments' ? 'primary' : ''}
            >
              <IonIcon slot="start" icon={calendar} />
              <IonLabel>Appointments</IonLabel>
            </IonItem>

            <IonItem 
              button 
              routerLink="/doctor/patients" 
              routerDirection="root"
              lines="none"
              color={location.pathname === '/doctor/patients' ? 'primary' : ''}
            >
              <IonIcon slot="start" icon={people} />
              <IonLabel>Patients</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>

        <div className="ion-padding">
          <IonButton 
            expand="block" 
            onClick={handleLogout}
            color="danger"
            style={{
              marginTop: 'auto'
            }}
          >
            <IonIcon slot="start" icon={logOut} />
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default DoctorMenu;