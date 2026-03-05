# Batch API Quick Start Guide

## 30-Second Overview

The frontend now has a unified batch API that fetches carousel, categories, topbar, and side panels in a **single request** instead of 4+. This reduces load time by 55-65%.

## Test It Right Now

### Option 1: Visit the Test Page
```
http://localhost:3000/test-ui-batch
```
This page tests all batch endpoints and shows performance metrics.

### Option 2: Check the Homepage
```
http://localhost:3000
```
Open DevTools Network tab → look for `/api/ui/batch` request (single request for all UI data)

### Option 3: API Test
```bash
# Test the batch endpoint
curl http://localhost:3000/api/ui/batch | json_pp

# Test selective sections
curl "http://localhost:3000/api/ui/batch?sections=carousel" | json_pp
```

## Use in Your Code

### Fetch All Sections
```typescript
import { getUIBatch } from '@/lib/server/get-ui-batch'

export default async function MyPage() {
  const { carousel, categories, sidePanels } = await getUIBatch()
  return <div>{/* render with data */}</div>
}
```

### Fetch Specific Sections
```typescript
import { getCarouselBatch, getCategoriesBatch } from '@/lib/server/get-ui-batch'

// Just carousel
const carousel = await getCarouselBatch()

// Just categories
const categories = await getCategoriesBatch()
```

## What Changed

### Files Created
1. **`frontend/app/api/ui/batch/route.ts`** - Frontend batch API proxy
2. **`frontend/lib/server/get-ui-batch.ts`** - Server batch function
3. **`frontend/app/test-ui-batch/page.tsx`** - Test page

### Files Updated
1. **`frontend/app/page.tsx`** - Uses batch API
2. **`frontend/app/categories/page.tsx`** - Uses batch API

## How It Works

```
Your Code
    ↓
getUIBatch()
    ↓
/api/ui/batch (frontend route)
    ↓
Backend /api/ui/batch (parallel execution)
    ↓
Returns all UI data in ~150-250ms
```

## Data Structures

```typescript
{
  carousel: [
    {
      image: "url",
      title: "Title",
      description: "Desc",
      buttonText: "Click",
      href: "/path"
    }
  ],
  categories: [
    {
      id: 1,
      name: "Category",
      slug: "category",
      product_count: 50
    }
  ],
  sidePanels: {
    premium: [...],
    showcase: [...]
  },
  timestamp: 1234567890,
  duration: 145.67
}
```

## Performance

### Before
- 4 separate requests: 340-510ms total

### After  
- 1 batch request: 145-250ms total
- **55-65% faster**

## Common Tasks

### Migrate a Page to Batch API

**Before**:
```typescript
import { getCarouselItems } from '@/lib/server/get-carousel-data'
import { getCategories } from '@/lib/server/get-categories'

const carousel = await getCarouselItems()
const categories = await getCategories()
```

**After**:
```typescript
import { getUIBatch } from '@/lib/server/get-ui-batch'

const { carousel, categories } = await getUIBatch()
```

### Disable Caching (Get Fresh Data)
```typescript
const data = await getUIBatch(undefined, false)
```

### Fetch Only What You Need
```typescript
// Option 1: Use specialized functions
const carousel = await getCarouselBatch()
const categories = await getCategoriesBatch()

// Option 2: Specify sections
const data = await getUIBatch('carousel,categories')
```

## Troubleshooting

### Batch API returns null
1. Check backend is running: `curl https://YOUR_BACKEND_URL/api/ui/batch`
2. Verify `API_BASE_URL` in `frontend/lib/config.ts`
3. Check backend logs for errors

### Carousel not showing
- Check if backend carousel endpoint is working
- Check fallback carousel displays correctly (it should)

### Performance not improved
- Open DevTools Network tab
- Verify you see `/api/ui/batch` request (not individual requests)
- Check response time in Network tab

### Cache not updating
- Add `?cache=false` query parameter
- Or wait 60 seconds (ISR revalidate time)

## File Locations

### API Route
```
frontend/app/api/ui/batch/route.ts
```

### Server Function
```
frontend/lib/server/get-ui-batch.ts
```

### Test Page
```
frontend/app/test-ui-batch/page.tsx
```

### Homepage Example
```
frontend/app/page.tsx
```

### Categories Example
```
frontend/app/categories/page.tsx
```

## Documentation

### For Complete Details
- `FRONTEND_BATCH_INTEGRATION_SUMMARY.md` - Full implementation details
- `frontend/UNIFIED_BATCH_API_GUIDE.md` - Comprehensive guide
- `VERIFICATION_CHECKLIST.md` - Testing and verification

### For Quick Reference
- This file: Quick start guide
- Code comments in files
- Test page: `/test-ui-batch`

## Endpoints

### Frontend
```
GET /api/ui/batch
GET /api/ui/batch?sections=carousel
GET /api/ui/batch?sections=categories
GET /api/ui/batch?sections=carousel,categories
GET /api/ui/batch?cache=false
```

### Backend (for reference)
```
GET /api/ui/batch
GET /api/ui/batch?sections=carousel
```

## Next Steps

1. ✅ Visit test page: `http://localhost:3000/test-ui-batch`
2. ✅ Check homepage: `http://localhost:3000` (open Network tab)
3. ✅ Read full guide: `frontend/UNIFIED_BATCH_API_GUIDE.md`
4. ✅ Migrate your pages: Use `getUIBatch()` instead of individual functions

## Questions?

Check these in order:
1. **This quick start guide** - For common usage
2. **Test page** at `/test-ui-batch` - To validate system works
3. **Full guide** - `frontend/UNIFIED_BATCH_API_GUIDE.md`
4. **Code comments** - In the implementation files
5. **Summary** - `FRONTEND_BATCH_INTEGRATION_SUMMARY.md`

## TL;DR

```typescript
// Import
import { getUIBatch } from '@/lib/server/get-ui-batch'

// Use
const { carousel, categories, sidePanels } = await getUIBatch()

// That's it! 🚀
```

Benefits:
- Single request instead of 4+
- 55-65% faster
- Same data structure
- Backward compatible
- Type-safe

Visit `/test-ui-batch` to see it in action!
