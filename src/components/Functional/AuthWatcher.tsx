import { RouteComponentProps } from "react-router-dom";
import firebase from "firebase";
import { useContext, useEffect } from "react";
import UserInfoContext from "../../contexts/UserInfoContext";
import { PermLevel } from "../../interfaces/UserInfo";
import firebaseApp from "../../services/firebaseApp";

const AuthWatcher = (
  props: RouteComponentProps & { authUser: firebase.User | undefined | null }
) => {
  let userInfo = useContext(UserInfoContext);

  // useEffect(() => {
  //   if (!userInfo) return;
  //
  //   if (
  //     userInfo.perm_level === PermLevel.Member &&
  //     props.location.pathname.startsWith("/admin")
  //   ) {
  //     props.history.push("/auth/login?insufficient_permissions=1");
  //   }
  // }, [userInfo]);

  // TODO: Refactor login effect
  useEffect(() => {
    if (
      props.authUser === null &&
      !props.location.pathname.startsWith("/auth")
    ) {
      console.log("Not logged in");
      props.history.push("/auth/login");
    }

    if (
      userInfo?.perm_level === PermLevel.Member &&
      props.location.pathname.startsWith("/admin")
    ) {
      firebaseApp.auth().signOut();
      return props.history.push("/auth/login?insufficient_permissions=1");
    }

    if (
      props.authUser &&
      (props.location.pathname.startsWith("/auth") ||
        props.location.pathname === "/") &&
      userInfo?.perm_level !== PermLevel.Member
    ) {
      props.history.push("/admin/societies");
      console.log("Logged in");
    }
  }, [props.authUser, props.location.pathname, props.history, userInfo]);

  return null;
};

export default AuthWatcher;
