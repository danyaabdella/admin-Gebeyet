'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(); 
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center mt-2 gap-2">
      {session ? (
        <>
          <button
            className="bg-gray-400 p-4 rounded-md py-2"
            onClick={() => router.push('/profile')}
          >
            Profile
          </button>
          <button
            className="bg-red-400 p-4 rounded-md py-2"
            onClick={() => {signOut(); 
              router.push('/');}}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            className="bg-blue-400 p-4 rounded-md py-2"
            onClick={() => router.push('/')}
          >
            Sign In
          </button>
        </>
      )}
    </div>
  );
};

export default Navbar;
