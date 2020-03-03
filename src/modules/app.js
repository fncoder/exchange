import { fetchAverageRates, fetchBidAndAsks } from "./api";
import theme from "./theme";
import lang from "./languages";
import views from "./views";

async function getMenuAverage(e, views) {
  const prevent = (e && e.preventDefault()) || null;

  const promise = fetchAverageRates()
    .then(json => {
      const remove = removeTable(views);
      return json;
    })
    .then(json => {
      const currentFilter = toggleFilters(views.table, "add");
      const render = renderTable(
        json,
        Object.assign(
          {},
          {
            filterCurrency: views.table.filterCurrency,
            filterSymbol: views.table.filterSymbol,
            filterAverageRate: views.table.filterAverageRate
          }
        ),
        ["currency", "code", "mid"]
      );
    });
  return e;
}

async function getMenuPurchasesAndSales(e, views) {
  const prevent = (e && e.preventDefault()) || null;

  const promise = fetchBidAndAsks()
    .then(json => {
      const remove = removeTable(views);
      return json;
    })
    .then(json => {
      const currentFilter = toggleFilters(views.table, "remove");
      const render = renderTable(
        json,
        Object.assign(
          {},
          {
            filterCurrency: views.table.filterCurrency,
            filterSymbol: views.table.filterSymbol,
            filterBid: views.table.filterBid,
            filterAsk: views.table.filterAsk
          }
        ),
        ["currency", "code", "bid", "ask"]
      );
    });
  return e;
}

async function changeLang(e, lang, views) {
  const prevent = e.preventDefault();

  const targetText = e.target.textContent.toUpperCase();

  const currentLang = Object.assign({}, lang)[targetText];
  const translateText = Object.assign(
    {},
    views.lang,
    views.menu,
    views.filters
  );

  const update = Object.keys(translateText).filter(
    key => (translateText[key].childNodes[0].nodeValue = currentLang[key])
  );
}

const renderTable = (data, table, props) =>
  data.map(el =>
    Object.values(table).map((v, i) => {
      v.innerHTML += `<li class="no-filters-rates__item"><span class="filters-rates__item-value">${
        el[props[i]]
      }</span></li>`;
    })
  );

const toggleDropdownLang = (e, dropdown) => {
  const prevent = (e && e.preventDefault()) || null;

  const cloneDropdown = Object.assign({}, { dropdown });
  const addToggleClass = cloneDropdown.dropdown.classList.toggle(
    "no-dropdown-active"
  );
};

const getActiveMenu = menu => {
  const cloneMenu = Object.assign({}, menu);
  const {
    menuAverage: average,
    menuPurchasesAndSales: purchasesAndSales
  } = cloneMenu;
  let target = average;

  return e => ({
    target,
    getActive() {
      target = e.target;
      const removeActiveClass = [average, purchasesAndSales].map(el =>
        el.classList.remove("active-menu-link")
      );
      const addActive = e.target.classList.add("active-menu-link");
    }
  });
};

const currentMenu = getActiveMenu(views.menu);

const toggleFilters = (table, property) => {
  const cloneTable = Object.assign({}, table);
  const cloneFiltersBidAsk = Object.assign(
    {},
    {
      filterBid: cloneTable.filterBid.parentNode,
      filterAsk: cloneTable.filterAsk.parentNode
    }
  );
  const cloneFilterAverageRate = Object.assign(
    {},
    { filterAverageRate: cloneTable.filterAverageRate.parentNode }
  );
  const filtersBidAsk = Object.keys(cloneFiltersBidAsk).filter(el =>
    cloneFiltersBidAsk[el].classList[property]("no-hide-bid-ask")
  );
  const filtersAverageRate = Object.keys(cloneFilterAverageRate).filter(el =>
    cloneFilterAverageRate[el].classList[property]("no-show-average-rate")
  );
};

const removeTable = views => {
  const table = Object.assign({}, views.table);
  const clearTable = Object.values(table).map(v => (v.innerHTML = ""));
};

const sortFilters = () => {
  let reverseJSON = false;

  return (api, property, methodName) => ({
    async sortFilters() {
      reverseJSON = !reverseJSON;
      const promise = api().then(json => {
        const sortAlpha = () =>
          [...json].sort((a, b) => a[property].localeCompare(b[property]));
        const sortMinMax = () =>
          [...json].sort((a, b) => b[property] - a[property]);

        const method =
          methodName === "sortAlpha"
            ? sortAlpha
            : methodName === "sortMinMax"
            ? sortMinMax
            : null;
        return reverseJSON ? method() : [...method()].reverse();
      });
      const result = await promise;
      return promise;
    }
  });
};

const getTheme = (e, theme) => {
  const prevent = e.preventDefault();

  const cloneTheme = Object.assign({}, theme);
  const addClassTheme = cloneTheme.monokai.classList.toggle("no-monokai");
};

async function init() {
  const attachClickLang = views.lang.name.addEventListener("click", e =>
    toggleDropdownLang(e, views.all.dropdown)
  );
  const attachClickDropdown = views.all.dropdown.addEventListener("click", e =>
    changeLang(e, lang, views).then(e =>
      toggleDropdownLang(e, views.all.dropdown)
    )
  );

  const attachClickMenuAverage = views.menu.menuAverage.addEventListener(
    "click",
    e =>
      getMenuAverage(e, views).then(e => {
        const activeMenu = currentMenu(e).getActive();
      })
  );

  const attachClickMenuPurchasesAndSales = views.menu.menuPurchasesAndSales.addEventListener(
    "click",
    e =>
      getMenuPurchasesAndSales(e, views).then(e => {
        const activeMenu = currentMenu(e).getActive();
      })
  );

  const attachClickTheme = views.all.theme.addEventListener("click", e =>
    getTheme(e, theme)
  );

  const alpha = sortFilters();
  const alphaFilters = Object.assign(
    {},
    {
      filterCurrencyName: views.filters.filterCurrencyName,
      filterSymbolName: views.filters.filterSymbolName
    }
  );

  const attachAlphaSort = Object.keys(alphaFilters).map(key =>
    alphaFilters[key].addEventListener("click", e => {
      const isMenuAverage =
        currentMenu().target === views.menu.menuAverage &&
        e.target === alphaFilters.filterCurrencyName
          ? updateAverage(alpha, fetchAverageRates, "currency", "sortAlpha")
          : currentMenu().target === views.menu.menuAverage &&
            e.target === alphaFilters.filterSymbolName
          ? updateAverage(alpha, fetchAverageRates, "code", "sortAlpha")
          : null;

      const isMenuPurchasesAndSales =
        currentMenu().target === views.menu.menuPurchasesAndSales &&
        e.target === alphaFilters.filterCurrencyName
          ? updatePurchasesAndSales(
              alpha,
              fetchBidAndAsks,
              "currency",
              "sortAlpha"
            )
          : currentMenu().target === views.menu.menuPurchasesAndSales &&
            e.target === alphaFilters.filterSymbolName
          ? updatePurchasesAndSales(alpha, fetchBidAndAsks, "code", "sortAlpha")
          : null;
    })
  );

  const minMax = sortFilters();
  const minMaxFilters = Object.assign(
    {},
    {
      filterAverageRateName: views.filters.filterAverageRateName,
      filterBidName: views.filters.filterBidName,
      filterAskName: views.filters.filterAskName
    }
  );

  const attachMinMaxSort = Object.keys(minMaxFilters).map(key =>
    minMaxFilters[key].addEventListener("click", e => {
      const isMenuAverage =
        currentMenu().target === views.menu.menuAverage &&
        e.target === minMaxFilters.filterAverageRateName
          ? updateAverage(minMax, fetchAverageRates, "mid", "sortMinMax")
          : null;

      const isMenuPurchasesAndSales =
        currentMenu().target === views.menu.menuPurchasesAndSales &&
        e.target === minMaxFilters.filterBidName
          ? updatePurchasesAndSales(
              minMax,
              fetchBidAndAsks,
              "bid",
              "sortMinMax"
            )
          : currentMenu().target === views.menu.menuPurchasesAndSales &&
            e.target === minMaxFilters.filterAskName
          ? updatePurchasesAndSales(
              minMax,
              fetchBidAndAsks,
              "ask",
              "sortMinMax"
            )
          : null;
    })
  );

  const updateAverage = (sort, api, property, methodName) =>
    sort(api, property, methodName)
      .sortFilters()
      .then(json => {
        const remove = removeTable(views);
        const render = renderTable(
          json,
          Object.assign(
            {},
            {
              filterCurrency: views.table.filterCurrency,
              filterSymbol: views.table.filterSymbol,
              filterAverageRate: views.table.filterAverageRate
            }
          ),
          ["currency", "code", "mid"]
        );
      });

  const updatePurchasesAndSales = (sort, api, property, methodName) =>
    sort(api, property, methodName)
      .sortFilters()
      .then(json => {
        const remove = removeTable(views);
        const render = renderTable(
          json,
          Object.assign(
            {},
            {
              filterCurrency: views.table.filterCurrency,
              filterSymbol: views.table.filterSymbol,
              filterBid: views.table.filterBid,
              filterAsk: views.table.filterAsk
            }
          ),
          ["currency", "code", "bid", "ask"]
        );
      });
}

const getInit = init().then(() => getMenuAverage(null, views));
