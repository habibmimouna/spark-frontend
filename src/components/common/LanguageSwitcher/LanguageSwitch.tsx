import { IonSelect, IonSelectOption } from '@ionic/react';

interface LanguageSwitchProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <IonSelect
      value={selectedLanguage}
      onIonChange={e => onLanguageChange(e.detail.value)}
      interface="popover"
    >
      <IonSelectOption value="EN">English</IonSelectOption>
      <IonSelectOption value="FR">Français</IonSelectOption>
      <IonSelectOption value="AR">العربية</IonSelectOption>
    </IonSelect>
  );
};

export default LanguageSwitch;