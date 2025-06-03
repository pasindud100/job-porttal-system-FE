import React from "react";

import MainBanner from "../Banner/MainBanner";
import FirstAppear from "../FirstAppear/FirstApper";
import OurService from "../Service/OurService";
import AboutUs from "../AboutUs/AboutUs";
import ContactUs from "../ContactUs/ContactUs";
import Navbar from "../../component/NavBar/Navbar";


function HomePage() {
  return (
    <div>
      <Navbar/>
      <MainBanner />
      <FirstAppear />
      <OurService />
      <AboutUs />
      <ContactUs />
    </div>
  );
}

export default HomePage;
