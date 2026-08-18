# API Documentation

## Overview

The Trading Control Platform provides a comprehensive REST API for managing trading accounts, trades, risk settings, and integrations.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All endpoints (except `/auth/*`) require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register

```
POST /auth/register

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "uuid",
  "email": "user@example.com",
  "name": "John Doe"
}
```

#### Login

```
POST /auth/login

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "uuid",
  "email": "user@example.com"
}
```

### Accounts

#### Get All Accounts

```
GET /accounts

Response:
[
  {
    "id": "uuid",
    "name": "My Trading Account",
    "broker": "FundedNext",
    "account_type": "Challenge",
    "balance": 10000.00,
    "status": "active",
    "created_at": "2024-01-01T12:00:00Z"
  }
]
```

#### Create Account

```
POST /accounts

Body:
{
  "name": "My Trading Account",
  "broker": "FundedNext",
  "broker_account_id": "ABC123",
  "account_type": "Challenge"
}

Response:
{
  "id": "uuid",
  "name": "My Trading Account",
  "broker": "FundedNext",
  "account_type": "Challenge",
  "status": "active",
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Trades

#### Get Trades by Account

```
GET /trades/account/:accountId?limit=50&offset=0

Response:
[
  {
    "id": "uuid",
    "symbol": "EURUSD",
    "direction": "BUY",
    "entry_price": 1.0800,
    "exit_price": 1.0820,
    "quantity": 1,
    "pnl": 20.00,
    "entry_time": "2024-01-01T09:00:00Z",
    "exit_time": "2024-01-01T10:00:00Z"
  }
]
```

#### Get Trade Analytics

```
GET /trades/analytics/:accountId

Response:
{
  "total_trades": 50,
  "wins": 35,
  "losses": 15,
  "win_rate": "70.00",
  "total_pnl": 5000.00,
  "avg_pnl": 100.00,
  "max_win": 500.00,
  "max_loss": -250.00
}
```

### Subscriptions

#### Get Current Subscription

```
GET /subscriptions

Response:
{
  "tier": "professional",
  "status": "active",
  "stripe_id": "sub_...",
  "expires_at": "2024-02-01T12:00:00Z"
}
```

#### Create Subscription

```
POST /subscriptions/create

Body:
{
  "tier": "professional",
  "payment_method_id": "pm_..."
}

Response:
{
  "subscription": "sub_...",
  "tier": "professional",
  "status": "active"
}
```

### Integrations

#### FundedNext - Connect

```
POST /integrations/fundednext/connect

Body:
{
  "auth_code": "...",
  "account_name": "My FundedNext Account"
}

Response:
{
  "integration_id": "uuid",
  "status": "connected"
}
```

#### FundedNext - Sync Trades

```
POST /integrations/fundednext/sync/:integrationId

Response:
{
  "synced": 25,
  "status": "success"
}
```

## Error Handling

All errors return a JSON response with an error message:

```
{
  "error": "Error message here"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Rate Limiting

- API calls are limited to 1000 per hour per user
- Rate limit headers are included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
