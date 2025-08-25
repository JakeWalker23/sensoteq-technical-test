# Sensoteq Technical Test


## Tech Stack
- Node v ->
- pnpm


### To Build:
```
pnpm run build
```

### To Test
```
pnpm run test
```


### To Run:
```
pnpm run 
```



# Overview

```
GET /films?category=Action
```

curl -s http://localhost:3000/films?category=Action



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

curl -s -X POST http://localhost:3000/customers \
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

curl -i -X DELETE http://localhost:3000/customers/40
