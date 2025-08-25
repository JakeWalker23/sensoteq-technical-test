# Sensoteq Technical Test - Full Stack Engineer

![alt text](screenshot.png)


## Tech Stack
###  Backend
 - Typescript
 - Express
 - Keysely

###  Frontend
  - React
  - Radix UI


### To Build && Run:
```
docker compose up -d --build 
```

### To Test
```
cd backend
pnpm run test
```


# API Overview

```
GET /films?category_name=Action
```

curl -s "http://localhost:3000/films?category_name=Action" | jq


```
GET /films/search?title=to&length=60 
```

curl -s "http://localhost:3000/films/search?title=to&length=60" | jq



```
POST /customer 

BODY { 
    "store_id": 1,
    "first_name": "Ada",
    "last_name": "Lovelace",
    "email": "ada.lovelace@example.com",
    "phone": "0123456789",
    "address": "123 Algorithm Ave",
    "address2": "Apt 42",
    "district": "Antrim",
    "city_id": 1,
    "postal_code": "BT1 1AA"
}
```

curl -s -X POST "http://localhost:3000/customers" \
  -H "Content-Type: application/json" \
  -d '{
    "store_id": 1,
    "first_name": "Ada",
    "last_name": "Lovelace",
    "email": "ada.lovelace@example.com",
    "phone": "0123456789",
    "address": "123 Algorithm Ave",
    "address2": "Apt 42",
    "district": "Antrim",
    "city_id": 1,
    "postal_code": "BT1 1AA"
  }' | jq



```
DELETE /customer/:customerid 
```

curl -i -X DELETE "http://localhost:3000/customers/40"






So much to do in so little time. I will keep pushing to this repo until its complete, so please give me a additional day or 2 to finish this off.