const direction =
    document.getElementById("direction");

const goal =
    document.getElementById("goal");

const currency =
    document.getElementById("currency");

const amountInput =
    document.getElementById("amount");

const rateInput =
    document.getElementById("rate");

const saveRateButton =
    document.getElementById("saveRateButton");

const savedRateStatus =
    document.getElementById("savedRateStatus");

const calculateButton =
    document.getElementById("calculateButton");

const resetButton =
    document.getElementById("resetButton");

const copyResultButton =
    document.getElementById("copyResultButton");

const shareResultButton =
    document.getElementById("shareResultButton");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");

const message =
    document.getElementById("message");

const result =
    document.getElementById("result");

const amountLabel =
    document.getElementById("amountLabel");

const rateLabel =
    document.getElementById("rateLabel");

const historyList =
    document.getElementById("historyList");

const emptyHistory =
    document.getElementById("emptyHistory");

const menuButton =
    document.getElementById("menuButton");

const optionsMenu =
    document.getElementById("optionsMenu");

const menuHint =
    document.getElementById("menuHint");

const dismissMenuHintButton =
    document.getElementById("dismissMenuHint");

const rateToolsOption =
    document.getElementById("rateToolsOption");

const recordsOption =
    document.getElementById("recordsOption");

const appearanceOption =
    document.getElementById("appearanceOption");

const rateToolsPanel =
    document.getElementById("rateToolsPanel");

const closeRateToolsButton =
    document.getElementById("closeRateToolsButton");

const historySection =
    document.querySelector(".historySection");

const appearancePanel =
    document.getElementById("appearancePanel");

const closeAppearanceButton =
    document.getElementById("closeAppearanceButton");

const themeChoices =
    document.querySelectorAll(".themeChoice");

function applyTheme(theme) {
    const allowedThemes = [
        "blue",
        "emerald",
        "purple"
    ];

    const selectedTheme =
        allowedThemes.includes(theme)
            ? theme
            : "blue";

    document.body.dataset.theme =
        selectedTheme;

    localStorage.setItem(
        "fxColorTheme",
        selectedTheme
    );

    themeChoices.forEach(function(button) {
        const isSelected =
            button.dataset.theme ===
            selectedTheme;

        button.setAttribute(
            "aria-pressed",
            String(isSelected)
        );
    });
}


function loadTheme() {
    const savedTheme =
        localStorage.getItem("fxColorTheme");

    applyTheme(savedTheme || "blue");
}


function openAppearance() {
    closeOptionsMenu();
  
    rateToolsPanel.hidden = true;
    appearancePanel.hidden = false;

    appearancePanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function closeAppearance() {
    appearancePanel.hidden = true;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function dismissMenuHint() {
    menuHint.hidden = true;

    localStorage.setItem(
        "fxMenuHintDismissedV1",
        "true"
    );
}


function showMenuHint() {
    const wasDismissed =
        localStorage.getItem(
            "fxMenuHintDismissedV1"
        );

    if (wasDismissed === "true") {
        return;
    }

    menuHint.hidden = false;
}

function toggleOptionsMenu() {
    const isOpen = !optionsMenu.hidden;

  if (!isOpen) {
    dismissMenuHint();
  }

    optionsMenu.hidden = isOpen;

    menuButton.setAttribute(
        "aria-expanded",
        String(!isOpen)
    );

    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Open options"
            : "Close options"
    );
}

function closeOptionsMenu() {
    optionsMenu.hidden = true;

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    menuButton.setAttribute(
        "aria-label",
        "Open options"
    );
}


function openRateTools() {
    closeOptionsMenu();

    rateToolsPanel.hidden = false;
    appearancePanel.hidden = true;
  
    rateToolsPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function closeRateTools() {
    rateToolsPanel.hidden = true;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function openRecords() {
    closeOptionsMenu();

    rateToolsPanel.hidden = true;
  appearancePanel.hidden = true;
  

    historySection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function loadHistory() {
    const savedHistory =
        localStorage.getItem("fxCalculationHistory");

    if (savedHistory === null) {
        return [];
    }

    try {
        const parsedHistory =
            JSON.parse(savedHistory);

        if (Array.isArray(parsedHistory)) {
            return parsedHistory.slice(0, 5);
        }

        return [];
    } catch (error) {
        return [];
    }
}


let calculationHistory = loadHistory();
function loadSavedRates() {
    const savedRatesText =
        localStorage.getItem("fxSavedRates");

    if (savedRatesText === null) {
        return {};
    }

    try {
        const parsedRates =
            JSON.parse(savedRatesText);

        if (
            parsedRates !== null &&
            typeof parsedRates === "object" &&
            !Array.isArray(parsedRates)
        ) {
            return parsedRates;
        }

        return {};
    } catch (error) {
        return {};
    }
}


let savedRates = loadSavedRates();


function getValidNumber(inputValue) {
    const cleanedValue = inputValue.trim();

    const numberPattern =
        /^(\d+|\d{1,3}(,\d{3})+)(\.\d+)?$/;

    if (!numberPattern.test(cleanedValue)) {
        return null;
    }

    const number = Number(
        cleanedValue.replace(/,/g, "")
    );

    if (number <= 0) {
        return null;
    }

    return number;
}


function formatNumber(number) {
    return number.toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


function getTimestamp() {
    return new Date().toLocaleString(
        "en-JM",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );
}

function getSavedRateKey() {
    const rateType =
        direction.value === "jmd-to-foreign"
            ? "selling"
            : "buying";

    return currency.value + "-" + rateType;
}


function displaySavedRate() {
    const savedRate =
        savedRates[getSavedRateKey()];

    if (!savedRate) {
        savedRateStatus.textContent =
            "No saved rate for this selection.";

        return;
    }

    rateInput.value = savedRate.value;

    savedRateStatus.textContent =
        currency.value +
        " " +
        savedRate.type +
        " rate saved " +
        savedRate.updatedAt +
        ".";
}

  function saveCurrentRate() {
    const rate =
        getValidNumber(rateInput.value);

    if (rate === null) {
        message.textContent =
            "Enter a valid rate before saving.";

        return;
    }

    const rateType =
        direction.value === "jmd-to-foreign"
            ? "selling"
            : "buying";

    savedRates[getSavedRateKey()] = {
        value: rateInput.value.trim(),
        type: rateType,
        updatedAt: getTimestamp()
    };

    localStorage.setItem(
        "fxSavedRates",
        JSON.stringify(savedRates)
    );

    message.textContent = "";
    displaySavedRate();
}

function clearResult() {
    message.textContent = "";

    result.textContent =
        "Your result will appear here.";

    copyResultButton.textContent =
        "Copy result";
}


function updateLabels() {
    if (direction.value === "jmd-to-foreign") {
        rateLabel.textContent = "Selling rate";

        if (goal.value === "convert") {
            amountLabel.textContent = "JMD amount";

            amountInput.placeholder =
                "Example: 5,000.50";
        } else {
            amountLabel.textContent =
                "Desired " + currency.value + " amount";

            amountInput.placeholder =
                "Example: 500.00";
        }
    } else {
        rateLabel.textContent = "Buying rate";

        if (goal.value === "convert") {
            amountLabel.textContent =
                currency.value + " amount";

            amountInput.placeholder =
                "Example: 500.00";
        } else {
            amountLabel.textContent =
                "Desired JMD amount";

            amountInput.placeholder =
                "Example: 50,000.00";
        }
    }
}


function handleSelectionChange() {
    updateLabels();

    amountInput.value = "";
    rateInput.value = "";

    clearResult();
    displaySavedRate();
}


function resetCalculator() {
    direction.value = "jmd-to-foreign";
    goal.value = "convert";
    currency.value = "USD";

    amountInput.value = "";
    rateInput.value = "";

    updateLabels();
    clearResult();
    displaySavedRate();

    amountInput.focus();
}


function saveHistory() {
    localStorage.setItem(
        "fxCalculationHistory",
        JSON.stringify(calculationHistory)
    );
}


 function displayHistory() {
    historyList.innerHTML = "";

    if (calculationHistory.length === 0) {
        emptyHistory.style.display = "block";
        return;
    }

    emptyHistory.style.display = "none";

    calculationHistory.forEach(function(entry, index) {
        const historyItem =
            document.createElement("li");

        const historyText =
            document.createElement("span");

        const deleteButton =
            document.createElement("button");

        historyText.textContent = entry;

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className =
            "deleteHistoryButton";

        deleteButton.addEventListener(
            "click",
            function() {
                deleteHistoryItem(index);
            }
        );

        historyItem.appendChild(historyText);
        historyItem.appendChild(deleteButton);
        historyList.appendChild(historyItem);
    });
}

function deleteHistoryItem(index) {
    const shouldDelete = window.confirm(
        "Delete this transaction?"
    );

    if (!shouldDelete) {
        return;
    }

    calculationHistory.splice(index, 1);

    saveHistory();
    displayHistory();
}

function addToHistory(entry) {
    calculationHistory.unshift(entry);

    calculationHistory =
        calculationHistory.slice(0, 5);

    saveHistory();
    displayHistory();
}


function clearHistory() {
    calculationHistory = [];

    saveHistory();
    displayHistory();
}


function showCopySuccess() {
    copyResultButton.textContent = "Copied!";

    setTimeout(function() {
        copyResultButton.textContent =
            "Copy result";
    }, 1500);
}


function showCopyError() {
    message.textContent =
        "Your browser could not copy the result.";
}


function fallbackCopy(textToCopy) {
    const temporaryText =
        document.createElement("textarea");

    temporaryText.value = textToCopy;

    temporaryText.style.position = "fixed";
    temporaryText.style.opacity = "0";

    document.body.appendChild(temporaryText);

    temporaryText.focus();
    temporaryText.select();

    try {
        const successful =
            document.execCommand("copy");

        if (successful) {
            showCopySuccess();
        } else {
            showCopyError();
        }
    } catch (error) {
        showCopyError();
    }

    document.body.removeChild(temporaryText);
}

async function shareResult() {
    const resultText =
        result.textContent.trim();

    if (
        resultText ===
        "Your result will appear here."
    ) {
        message.textContent =
            "Calculate an amount before sharing.";

        return;
    }

    const shareText =
        "FX Calculator: " + resultText;

    if (!navigator.share) {
        try {
            await navigator.clipboard.writeText(
                shareText
            );

            message.textContent =
                "Sharing is unavailable here. " +
                "The result was copied instead.";
        } catch (error) {
            message.textContent =
                "Unable to share the result.";
        }

        return;
    }

    try {
        await navigator.share({
            title: "FX Calculator",
            text: shareText
        });
    } catch (error) {
        if (error.name !== "AbortError") {
            message.textContent =
                "Unable to share the result.";
        }
    }
}

function copyResult() {
    const resultText =
        result.textContent.trim();

    if (
        resultText ===
        "Your result will appear here."
    ) {
        message.textContent =
            "Calculate an amount before copying.";

        return;
    }

    const textToCopy =
        "FX Calculator: " + resultText;

    message.textContent = "";

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {
        navigator.clipboard
            .writeText(textToCopy)
            .then(showCopySuccess)
            .catch(function() {
                fallbackCopy(textToCopy);
            });
    } else {
        fallbackCopy(textToCopy);
    }
}


function calculateExchange() {
    message.textContent = "";

    const amount = getValidNumber(
        amountInput.value
    );

    const rate = getValidNumber(
        rateInput.value
    );

    if (amount === null) {
        message.textContent =
            "Please enter a valid amount.";

        result.textContent =
            "Your result will appear here.";

        return;
    }

    if (rate === null) {
        message.textContent =
            "Please enter a valid exchange rate.";

        result.textContent =
            "Your result will appear here.";

        return;
    }

    let calculatedAmount;
    let resultText;
    let historyText;

    if (
        direction.value === "jmd-to-foreign" &&
        goal.value === "convert"
    ) {
        calculatedAmount = amount / rate;

        resultText =
            "You would receive approximately " +
            currency.value +
            " " +
            formatNumber(calculatedAmount);

        historyText =
            "J$" +
            formatNumber(amount) +
            " → " +
            currency.value +
            " " +
            formatNumber(calculatedAmount);
    }

    if (
        direction.value === "jmd-to-foreign" &&
        goal.value === "needed"
    ) {
        calculatedAmount = amount * rate;

        resultText =
            "You would need approximately J$" +
            formatNumber(calculatedAmount);

        historyText =
            currency.value +
            " " +
            formatNumber(amount) +
            " wanted → J$" +
            formatNumber(calculatedAmount) +
            " needed";
    }

    if (
        direction.value === "foreign-to-jmd" &&
        goal.value === "convert"
    ) {
        calculatedAmount = amount * rate;

        resultText =
            "You would receive approximately J$" +
            formatNumber(calculatedAmount);

        historyText =
            currency.value +
            " " +
            formatNumber(amount) +
            " → J$" +
            formatNumber(calculatedAmount);
    }

    if (
        direction.value === "foreign-to-jmd" &&
        goal.value === "needed"
    ) {
        calculatedAmount = amount / rate;

        resultText =
            "You would need approximately " +
            currency.value +
            " " +
            formatNumber(calculatedAmount);

        historyText =
            "J$" +
            formatNumber(amount) +
            " wanted → " +
            currency.value +
            " " +
            formatNumber(calculatedAmount) +
            " needed";
    }

    result.textContent = resultText;

    copyResultButton.textContent =
        "Copy result";

    historyText =
        historyText +
        " • " +
        getTimestamp();

    addToHistory(historyText);
}


function handleEnterKey(event) {
    if (event.key === "Enter") {
        calculateExchange();
    }
}

menuButton.addEventListener(
    "click",
    toggleOptionsMenu
);

dismissMenuHintButton.addEventListener(
    "click",
    dismissMenuHint
);

rateToolsOption.addEventListener(
    "click",
    openRateTools
);

closeRateToolsButton.addEventListener(
    "click",
    closeRateTools
);

recordsOption.addEventListener(
    "click",
    openRecords
);

appearanceOption.addEventListener(
    "click",
    openAppearance
);

closeAppearanceButton.addEventListener(
    "click",
    closeAppearance
);

themeChoices.forEach(function(button) {
    button.addEventListener(
        "click",
        function() {
            applyTheme(
                button.dataset.theme
            );
        }
    );
});

calculateButton.addEventListener(
    "click",
    calculateExchange
);

resetButton.addEventListener(
    "click",
    resetCalculator
);

saveRateButton.addEventListener(
    "click",
    saveCurrentRate
);

copyResultButton.addEventListener(
    "click",
    copyResult
);
  
  shareResultButton.addEventListener(
    "click",
    shareResult
);

clearHistoryButton.addEventListener(
    "click",
    clearHistory
);

direction.addEventListener(
    "change",
    handleSelectionChange
);

goal.addEventListener(
    "change",
    handleSelectionChange
);

currency.addEventListener(
    "change",
    handleSelectionChange
);

amountInput.addEventListener(
    "keydown",
    handleEnterKey
);

rateInput.addEventListener(
    "keydown",
    handleEnterKey
);

updateLabels();
displayHistory();
displaySavedRate();
loadTheme();

setTimeout(
    showMenuHint,
    800
);

  if ("serviceWorker" in navigator) {
    window.addEventListener(
        "load",
        function() {
            navigator.serviceWorker
                .register("./service-worker.js")
                .then(function() {
                    console.log(
                        "Service worker registered."
                    );
                })
                .catch(function(error) {
                    console.log(
                        "Service worker failed:",
                        error
                    );
                });
        }
    );
  }