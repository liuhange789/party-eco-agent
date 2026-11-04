# party-eco-agent

Party-building led street industry ecosystem collaboration plugin.

## Features

- **Enterprise Profiling** — Profile street-level enterprises with industry, scale, and credit data
- **Supply-Demand Matching** — Match supply and demand items by category and quantity
- **Policy Parsing** — Parse government policy documents into structured format
- **Grievance Dispatch** — Dispatch enterprise grievances by priority to appropriate assignees

## Usage

```js
import { profileEnterprise, matchSupplyDemand, parsePolicy, dispatchGrievance } from '@liuhange/party-eco-agent'

const enterprise = { id: 'E001', name: 'XX Bakery', industry: 'food', location: 'Main St', scale: 'small', creditLevel: 'A' }
console.log(profileEnterprise(enterprise))
```

## License

MIT
