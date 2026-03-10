# This package is deprecated!

https://github.com/Sparticuz/usps-webtools-promise/issues/27#issuecomment-4031656196 Thanks @jtalk22!

> Update: The Web Tools platform was **fully retired on January 25, 2026**. All endpoints this package uses now return errors — the password requirement discussed here was the precursor to the complete shutdown.
> 
> For anyone migrating from `usps-webtools-promise` (or `usps-webtools`) to the new USPS v3 REST API:
> 
> **Node.js migration path:**
>
> ```typescript
> // Old (usps-webtools-promise — no longer works)
> const USPS = require('usps-webtools-promise');
> const usps = new USPS({ userId: 'YOUR_USERID' });
> const result = await usps.verify({ street1: '1600 Pennsylvania Ave NW', city: 'Washington', state: 'DC', zip: '20500' });
> ```
> ```typescript
> // New (direct v3 API)
> const token = await fetch('https://apis.usps.com/oauth2/v3/token', {
>   method: 'POST',
>   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
>   body: new URLSearchParams({
>     grant_type: 'client_credentials',
>     client_id: process.env.USPS_CLIENT_ID,
>     client_secret: process.env.USPS_CLIENT_SECRET,
>     scope: 'addresses tracking prices'
>   })
> }).then(r => r.json()).then(d => d.access_token);
> 
> const result = await fetch('https://apis.usps.com/addresses/v3/address?' + new URLSearchParams({
>   streetAddress: '1600 Pennsylvania Ave NW',
>   city: 'Washington',
>   state: 'DC',
>   ZIPCode: '20500'
> }), {
>   headers: { Authorization: `Bearer ${token}` }
> }).then(r => r.json());
> ```
> Or use the `usps-v3` npm package which handles OAuth token management and caching:
> 
> `npm install usps-v3`
> ```typescript
> import { USPSClient } from 'usps-v3';
> const client = new USPSClient({ clientId: '...', clientSecret: '...' });
> const result = await client.addresses.validate({
>   streetAddress: '1600 Pennsylvania Ave NW',
>   city: 'Washington',
>   state: 'DC',
>   ZIPCode: '20500',
> });
> ```
> Register for new OAuth credentials at [developer.usps.com](https://developer.usps.com) (free, replaces the old USERID registration).
> 
> Full endpoint mapping from Web Tools → v3: [revaddress.com/blog/usps-web-tools-endpoint-mapping](https://revaddress.com/blog/usps-web-tools-endpoint-mapping)

### About:

This package was forked from [MadisonReed/usps-webtools](https://github.com/MadisonReed/usps-webtools), but it has been modernized with Typescript and Promises (async/await). Note: Version 2 is a drop-in replacement for MadisonReed/usps-webtools, it produces the same output. Version 3 uses the same output from USPS, with the exception of Address1 and Address2 being switched, per social norms.

### Installation:

```sh
npm install usps-webtools-promise
```

### Usage:

Initializing the usps model with a user id.

**Example:**

```js
const USPS = require("usps-webtools-promise").default;
// or
import USPS from "usps-webtools-promise";

const usps = new USPS({
  // USPS returns ALL CAPS, this boolean turns on Proper Caps for both Street lines and City. This is an optional item. Defaults to true.
  properCase: boolean,
  // Staging will run all functions on the USPS Staging servers instead of Production. Defaults to false.
  staging: boolean,
  // This can be created by going to https://www.usps.com/business/web-tools-apis/ and registering for an id
  userId: "USPS User id",
});
```

### verifyMultiple(object[])

Verify takes one parameter: object[]

object[]: [{Address1, Address2, City, State, Zip}]  

**Example**

```js
usps
  .verifyMultiple([{
    Address1: "322 3rd st.",
    Address2: "Apt 2",
    City: "San Francisco",
    State: "CA",
    Zip5: "94103",
  }, {
    Address1: "322 3rd st.",
    Address2: "Apt 2",
    City: "San Francisco",
    State: "CA",
    Zip5: "94103",
  }
  ])
  .then((address) => {
    console.log(address);
  });
```

### verify(object)

Verify takes one parameter: object

object: Address1, Address2, City, State, Zip

**Example**

```js
usps
  .verify({
    Address1: "322 3rd st.",
    Address2: "Apt 2",
    City: "San Francisco",
    State: "CA",
    Zip5: "94103",
  })
  .then((address) => {
    console.log(address);
  });
```

### zipCodeLookup(object)

zipCodeLookup takes one parameter: object.

object: Address1, Address2, City, State

**Example**

```js
const address = await usps.zipCodeLookup({
  Address1: "322 3rd st.",
  Address2: "Apt 2",
  City: "San Francisco",
  State: "CA",
});

console.log(address);
```

### cityStateLookup(object)

cityStateLookup takes one parameter: zipcode.

zipcode: 5 digit Zip Code as a string

**Example**

```js
const result = await usps.cityStateLookup("94107");
console.log(result);
```

### Coverage

```
-------------------------------|---------|----------|---------|---------|------------------------------
File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------------|---------|----------|---------|---------|------------------------------
All files                      |   91.64 |    62.65 |   93.75 |   91.64 |
 src                           |   95.85 |    55.55 |     100 |   95.85 |
  address-validate.ts          |      96 |     37.5 |     100 |      96 | 81,84,87,93
  multiple-address-validate.ts |   92.77 |    54.54 |     100 |   92.77 | 62,65,68,80-82
  usps.ts                      |     100 |      100 |     100 |     100 |
 src/lookups                   |   84.81 |    66.66 |   83.33 |   84.81 |
  city-state-lookup.ts         |     100 |    83.33 |     100 |     100 | 45
  pricing-rate-lookup.ts       |   74.49 |      100 |      50 |   74.49 | 112-149
  zip-code-lookup.ts           |   95.83 |    54.54 |     100 |   95.83 | 57,60,63
 src/utils                     |   95.65 |       75 |     100 |   95.65 |
  proper-case.ts               |     100 |      100 |     100 |     100 |
  request.ts                   |   94.23 |    64.28 |     100 |   94.23 | 54-55,61,112,122-123,127-129
-------------------------------|---------|----------|---------|---------|------------------------------
```
