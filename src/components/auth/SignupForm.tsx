import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonButton,
  IonCard,
  IonInput,
  IonItem,
  IonText,
  IonSelectOption,
  IonSelect,
  IonCardContent,
} from "@ionic/react";
import { authService } from "../../services/authService";

const SignupForm: React.FC = () => {
  const history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    state: "",
    medicalSpecialty: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...signupData } = formData;
      await authService.signup(signupData);
      history.push("/appointments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonCard className="ion-margin" style={{ borderRadius: '16px', backgroundColor: '#ffffff' }}>
      <div className="ion-text-center ion-margin-bottom">
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Join Our Medical Network</h1>
        <p style={{ color: '#666', marginTop: '8px' }}>Create your account to start managing patient appointments</p>
      </div>
      <IonCardContent>
        <form onSubmit={handleSubmit}>
          <IonItem className="ion-margin-bottom">
            <IonInput
              label="FirstName *"
              type="text"
              name="firstName"
              value={formData.firstName}
              onIonChange={handleChange}
              required
            />
          </IonItem>
          <IonItem className="ion-margin-bottom">
            <IonInput
              label="LastName *"
              type="text"
              name="lastName"
              value={formData.lastName}
              onIonChange={handleChange}
              required
            />
          </IonItem>
          <IonItem className="ion-margin-bottom">
            <IonInput
              label="Phone Number *"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onIonChange={handleChange}
              required
            />
          </IonItem>
          <IonItem className="ion-margin-bottom">
            <IonInput
              label="Email *"
              type="email"
              name="email"
              value={formData.email}
              onIonChange={handleChange}
              required
            />
          </IonItem>
          <IonItem className="ion-margin-bottom">
            <IonSelect
              label="State *"
              name="state"
              value={formData.state}
              onIonChange={handleChange}
              interface="popover"
            >
              <IonSelectOption value="Monastir">Monastir</IonSelectOption>
              <IonSelectOption value="Sousse">Sousse</IonSelectOption>
              <IonSelectOption value="Mahdia">Mahdia</IonSelectOption>
              <IonSelectOption value="Tunisie">Tunisie</IonSelectOption>
              <IonSelectOption value="Sfax">Sfax</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem className="ion-margin-bottom">
            <IonSelect
              label="Médical Specialty *"
              name="medicalSpecialty"
              value={formData.medicalSpecialty}
              onIonChange={handleChange}
              interface="popover"
            >
              <IonSelectOption value="Généraliste">Généraliste</IonSelectOption>
              <IonSelectOption value="Cardiologie">Cardiologie</IonSelectOption>
              <IonSelectOption value="Pédiatrie">Pédiatrie</IonSelectOption>
              <IonSelectOption value="Chirurgie">Chirurgie</IonSelectOption>
              <IonSelectOption value="Dermatologie">Dermatologie</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem className="ion-margin-bottom">
            <IonInput
              label="Password *"
              type="password"
              name="password"
              value={formData.password}
              onIonChange={handleChange}
              required
            />
          </IonItem>
          <IonItem className="ion-margin-bottom">
            <IonInput
              label="Confirm Password *"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onIonChange={handleChange}
              required
            />
          </IonItem>
          <IonButton shape="round" expand="full" type="submit" className="ion-margin-top">
            Signup
          </IonButton>
        </form>
        <IonText className="ion-text-center ion-margin-top">
          <p>
            Already have an account ? <a href="/login">Sign in</a>
          </p>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default SignupForm;