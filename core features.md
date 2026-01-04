# Core Features

- Input for stock ticket
- Button "Caculate Buy Zones"

## Data pulled

- OHLC (Open, High, Low, Close) prices (at least 6 months)
- Current Price

## Caculations

- Current High
- Six month low
- Range
- Buy Zone 1
- Buy Zone 2

---

## Outputs (Display to User)

### Stock Summary

- Ticker
- Current Price
- Six month low

**Buy Zone**

- Buy Zone 1 (Moderate upper tier)
- Buy Zone 2 (Aggressive lower tier)

# Rules

Case rules:

**Invalid ticker**

Show Error: "Ticker not found. Please try again"

**Not enough data**

- If < 6 months of data exists
- Show message: “Not enough historical data to calculate buy zones.”

---

# Formula

## Data Definitions

- Ticker = User input (e.g.APPL)
- Current High (CH) = Today's high price
- Six month low (L) = Lowest daily low in the past 6 months
- Range (R) = CH - L

### Buy Zone Caculations

Slight Pull back

`Buy Zone 1 = CH - (R x 0.382)`

Big Pull back

`Buy Zone 2 = CH - (R x 0.618)`

### Rules

1. Buy zone can not be below six months low

`if (zone < sixMonthLow) zone = sixMonthLow;`

2. If current price is below the zone"

**Notify the user :**
"Price is already below the buy zone"
