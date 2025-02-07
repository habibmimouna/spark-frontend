import React, { useState } from "react";
import AboutPage from "../components/About/AboutPage";
import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";


const About: React.FC = () => {
  return (
    <UnauthenticatedLayout>
      <AboutPage />
    </UnauthenticatedLayout>
  );
};

export default About;