import { type NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mizizzi-ecommerce-1.onrender.com'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')

    console.log('[v0] Proxying admin logout request to backend')

    const response = await fetch(`${API_BASE_URL}/api/admin/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const data = await response.json().catch(() => ({}))

    console.log('[v0] Admin logout response status:', response.status)

    if (!response.ok) {
      // Still return success even if backend fails - client is logging out
      return NextResponse.json({ success: true, message: 'Logged out locally' })
    }

    return NextResponse.json({ success: true, message: 'Logged out' })
  } catch (error) {
    console.error('[v0] Admin logout proxy error:', error)
    // Don't fail logout on network errors - still succeed locally
    return NextResponse.json({ success: true, message: 'Logged out locally' })
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
