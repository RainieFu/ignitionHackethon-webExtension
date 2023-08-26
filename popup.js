document.addEventListener("DOMContentLoaded", function () {
  const showPriceButton = document.getElementById("show_price");
  const enterStockInput = document.getElementById("enter_stock");
  const priceDisplay = document.getElementById("price");

  showPriceButton.addEventListener("click", async function () {
    const stockSymbol = enterStockInput.value;

    try {
      const apiUrl = `https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quote where symbol = "${stockSymbol}"&format=json&env=store://datatables.org/alltableswithkeys`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.query.count === 1) {
        const stockInfo = data.query.results.quote;
        const stockPrice = parseFloat(stockInfo.LastTradePriceOnly);

        priceDisplay.innerText = `Price: ${stockPrice}`;
      } else {
        priceDisplay.innerText = "Invalid stock symbol";
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      priceDisplay.innerText = "Error fetching data";
    }
  });
});