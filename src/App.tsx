
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';


import '@ionic/react/css/core.css';

import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/global.css';

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
import RegisterPage from './pages/auth/Register';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/reset-password" component={ResetPassword} />

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

        <Route path="/register" component={RegisterPage} />

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);
export default App