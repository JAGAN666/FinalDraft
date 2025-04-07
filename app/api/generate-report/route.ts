import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // This is a placeholder API route that we're keeping for compatibility
    // The actual PDF generation now happens on the client side with jsPDF

    return NextResponse.json({
      success: true,
      message: "Client-side PDF generation is now used instead of server-side",
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}

