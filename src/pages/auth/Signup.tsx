import React, { useState } from "react";
import SignupForm from "../../components/auth/SignupForm";
import UnauthenticatedLayout from "../../components/layout/UnauthenticatedLayout";


const Signup: React.FC = () => {
  return (
    <UnauthenticatedLayout>
      <SignupForm />
    </UnauthenticatedLayout>

  );
};

export default Signup;
