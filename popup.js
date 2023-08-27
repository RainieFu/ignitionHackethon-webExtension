  document.addEventListener("DOMContentLoaded", function () {
    const convertButton = document.getElementById("convert");
    const saveButton = document.getElementById("save")
    const savedPairsContainer = document.getElementById("saved_pairs");
    const savedPairs = JSON.parse(localStorage.getItem("savedPairs")) || [];
    // const historicalRecords = [];
    const showTrendButton = document.getElementById("showTrendButton");
    const chartCanvas = document.getElementById("exchangeRateChart");

    let selectedCurrencyFrom = "";
    let selectedCurrencyTo = "";
    let enterAmount = 0;
    displaySavedPairs();

    let convertedAmount = 0;

    convertButton.addEventListener("click", function () {
      selectedCurrencyFrom = document.getElementById("options").value;
      selectedCurrencyTo = document.getElementById("options2").value;
      enterAmount = parseFloat(document.getElementById("enter_amount").value);
       
      // Validate the user input
        if (!isValidFloat(enterAmount) || enterAmount==0) {
            alert("Please enter a valid numeric amount.");
            return; // Exit early if input is not valid
        }
        
      const apiKey = "1138a964ad30d631b12eb75e";
      const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${selectedCurrencyFrom}/${selectedCurrencyTo}/${enterAmount}`;
  
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.result === "success") {
            convertedAmount = data.conversion_result.toFixed(2);
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

    saveButton.addEventListener("click", function () {
        if (savedPairs.length >= 3) {
            alert("You can't save more than 3 pairs. Remove the saved ones first :)");
            return;
        }
        // Save historical record
        const record = {
            source: selectedCurrencyFrom,
            amount: (convertedAmount/enterAmount).toFixed(2), 
            target: selectedCurrencyTo
        };
        // historicalRecords.push(record);

        // Save the current pairs to savedPairs
        const pair = `${record.source} 1 -> ${record.amount}${record.target}`;
        if (!savedPairs.includes(pair) && savedPairs.length < 4) {
          savedPairs.push(pair);
          localStorage.setItem("savedPairs", JSON.stringify(savedPairs));

        

        displaySavedPairs();
        }

    });

    function displaySavedPairs() {
        savedPairsContainer.innerHTML = "";
    
        // savedPairs.forEach(pair => {
        //   const pairElement = document.createElement("div");
        //   pairElement.textContent = pair;

        //   const removeButton = document.createElement("button");
        //   removeButton.textContent = "Remove";
        //   removeButton.addEventListener("click", () => {
        //      removeSavedPair(index);

        //      displaySavedPairs();
        //  });

         savedPairs.forEach((pair, index) => {
            const pairElement = document.createElement("div");
            pairElement.textContent = pair;
    
            // Add a remove button for each record
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => {
                removeSavedPair(index); // Pass the correct index value
            });
    
            pairElement.appendChild(removeButton);
    
            savedPairsContainer.appendChild(pairElement);
        });   
    
        // Display historical records
        // historicalRecords.slice(0, 10).forEach(record => {
        //   const recordElement = document.createElement("div");
        //   recordElement.textContent = `${record.source} 1 -> ${record.amount} ${record.target}`;
        //   savedPairsContainer.appendChild(recordElement);
        // });

      }

    function removeSavedPair(index) {
        savedPairs.splice(index, 1);
        localStorage.setItem("savedPairs", JSON.stringify(savedPairs));
        displaySavedPairs();
    }

    showTrendButton.addEventListener("click", async function () {
        const apiKey2 = "ef97474c6087e284795cd4f0";
        const currentDate = new Date();
        const chartLabels = [];
        const chartData = [];

        for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - daysAgo);

            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Month is zero-based
            const day = date.getDate();

            const apiUrl2 = `https://v6.exchangerate-api.com/v6/${apiKey2}/history/${selectedCurrencyFrom}/${year}/${month}/${day}`;
            
            try {
                const response = await fetch(apiUrl2);
                const data = await response.json();

                if (data.result === "success") {
                    chartLabels.push(`${month}/${day}`);
                    chartData.push(data.conversion_rates[selectedCurrencyFrom]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        // Create a line chart using Chart.js
        const exchangeRateChart = new Chart(chartCanvas, {
            type: "line",
            data: {
                labels: chartLabels,
                datasets: [{
                    label: `${selectedCurrencyFrom} Exchange Rate Trend`,
                    data: chartData,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    });

  });