import { type NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mizizzi-ecommerce-1.onrender.com'

export async function GET(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  try {
    const pathSegments = params.route || []
    const path = pathSegments.join('/')
    const authHeader = request.headers.get('Authorization')
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()

    const backendUrl = queryString
      ? `${API_BASE_URL}/api/admin/${path}?${queryString}`
      : `${API_BASE_URL}/api/admin/${path}`

    console.log('[v0] Proxying admin GET request to backend:', backendUrl)

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const data = await response.json().catch(() => ({}))

    console.log('[v0] Admin API response status:', response.status)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || `Failed with status ${response.status}`,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Admin API proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Request failed',
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  try {
    const pathSegments = params.route || []
    const path = pathSegments.join('/')
    const authHeader = request.headers.get('Authorization')
    const body = await request.json().catch(() => ({}))

    const backendUrl = `${API_BASE_URL}/api/admin/${path}`

    console.log('[v0] Proxying admin POST request to backend:', backendUrl)

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))

    console.log('[v0] Admin API response status:', response.status)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || data.msg || `Failed with status ${response.status}`,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Admin API proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Request failed',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  try {
    const pathSegments = params.route || []
    const path = pathSegments.join('/')
    const authHeader = request.headers.get('Authorization')
    const body = await request.json().catch(() => ({}))

    const backendUrl = `${API_BASE_URL}/api/admin/${path}`

    console.log('[v0] Proxying admin PUT request to backend:', backendUrl)

    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))

    console.log('[v0] Admin API response status:', response.status)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || `Failed with status ${response.status}`,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Admin API proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Request failed',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  try {
    const pathSegments = params.route || []
    const path = pathSegments.join('/')
    const authHeader = request.headers.get('Authorization')

    const backendUrl = `${API_BASE_URL}/api/admin/${path}`

    console.log('[v0] Proxying admin DELETE request to backend:', backendUrl)

    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const data = await response.json().catch(() => ({}))

    console.log('[v0] Admin API response status:', response.status)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || `Failed with status ${response.status}`,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Admin API proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Request failed',
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
