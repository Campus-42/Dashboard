export interface Society {
  confirmed: boolean;
  description: string;
  exec_members: Array<string>;
  exec_roles: Record<ExecRoles, string>;
  images: Record<string, string>;
  members: Array<string>;
  name: string;
  posted_by: string;
  posted_date: number;
  society_bubbles: string;
  visible: boolean;

  review_logs: Array<{
    action: string;
    message: string;
    timestamp: Date;
    uid: string;
  }>;

  pricing: {
    show: boolean;
    value: string;
  };

  _id?: string;
}

export enum ExecRoles {
  President = "president",
  Secretary = "secretary",
  SocialSecretary = "social_secretary",
  VicePresident = "vice_president",
}
