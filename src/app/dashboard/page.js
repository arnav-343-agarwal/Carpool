import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import RedirectComponent from "@/components/RedirectComponent"; // ✅ Import Redirect Component

export default async function Dashboard() {
  await dbConnect();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log("🚨 No token found, redirecting to login...");
    return <RedirectComponent to="/login" />;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded); // ✅ Debug token output

    const user = await User.findById(decoded.id).select("role");
    console.log("✅ User Data from DB:", user); // ✅ Debug user role

    if (!user) {
      console.log("🚨 No user found, redirecting to login...");
      return <RedirectComponent to="/login" />;
    }

    const redirectTo = user.role === "driver" ? "/dashboard/driver" : "/dashboard/rider";
    console.log(`✅ Redirecting user to: ${redirectTo}`);

    return <RedirectComponent to={redirectTo} />;
  } catch (error) {
    console.error("🚨 JWT verification failed:", error);
    return <RedirectComponent to="/login" />;
  }
}
