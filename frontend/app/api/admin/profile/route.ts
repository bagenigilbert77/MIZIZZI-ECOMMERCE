import { type NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mizizzi-ecommerce-1.onrender.com'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')

    console.log('[v0] Proxying admin profile request to backend')

    const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const data = await response.json().catch(() => ({}))

    console.log('[v0] Admin profile response status:', response.status)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || `Failed to fetch profile with status ${response.status}`,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Admin profile proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const body = await request.json().catch(() => ({}))

    console.log('[v0] Proxying admin profile update request to backend')

    const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))

    console.log('[v0] Admin profile update response status:', response.status)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || `Failed to update profile with status ${response.status}`,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Admin profile update proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
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
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
