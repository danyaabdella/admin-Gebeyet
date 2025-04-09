import type { Metadata } from "next"
import SignInClient from "./signin-client"

export const metadata: Metadata = {
  title: "Product Management - Marketplace Admin",
  description: "Manage products in the marketplace",
}

const SignInPage = () => {
  return (
    <div>
      <SignInClient/>
    </div>
  )
}

export default SignInPage
