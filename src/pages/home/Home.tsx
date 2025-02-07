import { 
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonText
} from '@ionic/react';
import { calendarOutline, chatbubbleOutline, notificationsOutline } from 'ionicons/icons';
import UnauthenticatedLayout from '../../components/layout/UnauthenticatedLayout';
import './Home.css'

const Home : React.FC = () => {
  return (
    <UnauthenticatedLayout>
      <IonGrid className="ion-padding">
        <IonRow className="ion-align-items-center ion-margin-bottom">
          <IonCol size="12">
            <h1 className="ion-text-center">
              Where Patients and Doctors Connect
            </h1>
            <h2 className="ion-text-center ion-color-medium">
              Effortless Appointments, Better Care, Anytime, Anywhere!
            </h2>
            <div className="ion-text-center ion-margin-top">
              <IonButton routerLink="/signup" shape="round" size="large">
                Sign up Now
              </IonButton>
            </div>
          </IonCol>
        </IonRow>

        <IonRow className="ion-justify-content-around ion-margin-vertical">
          <IonCol size="4" className="ion-text-center">
            <h3 className="ion-no-margin">390+</h3>
            <IonText color="medium">Patients</IonText>
          </IonCol>
          <IonCol size="4" className="ion-text-center">
            <h3 className="ion-no-margin">120+</h3>
            <IonText color="medium">Doctors</IonText>
          </IonCol>
          <IonCol size="4" className="ion-text-center">
            <h3 className="ion-no-margin">1078+</h3>
            <IonText color="medium">Appointments</IonText>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size="12">
            <h2 className="ion-text-center ion-margin-vertical">What We Offer</h2>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size="12">
            <IonCard>
              <IonCardContent className="ion-text-center">
                <IonIcon icon={calendarOutline} size="large" color="primary" />
                <h3>Easy Scheduling</h3>
                <p>Quickly book and manage appointments with an intuitive and streamlined scheduling tool.</p>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardContent className="ion-text-center">
                <IonIcon icon={chatbubbleOutline} size="large" color="primary" />
                <h3>Secure Communication</h3>
                <p>Chat or consult privately with encrypted communication for sensitive discussions.</p>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardContent className="ion-text-center">
                <IonIcon icon={notificationsOutline} size="large" color="primary" />
                <h3>Real-Time Notifications</h3>
                <p>Stay informed with instant reminders and updates about appointments and follow-ups.</p>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </UnauthenticatedLayout>
  );
};

export default Home;