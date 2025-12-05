export interface Actor {
  id: string;
  username: string;
  tag: string;
  type: "guest" | "user";
}

export interface AuthResponse {
  token: string;
  actor: Actor;
}
