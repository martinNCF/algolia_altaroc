const search = instantsearch({
  indexName: "newsflow",
  searchClient: algoliasearch("AEJZLSWAWT", "0cb8b93b9d35a722bbda33866f345cf7"),
});

// Configuration globale
search.addWidgets([
  instantsearch.widgets.configure({
    hitsPerPage: 3,
  }),
]);

// Widget de visibilité
const createVisibilityWidget = (containerSelector) => ({
  render({ results }) {
    const container = document.querySelector(containerSelector);
    if (container) {
      container.classList.toggle("hidden", results.nbHits === 0);
    }
  },
});

// Fonction générique pour infiniteHits
const createInfiniteHitsWidget = (container, itemTemplate) =>
  instantsearch.widgets.infiniteHits({
    container,
    templates: {
      item: itemTemplate,
      showMoreText: "Afficher plus",
    },
    cssClasses: {
      loadMore: ["custom-button", "load-more-button"],
    },
  });

// Template générique pour les articles, sociétés et gérants
const defaultTemplate = (hit, urlBase) => `
  <a href="${urlBase}/${hit.slug}" class="inlineflex-spacebet-bot">
    <div class="link-block">
      <div class="label-medium text-color-black">${hit["name"]}</div>
      <p class="text-size-small text-color-gray500 clamp-3lines">${
        hit["shortDescription"] || hit["intro"]
      }</p>
    </div>
  </a>
`;

// Template spécifique pour les vidéos
const videoTemplate = (hit) => `
  <a href="https://www.altaroc.pe/videos-private-equity/${
    hit.slug
  }" class="videoCard">
    <div class="videoCoverContainer">
      <img class="videoCardCover" src="${hit["coverImageUrl"]}" alt="${
  hit["name"]
}" loading="lazy" />
      <div class="videoTime">${hit["videoDuration"] || ""}</div>
    </div>
    <div class="label-normal text-color-gray100">${hit["name"]}</div>
  </a>
`;

// Template spécifique pour les séries
const seriesTemplate = (hit) => `
  <a href="https://www.altaroc.pe/series/${hit.slug}" class="videoCard">
    <div class="seriesCoverContainer">
      <img class="videoCardCover" src="${hit["coverImageUrl"]}" alt="${hit["name"]}" loading="lazy" />
      <div class="numberOfEpisodes">${hit["numberOfEpisodes"]} épisodes</div>
    </div>
    <div class="label-normal text-color-gray100">${hit["name"]}</div>
  </a>
`;

// Ajout des widgets pour chaque index
const indices = [
  {
    name: "newsflow",
    container: "#hitsRessources",
    visibility: "#ContainerhitsRessources",
    urlBase: "https://www.altaroc.pe/private-equity-actualites",
    template: (hit) =>
      defaultTemplate(hit, "https://www.altaroc.pe/private-equity-actualites"),
  },
  {
    name: "series",
    container: "#seriesHits",
    visibility: "#ContainerSeriesHits",
    template: seriesTemplate,
  },
  {
    name: "video",
    container: "#videoHits",
    visibility: "#ContainerVideoHits",
    template: videoTemplate,
  },
  {
    name: "societes",
    container: "#societesHits",
    visibility: "#ContainersocietesHits",
    urlBase: "https://www.altaroc.pe/societes",
    template: (hit) => defaultTemplate(hit, "https://www.altaroc.pe/societes"),
  },
  {
    name: "gerants",
    container: "#gerantsHits",
    visibility: "#ContainergerantsHits",
    urlBase: "https://www.altaroc.pe/gerants",
    template: (hit) => defaultTemplate(hit, "https://www.altaroc.pe/gerants"),
  },
];

indices.forEach(({ name, container, visibility, template }) => {
  const index = instantsearch.widgets.index({ indexName: name });
  index.addWidgets([
    createVisibilityWidget(visibility),
    createInfiniteHitsWidget(container, template),
  ]);
  search.addWidgets([index]);
});

// SearchBox et Stats
search.addWidgets([
  instantsearch.widgets.searchBox({
    container: "#searchbox",
    placeholder: "Recherchez dans tout le site",
    searchAsYouType: false,
    showSubmit: false,
    showReset: true,
    cssClasses: {
      root: "custom-searchbox",
    },
  }),
  instantsearch.widgets.stats({
    container: "#stats",
    templates: {
      text(data, { html }) {
        const count = data.hasManyResults
          ? `${data.nbHits} résultats`
          : data.hasOneResult
          ? `1 résultat`
          : `Pas de résultat`;
        return html`<span>${count}</span>`;
      },
    },
  }),
]);

search.start();
