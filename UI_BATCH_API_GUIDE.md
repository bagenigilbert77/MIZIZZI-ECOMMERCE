# Unified UI Batch API Guide

## Overview

The Unified UI Batch API consolidates all UI component data (carousel, topbar, categories, and side panels) into a single high-performance API endpoint with parallel query execution.

**Benefits:**
- ✅ Single HTTP request instead of 4-5 separate requests
- ✅ Parallel backend execution (~150ms instead of 500-800ms)
- ✅ Reduced network overhead (1 request vs 5)
- ✅ Automatic Redis caching with TTL management
- ✅ Health monitoring and performance metrics

---

## API Endpoints

### 1. **Get All UI Data (Unified)**

**Endpoint:** `GET /api/ui/batch`

**Description:** Fetches all UI sections in parallel with a single request.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cache` | string | `true` | Enable/disable caching (`true` or `false`) |
| `sections` | string | `all` | Comma-separated sections: `carousel,topbar,categories,side_panels` |

**Request Examples:**

```bash
# Get all UI data (cached)
curl http://localhost:5000/api/ui/batch

# Get specific sections
curl "http://localhost:5000/api/ui/batch?sections=carousel,categories"

# Bypass cache
curl "http://localhost:5000/api/ui/batch?cache=false"
```

**Response Example:**

```json
{
  "timestamp": "2024-03-04T10:30:00Z",
  "total_execution_ms": 145,
  "cached": false,
  "sections": {
    "carousel": {
      "data": {
        "homepage": [
          {
            "id": 1,
            "name": "Spring Banner",
            "title": "New Spring Collection",
            "description": "Fresh arrivals for the season",
            "image_url": "https://...",
            "button_text": "Shop Now",
            "link_url": "/products?collection=spring",
            "discount": "30%",
            "sort_order": 1
          }
        ],
        "category_page": [...],
        "flash_sales": [...],
        "luxury_deals": [...]
      },
      "count": 20,
      "success": true
    },
    "topbar": {
      "slides": [
        {
          "id": 1,
          "campaign": "Free Shipping This Week",
          "subtext": "On orders over $50",
          "bg_color": "#000000",
          "product_image_url": "https://...",
          "button_text": "Learn More",
          "button_link": "/info/shipping",
          "sort_order": 1,
          "is_active": true
        }
      ],
      "count": 3,
      "success": true
    },
    "categories": {
      "featured": [
        {
          "id": 1,
          "name": "Electronics",
          "slug": "electronics",
          "description": "Latest tech",
          "image_url": "https://...",
          "products_count": 150
        }
      ],
      "root": [
        {
          "id": 1,
          "name": "Electronics",
          "slug": "electronics",
          "products_count": 150,
          "subcategories_count": 8
        }
      ],
      "featured_count": 5,
      "root_count": 12,
      "success": true
    },
    "side_panels": {
      "data": {
        "product_showcase_left": [
          {
            "id": 1,
            "title": "Premium Audio",
            "metric": "300+ Reviews",
            "icon_name": "headphones",
            "image_url": "https://...",
            "gradient": "from-blue-500 to-purple-600",
            "sort_order": 1
          }
        ],
        "product_showcase_right": [...],
        "premium_experience_left": [...],
        "premium_experience_right": [...]
      },
      "count": 8,
      "success": true
    }
  },
  "meta": {
    "sections_fetched": 4,
    "parallel_execution": true,
    "cache_key": "batch:ui_all_combined"
  }
}
```

---

### 2. **Health Check & Metrics**

**Endpoint:** `GET /api/ui/batch/status`

**Description:** Check the health of the unified batch endpoint and all dependent services.

**Response Example:**

```json
{
  "status": "healthy",
  "database": {
    "carousel": "connected",
    "topbar": "connected",
    "categories": "ok",
    "side_panels": "connected"
  },
  "cache": "connected",
  "endpoint": "/api/ui/batch",
  "sections_available": [
    "carousel",
    "topbar",
    "categories",
    "side_panels"
  ],
  "cache_ttls": {
    "carousel": 60,
    "topbar": 120,
    "categories": 300,
    "side_panels": 300,
    "combined": 60
  },
  "timestamp": "2024-03-04T10:30:00Z"
}
```

---

## Migration Guide

### Before (Multiple Requests)
```javascript
// Old approach - 4-5 separate API calls
const [carousel, topbar, categories, sidePanels] = await Promise.all([
  fetch('/api/carousel/items').then(r => r.json()),
  fetch('/api/topbar/slides').then(r => r.json()),
  fetch('/api/categories/featured').then(r => r.json()),
  fetch('/api/panels/items').then(r => r.json())
]);
```

**Performance:** ~500-800ms (sequential + parallel overhead)

### After (Single Unified Request)
```javascript
// New approach - 1 API call, parallel execution
const uiData = await fetch('/api/ui/batch').then(r => r.json());

const carousel = uiData.sections.carousel;
const topbar = uiData.sections.topbar;
const categories = uiData.sections.categories;
const sidePanels = uiData.sections.side_panels;
```

**Performance:** ~150-250ms (parallel execution + network)

---

## Cache Management

### Cache TTLs
- **Carousel:** 60 seconds (frequent changes)
- **Topbar:** 120 seconds (promotional content)
- **Categories:** 300 seconds (5 minutes - stable data)
- **Side Panels:** 300 seconds (5 minutes - stable data)
- **Combined:** 60 seconds (freshest data)

### Invalidating Cache

```bash
# Bypass cache for one request
curl "http://localhost:5000/api/ui/batch?cache=false"

# Check cache status
curl "http://localhost:5000/api/ui/batch/status"
```

### Cache Keys
- `batch:carousel` - Carousel data
- `batch:topbar` - Topbar slides
- `batch:categories` - Categories data
- `batch:side_panels` - Side panels data
- `batch:ui_all_combined` - All combined (uses 60s TTL for freshness)

---

## Implementation Details

### Parallel Execution
The endpoint uses `ThreadPoolExecutor` to execute all 4 queries simultaneously:

```python
with ThreadPoolExecutor(max_workers=8) as executor:
    futures = {
        executor.submit(fetch_carousel): 'carousel',
        executor.submit(fetch_topbar): 'topbar',
        executor.submit(fetch_categories): 'categories',
        executor.submit(fetch_side_panels): 'side_panels'
    }
    
    for future in as_completed(futures):
        # Results collected as they complete
```

### Performance Profile
- **Database queries:** 100-150ms (parallel)
- **Serialization:** 10-20ms
- **Caching:** 5-10ms
- **Network:** 30-50ms
- **Total:** 145-250ms (vs 500-800ms for sequential requests)

---

## Error Handling

If any section fails, it returns with `success: false` and an error message:

```json
{
  "timestamp": "2024-03-04T10:30:00Z",
  "total_execution_ms": 95,
  "cached": false,
  "sections": {
    "carousel": {
      "data": {...},
      "count": 20,
      "success": true
    },
    "topbar": {
      "slides": [],
      "error": "Database connection failed",
      "success": false
    }
  }
}
```

---

## Frontend Integration Examples

### React Hook
```javascript
import { useEffect, useState } from 'react';

function useUIData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/ui/batch')
      .then(r => r.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

// Usage
function HomePage() {
  const { data, loading } = useUIData();
  
  if (loading) return <Skeleton />;
  if (!data) return <Error />;
  
  return (
    <>
      <Carousel items={data.sections.carousel.data} />
      <TopBar slides={data.sections.topbar.slides} />
      <Categories categories={data.sections.categories} />
      <SidePanels panels={data.sections.side_panels.data} />
    </>
  );
}
```

### SWR Hook (Recommended)
```javascript
import useSWR from 'swr';

function HomePage() {
  const { data, isLoading } = useSWR('/api/ui/batch', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000 // Match cache TTL
  });

  if (isLoading) return <Skeleton />;
  
  return (
    <div>
      <Carousel items={data?.sections?.carousel?.data} />
      <TopBar slides={data?.sections?.topbar?.slides} />
    </div>
  );
}
```

---

## Monitoring

### Check Health Status
```bash
curl http://localhost:5000/api/ui/batch/status | jq
```

### Monitor Performance
Track the `total_execution_ms` field in responses to monitor API performance over time.

### Enable Debug Logging
```python
# In your Flask app
app.logger.setLevel(logging.DEBUG)
```

---

## FAQ

**Q: What if one section fails?**
A: The endpoint returns all available sections and marks failed sections with `success: false`. Your frontend can handle partial failures gracefully.

**Q: Can I cache different sections with different TTLs?**
A: Currently, the combined response uses a 60s TTL. Individual sections cache at their configured TTLs but are re-fetched if the combined cache expires.

**Q: Why is the carousel data organized by position?**
A: Carousels exist at multiple positions (homepage, category_page, flash_sales, luxury_deals). The response structure mirrors this organization for clarity.

**Q: How do I invalidate specific sections?**
A: Use `?cache=false` to bypass all caches. To invalidate individual sections, you'd need to clear Redis keys directly (future enhancement).

---

## Troubleshooting

### High Execution Times (> 500ms)
- Check database connectivity: `GET /api/ui/batch/status`
- Verify Redis cache is connected
- Check database load and query performance
- Monitor concurrent request volume

### Some Sections Missing Data
- Check if the required models exist in your database
- Verify tables are properly migrated
- Review section-specific logs for errors

### Cache Not Working
- Verify Redis connection: `GET /api/ui/batch/status`
- Check `cache` parameter is `true` (default)
- Monitor cache hit/miss ratio in production

---

## Future Enhancements

- [ ] Selective section caching with different TTLs
- [ ] Conditional cache invalidation
- [ ] Real-time section updates via WebSocket
- [ ] Per-section permissions/visibility
- [ ] A/B testing support for carousel variants
