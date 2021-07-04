import React from "react";
import { UserInfo } from "../interfaces/UserInfo";

const UserInfoContext = React.createContext<UserInfo | undefined>(undefined);

export default UserInfoContext;
