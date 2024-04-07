interface user {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  birthday: Date;
  is_active: boolean;
}

interface group {
  group_id: string;
  name: string;
  avatar_url: string;
  created_at: Date;
  pinned_message_id: string;
}

interface message {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  group_receiver_id: string;
  content: string;
  created_at: Date;
  is_reminder: boolean;
  reminder_id: string;
  next_reminder_date: Date;
  expiration_date: Date;
  is_read: boolean;
}
interface user_group {
  user_id: string;
  group_id: string;
  join_date: Date;
}

export { user, group, message, user_group };
