const fromCur = document.querySelector(".from select");
const toCur = document.querySelector(".to select");
const Btn = document.querySelector("form button");
const exIcon = document.querySelector("form .reverse");
const result = document.querySelector("form .result");
const amount = document.querySelector("form input");

[fromCur, toCur].forEach((select, i) => {
  for (let curCode in Country_List) {
    const selected =
      (i === 0 && curCode === "USD") || (i === 1 && curCode === "MAD")
        ? "selected"
        : "";
    select.insertAdjacentHTML(
      "beforeend",
      `<option value="${curCode}" ${selected}>${curCode}</option>`
    );

    select.addEventListener("change", () => {
      const code = select.value;
      const img = select.parentElement.querySelector("img");
      img.src = `https://flagcdn.com/48x36/${Country_List[
        code
      ].toLowerCase()}.png`;
    });
  }
});

async function getExchangeRate() {
  const amountVal = amount.value || 1;
  result.innerText = "Getting exchange rate...";
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/023cfc04483a123782938bf2/latest/${fromCur.value}`
    );
    const data = await response.json();
    const exchageRate = data.conversion_rates[toCur.value];

    const total = (amountVal * exchageRate).toFixed(2);
    result.innerText = `${amountVal} ${fromCur.value} = ${total} ${toCur.value}`;
  } catch (err) {
    console.log(err);
    result.innerText = "Something went wrong";
  }
}

window.addEventListener("load", getExchangeRate);
Btn.addEventListener("click", (e) => {
  e.preventDefault();
  // getExchangeRate();
  socket();
});

exIcon.addEventListener("click", () => {
  [fromCur.value, toCur.value] = [toCur.value, fromCur.value];
  [fromCur, toCur].forEach((select) => {
    const code = select.value;
    const img = select.parentElement.querySelector("img");
    img.src = `https://flagcdn.com/48x36/${Country_List[
      code
    ].toLowerCase()}.png`;
  });

  getExchangeRate();
});
fromCur.addEventListener("input", getExchangeRate);
toCur.addEventListener("input", getExchangeRate);

amount.addEventListener("input", getExchangeRate);

function socket() {
  let socket = new WebSocket("ws://127.0.0.1:7777?message=HelloFromJs");
}
