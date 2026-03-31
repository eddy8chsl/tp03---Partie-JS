document
  .getElementById("simulator-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // empêche le rechargement

    const form = e.target;

    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!data.capital || !data.rate || !data.monthly || !data.years) {
      console.error("Missing fields");
      return;
    }
    if (
      data.capital != parseInt(data.capital) ||
      data.rate != parseFloat(data.rate) ||
      data.monthly != parseInt(data.monthly) ||
      data.years != parseInt(data.years)
    ) {
      console.error("All fields must be numbers");
      return;
    }
    if (data.rate > 40 || data.years < 5 || data.years > 50) {
      console.error("Invalid input values");
      return;
    }

    let taux = parseFloat(data.rate) / 100;
    let rendement_mensuel = taux / 12;

    let patrimoine = parseInt(data.capital);
    let mensualite = parseInt(data.monthly);

    let interet_cumule = 0;
    let versements_cumules = 0;
    let i = 1;

    const serieInterets = [];
    const serieVersements = [];
    const seriePatrimoine = [];
    const serieCapital = [];

    for (i = 1; i <= data.years * 12; i++) {
      patrimoine += patrimoine * rendement_mensuel + mensualite;
      interet_cumule += patrimoine * rendement_mensuel;
      versements_cumules += mensualite;

      const timestamp = Date.now() + i * 30 * 24 * 60 * 60 * 1000;

      serieInterets.push([timestamp, Math.round(interet_cumule)]);
      serieVersements.push([timestamp, Math.round(versements_cumules)]);
      seriePatrimoine.push([timestamp, Math.round(patrimoine)]);
      serieCapital.push([timestamp, Math.round(data.capital)]);
    }

    data.interet_cumule = Math.round(interet_cumule);
    data.versements_cumules = Math.round(versements_cumules);
    data.patrimoine = Math.round(patrimoine);
    console.log(data);

    const result = document.getElementById("result");

    result.textContent =
      `Capital final : ${Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(patrimoine)} | ` +
      `Intérêts totaux : ${Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(interet_cumule)} | ` +
      `Versements cumulés : ${Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(versements_cumules)}`;

    var options = {
      series: [
        {
          name: "Capital final",
          data: seriePatrimoine,
        },
        {
          name: "Capital de départ",
          data: serieCapital,
        },
        {
          name: "Versements cumulés",
          data: serieVersements,
        },
        {
          name: "Intérêts cumulés",
          data: serieInterets,
        },
      ],
      chart: {
        type: "area",
        height: 350,
        stacked: false,
        /* events: {
          selection: function (chart, e) {
            console.log(new Date(e.xaxis.min));
          },
        }, */
      },
      colors: ["#2E86DE", "#1B9C85", "#F39C12", "#8E44AD"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "monotoneCubic",
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 1,
          opacityTo: 0.5,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
      xaxis: {
        type: "datetime",
      },
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    //console.log(data);
  });
