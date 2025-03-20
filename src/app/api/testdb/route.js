import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: "MongoDB Connected Successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "MongoDB Connection Failed" }, { status: 500 });
  }
}
