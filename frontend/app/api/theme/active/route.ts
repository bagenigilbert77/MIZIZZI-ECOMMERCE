import { type NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mizizzi-ecommerce-1.onrender.com'

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] Proxying theme active request to backend:', `${API_BASE_URL}/api/theme/active`)

    const response = await fetch(`${API_BASE_URL}/api/theme/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    const data = await response.json().catch(() => ({}))

    console.log('[v0] Theme API response status:', response.status)

    if (!response.ok) {
      console.error('[v0] Theme API error:', data)
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || `Failed to fetch theme with status ${response.status}`,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('[v0] Theme API proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch theme',
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
