//Calls Alpha Vantage
async function fetchStockData(symbol) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  //Validates response
  if (!data["Time Series (Daily)"]) {
    throw new Error("Invalid API response or rate limit hit");
  }
  //Returns only daily price data
  return data["Time Series (Daily)"];
}

// Extract Current High & Current Price
function getLatestDayData(timeSeries) {
  const dates = Object.keys(timeSeries);
  const latestDate = dates[0]; // Alpha Vantage returns newest first

  const latestData = timeSeries[latestDate];

  return {
    date: latestDate,
    currentHigh: parseFloat(latestData["2. high"]),
    currentPrice: parseFloat(latestData["4. close"]),
  };
}

//Caculate six months low
function getSixMonthLow(timeSeries) {
  const dates = Object.keys(timeSeries).slice(0, 126);

  let lowestLow = Infinity;

  dates.forEach((date) => {
    const low = parseFloat(timeSeries[date]["3. low"]);
    if (low < lowestLow) {
      lowestLow = low;
    }
  });

  return lowestLow;
}

//Buy Zone Caculations
function calculateBuyZones(currentHigh, sixMonthLow) {
  const range = currentHigh - sixMonthLow;

  let buyZone1 = currentHigh - range * 0.382;
  let buyZone2 = currentHigh - range * 0.618;

  // Safety rule
  if (buyZone1 < sixMonthLow) buyZone1 = sixMonthLow;
  if (buyZone2 < sixMonthLow) buyZone2 = sixMonthLow;

  return {
    buyZone1: buyZone1.toFixed(2),
    buyZone2: buyZone2.toFixed(2),
  };
}

//When you hit Caculate button
async function calculateStock(symbol) {
  try {
    const timeSeries = await fetchStockData(symbol);

    const { currentHigh, currentPrice } = getLatestDayData(timeSeries);
    const sixMonthLow = getSixMonthLow(timeSeries);

    const { buyZone1, buyZone2 } = calculateBuyZones(currentHigh, sixMonthLow);

    console.log("Current Price:", currentPrice);
    console.log("Current High:", currentHigh);
    console.log("6-Month Low:", sixMonthLow);
    console.log("Buy Zone 1:", buyZone1);
    console.log("Buy Zone 2:", buyZone2);

    return {
      symbol,
      currentPrice,
      currentHigh,
      sixMonthLow,
      buyZone1,
      buyZone2,
    };
  } catch (error) {
    console.error(error.message);
  }
}
