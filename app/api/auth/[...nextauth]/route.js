import { getToken } from 'next-auth/jwt';
import Admin from '../../../models/Admin';
import SuperAdmin from '../../../models/SuperAdmin';
import { connectToDB } from '../../../utils/functions';

export async function role(req) {
  await connectToDB();

  // Debug: Check if req is defined
  console.log("Request Object in role function:", req);

  // Adapt the NextApiRequest object for getToken
  const adaptedReq = {
    headers: {
      cookie: req.headers.get('cookie') || '', // Extract cookies from headers
    },
  };

  // Debug: Check the adapted request
  console.log("Adapted Request:", adaptedReq);

  // Extract the token from the request cookies
  const token = await getToken({ req: adaptedReq, secret: process.env.NEXTAUTH_SECRET });

  // Debug: Check the extracted token
  console.log("Token in role function:", token);

  if (!token?.email) {
    console.log("No email found in token"); // Debug: Check if email is missing
    return null; // No session found
  }

  // Debug: Check the email in the token
  console.log("Email from token:", token.email);

  // Find the user in the Admin or SuperAdmin collection
  const user = await Admin.findOne({ email: token.email }) || 
               await SuperAdmin.findOne({ email: token.email });

  // Debug: Check the found user
  console.log("User found in role function:", user);

  return user?.role || null;
}