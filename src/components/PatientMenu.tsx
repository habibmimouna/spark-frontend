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
  person,
  logOut,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import AuthService from '../services/auth.service';

const PatientMenu: React.FC = () => {
  const history = useHistory();
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    history.push('/login');
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding">
          <h2>Welcome, {user?.firstName}</h2>
        </div>
        
        <IonList>
          <IonMenuToggle autoHide={false}>
            <IonItem 
              button 
              routerLink="/patient/dashboard" 
              routerDirection="root"
              lines="none"
            >
              <IonIcon slot="start" icon={home} />
              <IonLabel>Dashboard</IonLabel>
            </IonItem>

            <IonItem 
              button 
              routerLink="/patient/appointments" 
              routerDirection="root"
              lines="none"
            >
              <IonIcon slot="start" icon={calendar} />
              <IonLabel>Appointments</IonLabel>
            </IonItem>

            <IonItem 
              button 
              routerLink="/patient/profile" 
              routerDirection="root"
              lines="none"
            >
              <IonIcon slot="start" icon={person} />
              <IonLabel>Profile</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>

        <div className="ion-padding">
          <IonButton 
            expand="block" 
            onClick={handleLogout}
            color="danger"
          >
            <IonIcon slot="start" icon={logOut} />
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default PatientMenu;