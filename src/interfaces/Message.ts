import firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;

export interface Message {
  creator: string;
  creator_name: string;
  custom: boolean;

  device_token: string;

  image: boolean;
  sent: boolean;
  system: boolean;

  text: boolean;

  timestamp_ms: number;
  timestamp: Timestamp;

  _id?: string;
}
