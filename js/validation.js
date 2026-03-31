window.addEventListener("DOMContentLoaded", () => {
  const options = {
    series: [
      { name: "Capital final", data: [] },
      { name: "Capital initial", data: [] },
      { name: "Versements cumulés", data: [] },
      { name: "Intérêts cumulés", data: [] },
    ],
    chart: {
      type: "area",
      height: 350,
      stacked: false,
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

  monGraphique = new ApexCharts(
    document.querySelector("#simulatorChart"),
    options,
  );
  monGraphique.render();
});

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

    const dataInterets = [];
    const dataVersements = [];
    const capitalFinal = [];
    const capitalInitial = [];

    for (i = 1; i <= data.years * 12; i++) {
      patrimoine += patrimoine * rendement_mensuel + mensualite;
      interet_cumule += patrimoine * rendement_mensuel;
      versements_cumules += mensualite;

      const start = new Date().getTime();
      const timestamp = start + i * 30 * 24 * 60 * 60 * 1000;

      dataInterets.push([timestamp, Math.round(interet_cumule)]);
      dataVersements.push([timestamp, Math.round(versements_cumules)]);
      capitalFinal.push([timestamp, Math.round(patrimoine)]);
      capitalInitial.push([timestamp, Math.round(data.capital)]);
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

    monGraphique.updateSeries([
      { name: "Capital final", data: capitalFinal },
      { name: "Capital initial", data: capitalInitial },
      { name: "Versements cumulés", data: dataVersements },
      { name: "Intérêts cumulés", data: dataInterets },
    ]);

    monGraphique.updateOptions({
      chart: {
        type: "area",
        height: 350,
        stacked: false,
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
    });
  });
