/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

const Login = () => {
  return (
    <>
      <footer className="py-5">
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="6">
              <div className="copyright text-center text-xl-left text-muted">
                © {new Date().getFullYear()}{" "}
                <a
                  className="font-weight-bold ml-1"
                  href="https://campus42.co.uk"
                  target="_blank"
                >
                  Campus42
                </a>
              </div>
            </Col>
            <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end">
            {/* <NavItem>
              <NavLink
                href="https://wsabihi.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Created by WNS
              </NavLink>
            </NavItem> */}

            <NavItem>
              <NavLink
                href="https://campus42.co.uk/terms-conditions.html"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                Terms & Conditions
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://campus42.co.uk/privacy-policy.html"
                rel="noopener noreferrer"
                target="_blank"
              >
                Privacy Policy
              </NavLink>
            </NavItem>

            {/* <NavItem>
              <NavLink
                href="https://github.com/creativetimofficial/argon-dashboard/blob/master/LICENSE.md?ref=adr-admin-footer"
                rel="noopener noreferrer"
                target="_blank"
              >
                MIT License
              </NavLink>
            </NavItem> */}
          </Nav>
        </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Login;
