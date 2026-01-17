import React, { useEffect, useState } from "react";
import "./Footer.css";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { CiYoutube } from "react-icons/ci";
import { FaTwitterSquare } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import useAuth from "../store/authStore";
const Footer = () => {
  const { isAuthenticated, user } = useAuth();

  const shouldHideFooter = isAuthenticated && user?.role === "seller";

  return (
    <>
      <footer className={`${shouldHideFooter ? "hidden" : "block"} mt-20`}>
        <div className="footer">
          <div className="row-1">
            <a href="#">
              <FaFacebook />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <CiYoutube />
            </a>
            <a href="#">
              <FaTwitterSquare />
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
