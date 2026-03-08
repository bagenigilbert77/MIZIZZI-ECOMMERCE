import { type NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mizizzi-ecommerce-1.onrender.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('[v0] Proxying admin login request to backend:', `${API_BASE_URL}/api/admin/login`)

    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))

    console.log('[v0] Admin login response status:', response.status)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          msg: data.msg || data.message || data.error || `Login failed with status ${response.status}`,
          error: data.error || data.message,
        },
        { status: response.status }
      )
    }

    // Return the backend response as-is
    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Admin login proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        msg: error instanceof Error ? error.message : 'Failed to connect to server',
        error: error instanceof Error ? error.message : 'Server connection failed',
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
