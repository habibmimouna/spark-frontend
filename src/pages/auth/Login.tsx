import React, { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import UnauthenticatedLayout from "../../components/layout/UnauthenticatedLayout";


const Login: React.FC = () => {
  return (
    <UnauthenticatedLayout>
      <LoginForm />
    </UnauthenticatedLayout>

  );
};

export default Login;
