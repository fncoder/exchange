async function fetchAverageRates() {
  const fetchTableA = await fetch(
    "https://api.nbp.pl/api/exchangerates/tables/a/",
    {
      headers: {
        Accept: "application/json"
      }
    }
  );
  const resultTableA = await fetchTableA.json();

  const fetchTableB = await fetch(
    "https://api.nbp.pl/api/exchangerates/tables/b/",
    {
      headers: {
        Accept: "application/json"
      }
    }
  );
  const resultTableB = await fetchTableB.json();

  return [...resultTableA[0].rates, ...resultTableB[0].rates];
}

async function fetchBidAndAsks() {
  const result = await fetch("https://api.nbp.pl/api/exchangerates/tables/c/", {
    headers: {
      Accept: "application/json"
    }
  });
  const json = await result.json();

  return [...json[0].rates];
}

export { fetchAverageRates, fetchBidAndAsks };
