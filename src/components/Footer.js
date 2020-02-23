import React from "react";
import "./Footer.css";
const Footer = props => {
  return (
    <React.Fragment>
      <footer className="site-footer">
        <div className="footer-info">
          <div className="footer-media">
            <span className="footer-info-title">Social Media:</span>

            <ul>
              <li>
                <a
                  className="social-twitter"
                  href="https://bit.ly/36mZnqz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ion-social-twitter"></i>
                </a>
              </li>
              <li>
                <a
                  className="social-github"
                  href="https://bit.ly/3aFuWyY"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ion-social-github"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-credits">
            <span className="footer-info-title">Running on</span>
            <a
              href="https://dictionaryapi.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="merriam-logo"
                src="https://bit.ly/2TRzvk4"
                alt="merriam webster logo"
              />
            </a>
          </div>
        </div>

        <span className="footer-copyright">&#169; 2020-2021 Eduardo Song</span>
      </footer>
    </React.Fragment>
  );
};
export default Footer;
