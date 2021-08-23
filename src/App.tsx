import React, { useCallback, useEffect, useState } from "react";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";

import AdminLayout from "./layouts/Admin.js";
import AuthLayout from "./layouts/Auth.js";
import firebaseApp, { firestore } from "./services/firebaseApp";
import firebase from "firebase";
import AuthWatcher from "./components/Functional/AuthWatcher";
import { UserInfo } from "./interfaces/UserInfo";
import UserInfoContext from "contexts/UserInfoContext";
import LoadingOverlay from "./components/Functional/LoadingOverlay";
import { useRecoilState } from "recoil";
import { campusIdState } from "./state/campusIdState";

function App() {
  const [authUser, setAuthUser] = useState<firebase.User | undefined | null>(
    undefined
  );

  const [userInfo, setUserInfo] = useState<UserInfo>();

  const [, setCampusId] = useRecoilState(campusIdState);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
  });

  const loadUserInfo = useCallback(
    async (uid: string) => {
      const snapshot = await firestore.collection("users").doc(uid).get();
      if (!snapshot.exists) return;
      let data = snapshot.data();
      if (data) {
        setUserInfo({
          ...data,
          _id: uid,
        } as UserInfo);
        setCampusId((data as UserInfo).campus);
      }
    },
    [setCampusId]
  );

  useEffect(() => {
    if (authUser) {
      loadUserInfo(authUser.uid);
    }
  }, [authUser, loadUserInfo]);

  return (
    <UserInfoContext.Provider value={userInfo}>
      <BrowserRouter>
        <Route
          path="*"
          render={(props) => <AuthWatcher {...props} authUser={authUser} />}
        />
        <Switch>
          <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
          {userInfo ? (
            <Switch>
              <Route
                path="/admin"
                render={(props) => (
                  <AdminLayout {...props} userInfo={userInfo} />
                )}
              />
              <Redirect from="/" to="/admin/societies" />
            </Switch>
          ) : (
            <LoadingOverlay />
          )}
        </Switch>
      </BrowserRouter>
    </UserInfoContext.Provider>
  );
}

export default App;
