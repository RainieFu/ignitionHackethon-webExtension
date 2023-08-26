  document.addEventListener("DOMContentLoaded", function () {
    const convertButton = document.getElementById("convert");
  
    convertButton.addEventListener("click", function () {
      const selectedCurrencyFrom = document.getElementById("options").value;
      const selectedCurrencyTo = document.getElementById("options2").value;
      const enterAmount = parseFloat(document.getElementById("enter_amount").value);
  
      const apiKey = "1138a964ad30d631b12eb75e";
      const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${selectedCurrencyFrom}/${selectedCurrencyTo}/${enterAmount}`;
  
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.result === "success") {
            const convertedAmount = data.conversion_result.toFixed(2);
            document.getElementById("converted").value = convertedAmount;
          } else {
            console.error("Error converting amount");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
  });