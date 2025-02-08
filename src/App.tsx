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
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DoctorPatients from './pages/doctor/Patients';
import ResetPassword from './pages/auth/ResetPassword'

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/reset-password" component={ResetPassword} />
        
        {/* Doctor Routes */}
        <ProtectedRoute 
          exact 
          path="/doctor/dashboard" 
          userType="doctor"
          component={(props: any) => (
            <AuthenticatedLayout>
              <DoctorDashboard {...props} />
            </AuthenticatedLayout>
          )} 
        />
        <ProtectedRoute 
          exact 
          path="/doctor/appointments" 
          userType="doctor"
          component={(props: any) => (
            <AuthenticatedLayout>
              <DoctorAppointments {...props} />
            </AuthenticatedLayout>
          )} 
        />
        <ProtectedRoute 
          exact 
          path="/doctor/patients" 
          userType="doctor"
          component={(props: any) => (
            <AuthenticatedLayout>
              <DoctorPatients {...props} />
            </AuthenticatedLayout>
          )} 
        />
        
        {/* Patient Routes */}
        <ProtectedRoute 
          exact 
          path="/patient/dashboard" 
          userType="patient"
          component={(props: any) => (
            <AuthenticatedLayout>
              <PatientDashboard {...props} />
            </AuthenticatedLayout>
          )} 
        />
        <ProtectedRoute 
          exact 
          path="/patient/appointments" 
          userType="patient"
          component={(props: any) => (
            <AuthenticatedLayout>
              <PatientAppointments {...props} />
            </AuthenticatedLayout>
          )} 
        />
        <ProtectedRoute 
          exact 
          path="/patient/profile" 
          userType="patient"
          component={(props: any) => (
            <AuthenticatedLayout>
              <PatientProfile {...props} />
            </AuthenticatedLayout>
          )} 
        />
        
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);
export default App