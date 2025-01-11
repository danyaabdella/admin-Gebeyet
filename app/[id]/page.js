'use client'
import { useRouter } from "next/navigation";

const UserPage = () => {
  const router = useRouter();

  return (
    <div>
      <h1>Welcome, User </h1>
      {/* Render user-specific content based on id */}
    </div>
  );
};

export default UserPage;
