import firebase from "firebase";
import { PermLevel } from "./UserInfo";
import Timestamp = firebase.firestore.Timestamp;

export interface Channel {
  _id: string;

  __type: string;

  admins: string[];
  can_respond: boolean;

  created: Timestamp;
  creator: string;

  description: string;
  disabled: boolean;
  disabled_reason: boolean;

  image: string;
  latest_author: string;
  latest_author_uid: string;

  latest_message: Array<{
    __data: null;
    __type: string;

    campusKey: string;
    channelId: string;
    conversationId: string;
    creator: string;
    creator_name: string;
    custom: boolean;

    device_token: string;
    id: string;

    image: boolean;
    system: boolean;
    text: string;
    timestamp: {};

    timestamp_ms: number;
    video: boolean;
  }>;

  latest_text: string;
  latest_text_is_custom: boolean;
  latest_text_is_system: boolean;
  latest_timestamp_ms: number;

  member_uids: string[];

  member_names: Record<
    string,
    {
      admin_societies: Array<string>;
      beta_user: boolean;

      bookmarks: {
        announcement: string[];
        event: string[];
        society: string[];
      };

      campus: string;
      campus42_admin: boolean;
      email: string;
      event_count: number;
      first_name: string;

      image: string;
      joined_societies: string[];

      last_name: string;
      level: number;
      offline_timestamp_ms: number;
      online_timestamp_ms: number;

      pending_reported_behaviour: boolean;
      period_points: number;
      perm_level: PermLevel;
      permissions: string[];
    }
  >;

  message_timestamps_ms: number[];

  name: string;
  notification_topic: string;
}
