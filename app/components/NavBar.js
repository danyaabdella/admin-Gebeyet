'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUser } from './userProfile';

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const userData = useUser();

  console.log("user data: ", userData);

  return (
    <div className="flex items-center justify-center mt-2 gap-2">
      {session ? (
        <>
        {true && (
          <button
          className="bg-gray-400 p-4 rounded-md py-2"
        >
          Create admins
        </button>
        )}
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
