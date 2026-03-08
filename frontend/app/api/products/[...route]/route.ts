import { type NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mizizzi-ecommerce-1.onrender.com'

export async function GET(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  try {
    // Reconstruct the path from the route params
    const pathSegments = params.route || []
    const path = pathSegments.join('/')

    // Get the full query string from the request URL
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()

    const backendUrl = queryString
      ? `${API_BASE_URL}/api/products/${path}?${queryString}`
      : `${API_BASE_URL}/api/products/${path}`

    console.log('[v0] Proxying products request to backend:', backendUrl)

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    const data = await response.json().catch(() => ({}))

    console.log('[v0] Products API response status:', response.status)

    if (!response.ok) {
      console.error('[v0] Products API error:', data)
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || `Failed to fetch products with status ${response.status}`,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('[v0] Products API proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
