  document.addEventListener("DOMContentLoaded", function () {
    const convertButton = document.getElementById("convert");
  
    convertButton.addEventListener("click", function () {
      const selectedCurrencyFrom = document.getElementById("options").value;
      const selectedCurrencyTo = document.getElementById("options2").value;
      const enterAmount = parseFloat(document.getElementById("enter_amount").value);
       
      // Validate the user input
        if (!isValidFloat(enterAmount)) {
            alert("Please enter a valid numeric amount.");
            return; // Exit early if input is not valid
        }
        
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

    function isValidFloat(input) {
        return /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(input);
        }
    });
  });