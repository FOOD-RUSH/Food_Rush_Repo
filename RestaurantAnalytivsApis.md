API DOCUMENTATION FOR RESTAURANT ANALYTICS 

1. analytics/restaurants/my/summary
paramters 

from : ISO date-time start (defaults to last 30 days)
to: ISO date-time end (defaults to now)


return example
{
  "status_code": 200,
  "message": "Resource retrieved successfully",
  "data": {
    "revenueCollected": 0,
    "gmv": 38500,
    "aov": 9625,
    "counts": {
      "total": 20,
      "pending": 0,
      "confirmed": 4,
      "outForDelivery": 0,
      "completed": 0,
      "cancelled": 16
    },
    "paymentMethod": {
      "mobile_money": 20,
      "cash_on_delivery": 0
    },
    "operator": {
      "mtn": 0,
      "orange": 0
    },
    "acceptanceRate": 1
  }
}



2./api/v1/analytics/restaurants/my/balance

parameter: none

example return 
{
  "status_code": 200,
  "message": "Resource retrieved successfully",
  "data": {
    "balance": 0,
    "credits": 0,
    "debits": 0,
    "currency": "XAF"
  }
}

3. /api/v1/analytics/restaurants/my/revenue/bucketed

paramters
from (string)
to (string)

period (strings - dailym weekly, monthly)
example return 
[
  {
    "day": "2025-09-18T00:00:00.000Z",
    "revenue": 25000,
    "count": 8
  }
] or when enpty

{
  "status_code": 200,
  "message": "Resource retrieved successfully",
  "data": []
}

