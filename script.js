
const countries = [

    ["Austria", "at", "AUT", 1995, 1997, 1999, "EU member"],
    ["Belgium", "be", "BEL", 1958, 1995, 1999, "EU member"],
    ["Bulgaria", "bg", "BGR", 2007, 2024, 2026, "EU member"],
    ["Croatia", "hr", "HRV", 2013, 2023, 2023, "EU member"],
    ["Cyprus", "cy", "CYP", 2004, null, 2008, "EU member"],
    ["Czechia", "cz", "CZE", 2004, 2007, null, "EU member"],
    ["Denmark", "dk", "DNK", 1973, 2001, null, "EU member"],
    ["Estonia", "ee", "EST", 2004, 2007, 2011, "EU member"],
    ["Finland", "fi", "FIN", 1995, 2001, 1999, "EU member"],
    ["France", "fr", "FRA", 1958, 1995, 1999, "EU member"],
    ["Germany", "de", "DEU", 1958, 1995, 1999, "EU member"],
    ["Greece", "gr", "GRC", 1981, 2000, 2001, "EU member"],
    ["Hungary", "hu", "HUN", 2004, 2007, null, "EU member"],
    ["Ireland", "ie", "IRL", 1973, null, 1999, "EU member"],
    ["Italy", "it", "ITA", 1958, 1997, 1999, "EU member"],
    ["Latvia", "lv", "LVA", 2004, 2007, 2014, "EU member"],
    ["Lithuania", "lt", "LTU", 2004, 2007, 2015, "EU member"],
    ["Luxembourg", "lu", "LUX", 1958, 1995, 1999, "EU member"],
    ["Malta", "mt", "MLT", 2004, 2007, 2008, "EU member"],
    ["Netherlands", "nl", "NLD", 1958, 1995, 1999, "EU member"],
    ["Poland", "pl", "POL", 2004, 2007, null, "EU member"],
    ["Portugal", "pt", "PRT", 1986, 1995, 1999, "EU member"],
    ["Romania", "ro", "ROU", 2007, 2024, null, "EU member"],
    ["Slovakia", "sk", "SVK", 2004, 2007, 2009, "EU member"],
    ["Slovenia", "si", "SVN", 2004, 2007, 2007, "EU member"],
    ["Spain", "es", "ESP", 1986, 1995, 1999, "EU member"],
    ["Sweden", "se", "SWE", 1995, 2001, null, "EU member"],

    ["Albania", "al", "ALB", "2014*", null, null, "Candidate"],
    ["Bosnia and Herzegovina", "ba", "BIH", "2022*", null, null, "Candidate"],
    ["Georgia", "ge", "GEO", "2023*", null, null, "Candidate"],
    ["Moldova", "md", "MDA", "2022*", null, null, "Candidate"],
    ["Montenegro", "me", "MNE", "2010*", null, "2002*", "Candidate"],
    ["North Macedonia", "mk", "MKD", "2005*", null, null, "Candidate"],
    ["Serbia", "rs", "SRB", "2012*", null, null, "Candidate"],
    ["Turkey", "tr", "TUR", "1999*", null, null, "Candidate"],
    ["Ukraine", "ua", "UKR", "2022*", null, null, "Candidate"],
    ["Kosovo", "xk", "XKX", "2022*", null, "2002*", "Candidate"],

    ["Andorra", "ad", "AND", null, null, "2012*", "Not a candidate"],
    ["Armenia", "am", "ARM", null, null, null, "Not a candidate"],
    ["Azerbaijan", "az", "AZE", null, null, null, "Not a candidate"],
    ["Belarus", "by", "BLR", null, null, null, "Not a candidate"],
    ["Iceland", "is", "ISL", null, 2001, null, "Not a candidate"],
    ["Israel", "il", "ISR", null, null, null, "Not a candidate"],
    ["Liechtenstein", "li", "LIE", null, 2008, null, "Not a candidate"],
    ["Monaco", "mc", "MCO", null, null, "1999*", "Not a candidate"],
    ["Norway", "no", "NOR", null, 2001, null, "Not a candidate"],
    ["Russia", "ru", "RUS", null, null, null, "Not a candidate"],
    ["San Marino", "sm", "SMR", null, null, "1999*", "Not a candidate"],
    ["Switzerland", "ch", "CHE", null, 2008, null, "Not a candidate"],

    ["United Kingdom", "gb", "GBR", 1973, null, null, "Former EU member"]

];

const countryData =
    countries.map(c => ({

        country: c[0],
        code: c[1],
        iso3: c[2],
        euJoined: c[3],
        schengenJoined: c[4],
        euroAdopted: c[5],
        euStatus: c[6]

    }));

const byISO3 = new Map();
const byName = new Map();

countryData.forEach(country => {

    byISO3.set(
        country.iso3,
        country
    );

    byName.set(
        country.country,
        country
    );

});

const map =
    L.map(
        "map",
        {
            minZoom: 3,
            maxZoom: 8
        }
    );

map.setView(
    [54, 18],
    4
);

const EUROPE_URL =
    "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson";

const mapLayers = {};

let selectedCountry = null;

function getColor(country) {

    if (
        country.euStatus ===
        "EU member"
    ) {

        return "#2563eb";

    }

    if (
        country.euStatus ===
        "Candidate" ||

        country.euStatus ===
        "Potential candidate"
    ) {

        return "#f59e0b";

    }

    if (
        country.euStatus ===
        "Former EU member"
    ) {

        return "#dc2626";

    }

    return "#cbd5e1";
}

function getStatusClass(status) {

    if (status === "EU member") {
        return "status-member";
    }

    if (status === "Candidate") {
        return "status-candidate";
    }

    if (status === "Potential candidate") {
        return "status-potential";
    }

    if (status === "Former EU member") {
        return "status-former";
    }

    return "status-other";
}

function getISO(feature) {

    const p =
        feature.properties || {};

    const possible = [

        p["ISO_A3"],
        p["ISO_A3_EH"],
        p["ISO3166-1-Alpha-3"],
        p["ISO3"],
        p["ADM0_A3"],
        p["adm0_a3"],
        p["GU_A3"],
        p["SOV_A3"],
        p["WB_A3"],
        p["BRK_A3"],
        p["iso_a3"]

    ];

    for (
        const value of possible
    ) {

        if (
            value &&
            value !== "-99"
        ) {

            const normalized =
                String(value)
                    .trim()
                    .toUpperCase();


            if (
                byISO3.has(
                    normalized
                )
            ) {

                return normalized;

            }

        }

    }

    return null;
}

function getCountry(feature) {

    const iso =
        getISO(feature);


    if (iso) {

        return byISO3.get(
            iso
        );

    }

    const p =
        feature.properties || {};


    const possibleNames = [

        p.NAME,
        p.NAME_EN,
        p.ADMIN,
        p.name,
        p.NAME_LONG,
        p.BRK_NAME

    ];

    for (
        const name of possibleNames
    ) {

        if (!name) {
            continue;
        }


        const normalized =
            String(name)
                .trim()
                .toLowerCase();


        for (
            const country of countryData
        ) {

            if (
                country.country
                    .toLowerCase() ===
                normalized
            ) {

                return country;

            }

        }

    }

    return null;
}

function createPopup(country) {

    return `
        <div class="country-popup">

            <div class="country-popup-title">

                ${country.country}

            </div>


            <div class="popup-row">

                <strong>EU:</strong>
                ${country.euJoined ?? "—"}

            </div>


            <div class="popup-row">

                <strong>Schengen:</strong>
                ${country.schengenJoined ?? "—"}

            </div>


            <div class="popup-row">

                <strong>Euro:</strong>
                ${country.euroAdopted ?? "—"}

            </div>


            <div class="popup-row">

                <strong>Status:</strong>
                ${country.euStatus}

            </div>

        </div>

    `;
}

function selectCountry(country) {

    selectedCountry =
        country.country;

    document
        .querySelectorAll(
            "#countryTable tr"
        )
        .forEach(row => {

            row.classList.remove(
                "selected"
            );

        });

    const row =
        document.querySelector(
            `#countryTable tr[data-country="${CSS.escape(country.country)}"]`
        );

    if (row) {

        row.classList.add(
            "selected"
        );


        row.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }

    Object.entries(
        mapLayers
    ).forEach(
        ([iso, layer]) => {

            const item =
                byISO3.get(iso);


            if (!item) {
                return;
            }

            if (
                item.country ===
                country.country
            ) {

                layer.setStyle({

                    fillColor:
                        "#111827",

                    fillOpacity:
                        0.95,

                    weight:
                        3,

                    color:
                        "#ffffff"

                });

            }
            else {

                layer.setStyle({

                    fillColor:
                        getColor(item),

                    fillOpacity:
                        0.80,

                    weight:
                        1,

                    color:
                        "#ffffff"

                });

            }

        }
    );
}

fetch(
    EUROPE_URL
)

    .then(
        response => {

            if (!response.ok) {

                throw new Error(
                    "Could not load Europe GeoJSON."
                );

            }

            return response.json();

        }
    )

    .then(
        geojson => {

            const europe =
                L.geoJSON(
                    geojson,
                    {
                        style:
                            feature => {

                                const country =
                                    getCountry(
                                        feature
                                    );

                                if (!country) {

                                    return {

                                        fillColor:
                                            "#cbd5e1",

                                        fillOpacity:
                                            0.45,

                                        weight:
                                            1,

                                        color:
                                            "#ffffff"

                                    };

                                }

                                return {

                                    fillColor:
                                        getColor(
                                            country
                                        ),

                                    fillOpacity:
                                        0.80,

                                    weight:
                                        1,

                                    color:
                                        "#ffffff"

                                };

                            },

                        onEachFeature:
                            (
                                feature,
                                layer
                            ) => {

                                const country =
                                    getCountry(
                                        feature
                                    );


                                if (!country) {
                                    return;
                                }

                                mapLayers[
                                    country.iso3
                                ] = layer;

                                layer.bindPopup(
                                    createPopup(
                                        country
                                    )
                                );

                                layer.on({

                                    mouseover:
                                        event => {

                                            event.target.setStyle({

                                                weight:
                                                    3,

                                                color:
                                                    "#111827",

                                                fillOpacity:
                                                    0.95

                                            });

                                        },

                                    mouseout:
                                        event => {

                                            if (
                                                selectedCountry ===
                                                country.country
                                            ) {

                                                event.target.setStyle({

                                                    fillColor:
                                                        "#111827",

                                                    fillOpacity:
                                                        0.95,

                                                    weight:
                                                        3,

                                                    color:
                                                        "#ffffff"

                                                });

                                            }
                                            else {

                                                event.target.setStyle({

                                                    fillColor:
                                                        getColor(
                                                            country
                                                        ),

                                                    fillOpacity:
                                                        0.80,

                                                    weight:
                                                        1,

                                                    color:
                                                        "#ffffff"

                                                });

                                            }

                                        },

                                    click:
                                        () => {

                                            selectCountry(
                                                country
                                            );

                                        }

                                });

                            }

                    }
                );

            europe.addTo(
                map
            );

            map.fitBounds(
                europe.getBounds(),
                {
                    padding: [20, 20]
                }
            );

        }
    )

    .catch(
        error => {

            console.error(
                error
            );

            document.getElementById(
                "map"
            ).innerHTML = `

            <div style="
                height:100%;
                display:flex;
                align-items:center;
                justify-content:center;
                text-align:center;
                color:#66717d;
                padding:30px;
            ">

                <div>

                    <h3>
                        Map could not be loaded
                    </h3>

                    <p>
                        Check your internet connection
                        and reload the page.
                    </p>

                </div>

            </div>

        `;

        }
    );

const tableBody =
    document.getElementById(
        "countryTable"
    );

let visibleCountries =
    [...countryData];

let sortField = null;

let sortAscending = true;

function renderTable() {
    tableBody.innerHTML = "";

    visibleCountries.forEach(
        country => {

            const row =
                document.createElement(
                    "tr"
                );

            row.dataset.country =
                country.country;

            if (
                selectedCountry ===
                country.country
            ) {

                row.classList.add(
                    "selected"
                );

            }

            row.innerHTML = `

                <td class="country-cell">

                    <img
                        class="flag"
                        src="https://flagcdn.com/w40/${country.code}.png"
                        alt="${country.country} flag"
                    >

                    ${country.country}

                </td>

                <td>
                    ${country.euJoined ?? "—"}
                </td>

                <td>
                    ${country.schengenJoined ?? "—"}
                </td>

                <td>
                    ${country.euroAdopted ?? "—"}
                </td>

                <td
                    class="
                        status
                        ${getStatusClass(country.euStatus)}
                    "
                >

                    ${country.euStatus}
                </td>

            `;

            row.addEventListener(
                "click",
                () => {

                    selectCountry(
                        country
                    );

                    const layer =
                        mapLayers[
                        country.iso3
                        ];

                    if (layer) {

                        map.fitBounds(
                            layer.getBounds(),
                            {

                                padding:
                                    [30, 30],

                                maxZoom:
                                    6

                            }
                        );

                        layer.openPopup();

                    }

                }
            );

            tableBody.appendChild(
                row
            );

        }
    );

}

renderTable();

document
    .getElementById(
        "search"
    )
    .addEventListener(
        "input",
        event => {

            const query =
                event.target.value
                    .trim()
                    .toLowerCase();


            visibleCountries =
                countryData.filter(
                    country =>
                        country.country
                            .toLowerCase()
                            .includes(query)
                );

            renderTable();

        }
    );

document
    .querySelectorAll(
        "th[data-sort]"
    )
    .forEach(
        header => {

            header.addEventListener(
                "click",
                () => {

                    const field =
                        header.dataset.sort;


                    if (
                        sortField ===
                        field
                    ) {

                        sortAscending =
                            !sortAscending;

                    }
                    else {

                        sortField =
                            field;

                        sortAscending =
                            true;

                    }

                    visibleCountries.sort(
                        (a, b) => {

                            let A =
                                a[field];

                            let B =
                                b[field];


                            if (
                                A === null ||
                                A === undefined
                            ) {

                                return 1;

                            }

                            if (
                                B === null ||
                                B === undefined
                            ) {

                                return -1;

                            }

                            if (
                                typeof A ===
                                "number" &&
                                typeof B ===
                                "number"
                            ) {

                                return sortAscending
                                    ? A - B
                                    : B - A;

                            }

                            return sortAscending
                                ? String(A)
                                    .localeCompare(
                                        String(B)
                                    )
                                : String(B)
                                    .localeCompare(
                                        String(A)
                                    );
                        }
                    );

                    renderTable();

                }
            );

        }
    );
