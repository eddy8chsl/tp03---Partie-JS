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

    for (let i = 1; i <= data.years * 12; i++) {
      patrimoine += patrimoine * rendement_mensuel + mensualite;
      interet_cumule += patrimoine * rendement_mensuel;
      versements_cumules += mensualite;
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

    //console.log(data);
  });
