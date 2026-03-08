import { type NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mizizzi-ecommerce-1.onrender.com'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')

    console.log('[v0] Proxying admin refresh token request to backend')

    const response = await fetch(`${API_BASE_URL}/api/admin/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify({}),
    })

    const data = await response.json().catch(() => ({}))

    console.log('[v0] Admin refresh response status:', response.status)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          msg: data.msg || data.message || data.error || `Token refresh failed with status ${response.status}`,
        },
        { status: response.status }
      )
    }

    // Return the backend response as-is
    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Admin refresh proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        msg: error instanceof Error ? error.message : 'Failed to refresh token',
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
