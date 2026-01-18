import React, { useEffect, useState } from "react";
import "./Footer.css";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import useAuth from "../store/authStore";
const Footer = () => {
  const { isAuthenticated, user } = useAuth();

  const shouldHideFooter = isAuthenticated && user?.role === "seller";

  return (
    <>
      <footer className={`${shouldHideFooter ? "hidden" : "block"} mt-20`}>
        <div className="footer">
          <div className="row-1">
            <a
              href="https://www.facebook.com/profile.php?id=61583485027931"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/makerdz9?igsh=bmdmdmE4N2piNGZs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
          </div>

          <div className="row">
            <ul>
              <li>
                <a href="#">Contact us</a>
              </li>
              <li>
                <a href="#">Our Services</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms & Conditions</a>
              </li>
              <li>
                <a href="#">Career</a>
              </li>
            </ul>
          </div>

          <div className="row">
            Copyright © 2021 Maker - All rights reserved
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
