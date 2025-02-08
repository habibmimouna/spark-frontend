// src/App.tsx
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/global.css';

/* Pages */
import LoginPage from './pages/auth/Login';
import DoctorDashboard from './pages/doctor/Dashboard';
import PatientDashboard from './pages/patient/Dashboard';
import DoctorAppointments from './pages/doctor/Appointments';
import PatientAppointments from './pages/patient/Appointments';
import PatientProfile from './pages/patient/Profile';
// import ResetPassword from './pages/auth/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" component={LoginPage} />
        {/* <Route exact path="/reset-password" component={ResetPassword} /> */}
        
        {/* Doctor Routes */}
        <ProtectedRoute exact path="/doctor/dashboard" component={DoctorDashboard} userType="doctor" />
        <ProtectedRoute exact path="/doctor/appointments" component={DoctorAppointments} userType="doctor" />
        
        {/* Patient Routes */}
        <ProtectedRoute exact path="/patient/dashboard" component={PatientDashboard} userType="patient" />
        <ProtectedRoute exact path="/patient/appointments" component={PatientAppointments} userType="patient" />
        <ProtectedRoute exact path="/patient/profile" component={PatientProfile} userType="patient" />
        
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;