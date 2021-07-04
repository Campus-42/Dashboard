import firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;

export interface Event {
  confirmed: boolean;
  date: {
    start: Timestamp;
    end: Timestamp;
  };
  description: string;
  edit_log: Array<{
    action: string;
    date: Timestamp;
    uid: string;
  }>;
  end_ms: number;
  images: {
    background: string;
    preview: string;
  };
  link: {
    show: boolean;
    url: string;
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
    name: string;
    show: boolean;
  };
  number_of_participants: number;
  participants: Array<string>;
  president: string;
  pricing: {
    currency: string;
    price: string;
    show: boolean;
  };
  read_count: number;
  repeat: {
    does_repeat: boolean;
    interval: number;
  };
  search_index: Array<string>;
  society_id: string;
  society_name: string;
  start_ms: number;
  title: string;

  _id?: string;

  visible?: boolean;
}
