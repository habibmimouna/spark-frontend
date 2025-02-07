import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonFooter,
    IonMenu,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    IonSplitPane
  } from "@ionic/react";
  import { home, menu, informationCircle, languageOutline } from 'ionicons/icons';
  import { useState } from 'react';
  import LanguageSwitch from '../common/LanguageSwitcher/LanguageSwitch';
  
  interface UnauthenticatedLayoutProps {
    children: React.ReactNode;
    title?: string;
  }
  
  const UnauthenticatedLayout: React.FC<UnauthenticatedLayoutProps> = ({
    children,
    title = "Spark Planet"
  }) => {
    const [selectedLanguage, setSelectedLanguage] = useState('EN');
  
    return (
      <IonSplitPane contentId="main">
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
  
          <IonContent>
            <IonList>
              <IonMenuToggle autoHide={false}>
                <IonItem routerLink="/" routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={home}></IonIcon>
                  <IonLabel>Home</IonLabel>
                </IonItem>
  
                <IonItem routerLink="/menu" routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={menu}></IonIcon>
                  <IonLabel>Menu</IonLabel>
                </IonItem>
  
                <IonItem routerLink="/about" routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={informationCircle}></IonIcon>
                  <IonLabel>About</IonLabel>
                </IonItem>
  
                <IonItem lines="none" detail={false}>
                  <IonIcon slot="start" icon={languageOutline}></IonIcon>
                  <LanguageSwitch 
                    selectedLanguage={selectedLanguage} 
                    onLanguageChange={setSelectedLanguage}
                  />
                </IonItem>
              </IonMenuToggle>
            </IonList>
          </IonContent>
        </IonMenu>
  
        <IonPage id="main">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>{title}</IonTitle>
            </IonToolbar>
          </IonHeader>
  
          <IonContent className="ion-padding">
            {children}
          </IonContent>
  
          <IonFooter>
            <IonToolbar>
              <IonTitle size="small" className="ion-text-center">
                © {new Date().getFullYear()} Spark Planet
              </IonTitle>
            </IonToolbar>
          </IonFooter>
        </IonPage>
      </IonSplitPane>
    );
  };
  
  export default UnauthenticatedLayout;