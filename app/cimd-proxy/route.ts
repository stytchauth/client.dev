import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const { cimd } = await request.json()

    const response = await fetch(cimd)
    const data = await response.json()

    return NextResponse.json(data)
}
