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
import React, { FC, useState } from "react";

// reactstrap components
import {
  Button,
  Card,
  // CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Alert,
} from "reactstrap";

import { Formik } from "formik";
import firebaseApp from "../../services/firebaseApp";
import { RouteComponentProps } from "react-router-dom";

// function submitLogin(e: React.FormEvent) {
//   e.preventDefault();
//   console.log(e);
// }

interface IProps extends RouteComponentProps {}

const Login: FC<IProps> = ({ location }) => {
  const [loginError, setLoginError] = useState<string>("");
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  const insufficientPermissionsFlag = location.search.includes(
    "insufficient_permissions"
  );

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          {/*<CardHeader className="bg-transparent pb-5">*/}
          {/*  <div className="text-muted text-center mt-2 mb-3">*/}
          {/*    <small>Sign in with</small>*/}
          {/*  </div>*/}
          {/*  <div className="btn-wrapper text-center">*/}
          {/*    <Button*/}
          {/*      className="btn-neutral btn-icon"*/}
          {/*      color="default"*/}
          {/*      href="#/"*/}
          {/*      onClick={(e) => e.preventDefault()}*/}
          {/*    >*/}
          {/*      <span className="btn-inner--icon">*/}
          {/*        <img*/}
          {/*          alt="..."*/}
          {/*          src={*/}
          {/*            require("../../assets/img/icons/common/github.svg")*/}
          {/*              .default*/}
          {/*          }*/}
          {/*        />*/}
          {/*      </span>*/}
          {/*      <span className="btn-inner--text">Github</span>*/}
          {/*    </Button>*/}
          {/*    <Button*/}
          {/*      className="btn-neutral btn-icon"*/}
          {/*      color="default"*/}
          {/*      href="#/"*/}
          {/*      onClick={(e) => e.preventDefault()}*/}
          {/*    >*/}
          {/*      <span className="btn-inner--icon">*/}
          {/*        <img*/}
          {/*          alt="..."*/}
          {/*          src={*/}
          {/*            require("../../assets/img/icons/common/google.svg")*/}
          {/*              .default*/}
          {/*          }*/}
          {/*        />*/}
          {/*      </span>*/}
          {/*      <span className="btn-inner--text">Google</span>*/}
          {/*    </Button>*/}
          {/*  </div>*/}
          {/*</CardHeader>*/}
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with credentials</small>
            </div>
            <Formik
              initialValues={{ email: "", password: "" }}
              validate={(values) => {
                const errors: Record<string, any> = {};
                if (!values.email) {
                  errors.email = "Required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address";
                }

                if (!values.password) {
                  errors.password = "Required";
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  let user = await firebaseApp
                    .auth()
                    .signInWithEmailAndPassword(values.email, values.password);
                  if (!user.user) {
                    setLoginError("Failed to load user");
                  } else {
                    setLoginSuccess(true);
                  }
                } catch (e) {
                  setLoginError(e.message);
                }
                setSubmitting(false);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <Form role="form" onSubmit={handleSubmit}>
                  {loginSuccess && (
                    <Alert color="success">
                      <strong>Login Success!</strong> You'll be redirected
                      shortly.
                    </Alert>
                  )}

                  {insufficientPermissionsFlag && (
                    <Alert color="danger">
                      <strong>Login error!</strong> Insufficient permissions
                    </Alert>
                  )}

                  {loginError && (
                    <Alert color="danger">
                      <strong>Login error!</strong> {loginError}
                    </Alert>
                  )}

                  <FormGroup className="mb-3">
                    {errors.email && touched.email && errors.email}
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email"
                        type="email"
                        autoComplete="new-email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    {errors.password && touched.password && errors.password}
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Password"
                        type="password"
                        autoComplete="new-password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
                    </InputGroup>
                  </FormGroup>
                  {/*<div className="custom-control custom-control-alternative custom-checkbox">*/}
                  {/*  <input*/}
                  {/*    className="custom-control-input"*/}
                  {/*    id=" customCheckLogin"*/}
                  {/*    type="checkbox"*/}
                  {/*  />*/}
                  {/*  <label*/}
                  {/*    className="custom-control-label"*/}
                  {/*    htmlFor=" customCheckLogin"*/}
                  {/*  >*/}
                  {/*    <span className="text-muted">Remember me</span>*/}
                  {/*  </label>*/}
                  {/*</div>*/}
                  <div className="text-center">
                    <Button
                      className="my-4"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Sign in
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#/"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          {/*<Col className="text-right" xs="6">*/}
          {/*  <a*/}
          {/*    className="text-light"*/}
          {/*    href="#/"*/}
          {/*    onClick={(e) => e.preventDefault()}*/}
          {/*  >*/}
          {/*    <small>Create new account</small>*/}
          {/*  </a>*/}
          {/*</Col>*/}
        </Row>
      </Col>
    </>
  );
};

export default Login;
