import firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;

export interface Blog {
  blog_content: Array<{
    type: string;
    value: string;
  }>;
  confirmed: boolean;
  edit_log?: Array<{
    action: string;
    date: Timestamp;
    uid: string;
  }>;
  members: Array<string>;
  permissions: Array<string>;
  scraped: boolean;
  search_index: Array<string>;
  society_id: string;
  society_name: string;
  start_ms: number;
  su_link: string;
  su_title: string;
  visible: boolean;

  _id?: string;
}
