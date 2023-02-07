
# 🔨 A toolkit of SMS verification clients for Typescript. 

This package provides simple wrappers for the usage of SMS verification clients in Node.js. 
Included is `Watcher`, a simple tool to wait for and match received messages.

## Supported clients:

- [Truverifi](https://truverifi.com/)
- [Textverified](https://textverified.com/) *coming soon*
- [SMSPVA](https://smspva.com/) *coming soon*

## Client usage

### Install the package:
```
yarn add sms-toolkit 
```
### Initialize a client:
```ts
import { Truverifi, TRUVERIFI_SERVICES } from "sms-toolkit";

const client = new Truverifi(
	/* API Key */
	process.env.TRUVERIFI_API_KEY,
	/* Verification target */
	TRUVERIFI_SERVICES.GOOGLE_GMAIL
);
```

### Start and claim a verification:
```ts
const phoneNumber = await client.startVerification();
// Receive SMS
const messages = await client.claimVerification();
``` 

## Watcher usage

### Initialize Watcher:

```ts
const watcher = new Watcher(client);
```

### Wait for messages:

```ts
const newMessage = await watcher.waitForVerification();
```
---
Inspired by [sms](https://github.com/saucesteals/sms).
Created under the MIT license.