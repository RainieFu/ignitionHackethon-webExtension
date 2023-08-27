  document.addEventListener("DOMContentLoaded", function () {
    const convertButton = document.getElementById("convert");
    const saveButton = document.getElementById("save")
    const savedPairsContainer = document.getElementById("saved_pairs");
    const savedPairs = JSON.parse(localStorage.getItem("savedPairs")) || [];
    // const historicalRecords = [];

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
        // Save historical record
        const record = {
            source: selectedCurrencyFrom,
            amount: (convertedAmount/enterAmount).toFixed(2), 
            target: selectedCurrencyTo
        };
        // historicalRecords.push(record);

        // Save the current pairs to savedPairs
        const pair = `${record.source} 1 -> ${record.amount}${record.target}`;
        if (!savedPairs.includes(pair) && savedPairs.length < 10) {
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
  });