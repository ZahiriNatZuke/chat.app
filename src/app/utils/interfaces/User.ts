export interface User {
  id: number;
  name: string;
  email: string;
  profile_photo_path: string;
  profile_photo_url: string;
  email_verified_at?: Date;
  created_at?: string;
  updated_at?: string;
  current_team_id?: number;
}
