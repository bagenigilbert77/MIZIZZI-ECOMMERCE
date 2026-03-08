// Centralized API configuration

// Backend URL for server-side requests
export const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://mizizzi-ecommerce-1.onrender.com"

// For client-side requests, use local proxies to avoid CORS issues
// For server-side requests, use the full backend URL
export const API_BASE_URL =
  typeof window !== "undefined" ? "" : BACKEND_API_URL

// Debug: Log which URL is being used (only in development)
if (typeof window === "undefined" && process.env.NODE_ENV === "development") {
  console.log(
    "[v0] API_BASE_URL configured as:",
    process.env.NEXT_PUBLIC_API_URL 
      ? `NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`
      : process.env.NEXT_PUBLIC_BACKEND_URL
      ? `NEXT_PUBLIC_BACKEND_URL: ${process.env.NEXT_PUBLIC_BACKEND_URL}`
      : "Default Render URL: https://mizizzi-ecommerce-1.onrender.com"
  )
}

export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "wss://mizizzi-ecommerce-1.onrender.com"

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mizizzi-ecommerce-87pr-ffh57x9o6-jons-projects-a41f528c.vercel.app"

// Helper to construct API endpoints
export const getApiEndpoint = (path: string): string => {
  // For client-side, use local proxies (empty base URL)
  // For server-side, use backend URL
  const base = (typeof window !== "undefined" ? "" : BACKEND_API_URL).replace(/\/+$/, "") // Remove trailing slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${base}${cleanPath}`
}

export const getImageUrl = (url: string | undefined | null): string => {
  if (!url) return "/placeholder.svg"
  // Already absolute URL or data URL - return as is
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) return url
  // Relative URL starting with / - prepend base URL
  if (url.startsWith("/")) {
    return `${API_BASE_URL}${url}`
  }
  // If it's just a filename, assume it's in the uploads folder
  return `${API_BASE_URL}/api/uploads/product_images/${url}`
}

export const getUploadedImageUrl = (filename: string | undefined | null): string => {
  if (!filename) return "/placeholder.svg"
  if (filename.startsWith("http") || filename.startsWith("data:") || filename.startsWith("blob:")) return filename
  const cleanFilename = filename.split("/").pop() || filename
  return `${API_BASE_URL}/api/uploads/product_images/${cleanFilename}`
}
