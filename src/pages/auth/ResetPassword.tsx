import React, { useState } from "react";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import UnauthenticatedLayout from "../../components/layout/UnauthenticatedLayout";


const ResetPassword: React.FC = () => {
  return (
    <UnauthenticatedLayout title="Custom Page">
      <ResetPasswordForm />
    </UnauthenticatedLayout>
  );
};

export default ResetPassword;
