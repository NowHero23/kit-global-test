"use client";

import { useAuth } from "../auth/AuthContext";

export const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Привіт, {user.metadata.nickname}!</h1>
      <p>ID: {user.uid}</p>
    </div>
  );
};