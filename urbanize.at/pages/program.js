const eventListing = require('../widgets/event-listing.js');
const layout = require('./layout.js');
const scrollToTop = require('../widgets/scroll_to_top.js');

module.exports = urbanize => {
  const html = `
    <div>
      <h2>
        Filtern nach
      </h2>

      <div class="filter_alignment">
        <span class="hover_menu_trigger" style="z-index: 2;">
          <a class="button_rect_accent" data-filter="date" href="#" onclick="return false;">Datum<span class="active_date"></span></a>
          <div class="hover_menu">
            <a class="button_rect_yellow" data-date="all" href="#" onclick="updateFilter(this); return false;">Alle Tage</a>
            <a class="button_rect_yellow" data-date="2021-10-06" href="#" onclick="updateFilter(this); return false;">06 OKT 2021</a>
            <a class="button_rect_yellow" data-date="2021-10-07" href="#" onclick="updateFilter(this); return false;">07 OKT 2021</a>
            <a class="button_rect_yellow" data-date="2021-10-08" href="#" onclick="updateFilter(this); return false;">08 OKT 2021</a>
            <a class="button_rect_yellow" data-date="2021-10-09" href="#" onclick="updateFilter(this); return false;">09 OKT 2021</a>
            <a class="button_rect_yellow" data-date="2021-10-10" href="#" onclick="updateFilter(this); return false;">10 OKT 2021</a>
          </div>
        </span>

        <span class="hover_menu_trigger" style="z-index: 1;">
          <a class="button_rect_accent" data-filter="category" href="#" onclick="return false;">Kategorie<span class="active_category"></span></a>
          <div class="hover_menu">
            <a class="button_rect_yellow" data-category="all" href="#" onclick="updateFilter(this); return false;">Alle Kategorien</a>
            <a class="button_rect_yellow" data-category="Film-Kunst-Musik" href="#" onclick="updateFilter(this); return false;">Film-Kunst-Musik</a>
            <a class="button_rect_yellow" data-category="Stadt-Praxis" href="#" onclick="updateFilter(this); return false;">Stadt-Praxis</a>
            <a class="button_rect_yellow" data-category="Vortrag/Diskussion" href="#" onclick="updateFilter(this); return false;">Vortrag/Diskussion</a>
            <a class="button_rect_yellow" data-category="Workshop" href="#" onclick="updateFilter(this); return false;">Workshop</a>
          </div>
        </span>

        <span>
          <input class="active_query input_rect_accent" data-filter="query" oninput="updateFilter(this); return false;" placeholder="Volltextsuche" type="search">
        </span>
      </div>

      <br><br>

      ${eventListing(Object.values(urbanize.events))}

      <div class="no_results" style="display: none;">
        <em>Keine Veranstaltungen entsprechen den aktuellen Filterkriterien</em>
      </div>

      ${scrollToTop}
    </div>
  `;

  return layout(html, urbanize, { title: 'Programm' });
};
