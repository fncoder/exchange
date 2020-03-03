const all = {
  lang: document.querySelector(".header-dropdown-lang"),
  menuAverage: document.querySelectorAll(".nav-list-item a")[0],
  menuPurchasesAndSales: document.querySelectorAll(".nav-list-item a")[1],
  filterCurrencyName: document.querySelectorAll(
    ".filters-group .filters-group-name"
  )[0],
  filterCurrency: document.querySelectorAll(".filters-group .filters-rates")[0],
  filterSymbolName: document.querySelectorAll(
    ".filters-group .filters-group-name"
  )[1],
  filterSymbol: document.querySelectorAll(".filters-group .filters-rates")[1],
  filterAverageRateName: document.querySelectorAll(
    ".filters-group .filters-group-name"
  )[2],
  filterAverageRate: document.querySelectorAll(
    ".filters-group .filters-rates"
  )[2],
  filterBidName: document.querySelectorAll(
    ".filters-group .filters-group-name"
  )[3],
  filterBid: document.querySelectorAll(".filters-group .filters-rates")[3],
  filterAskName: document.querySelectorAll(
    ".filters-group .filters-group-name"
  )[4],
  filterAsk: document.querySelectorAll(".filters-group .filters-rates")[4],
  dropdown: document.querySelector(".dropdown-lang"),
  theme: document.querySelector(".app-theme"),
  filters: document.querySelector(".filters")
};

const lang = {
  name: all.lang
};

const menu = {
  menuAverage: all.menuAverage,
  menuPurchasesAndSales: all.menuPurchasesAndSales
};

const filters = {
  filterCurrencyName: all.filterCurrencyName,
  filterSymbolName: all.filterSymbolName,
  filterAverageRateName: all.filterAverageRateName,
  filterBidName: all.filterBidName,
  filterAskName: all.filterAskName
};

const table = {
  filterCurrency: all.filterCurrency,
  filterSymbol: all.filterSymbol,
  filterAverageRate: all.filterAverageRate,
  filterBid: all.filterBid,
  filterAsk: all.filterAsk
};

export default {
  lang,
  menu,
  filters,
  table,
  all
};
