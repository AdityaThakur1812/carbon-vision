/* =====================================================
   Carbon Calculator (ML + Dashboard Ready)
   Units: kg CO₂ equivalent
===================================================== */

/* ================= TOTAL CO2 ================= */

function calculateCO2(data) {
  let carbon = 0;

  /* ---------- TRANSPORT ---------- */
  const transportFactors = {
    Car: 0.21,        // kg CO2 per km
    Bus: 0.08,
    Train: 0.04,
    Bike: 0,
    Walk: 0
  };

  carbon +=
    (transportFactors[data.transport] || 0) *
    (data.vehicleDistance || 0);

  if (data.airTravelFreq === "Frequent") carbon += 50;
  if (data.airTravelFreq === "Occasional") carbon += 20;

  /* ---------- DIET ---------- */
  const dietFactors = {
    Vegan: 1.5,
    Vegetarian: 2.0,
    Omnivore: 3.5,
    MeatHeavy: 5.5
  };

  carbon += dietFactors[data.diet] || 2;

  /* ---------- ENERGY ---------- */
  const efficiencyFactors = {
    Low: 2.5,
    Medium: 1.8,
    High: 1.0
  };

  carbon +=
    (efficiencyFactors[data.energyEfficiency] || 1.8) +
    (data.tvPcHours || 0) * 0.06 +
    (data.internetHours || 0) * 0.02;

  /* ---------- WASTE ---------- */
  carbon += (data.wasteBagWeekly || 0) * 0.8;

  return Number(carbon.toFixed(2));
}

/* ================= BREAKDOWN ================= */

function breakdownFromEntries(entries) {
  const breakdown = {
    transport: 0,
    food: 0,
    energy: 0,
    waste: 0
  };

  entries.forEach((e) => {
    /* TRANSPORT */
    const transportFactors = {
      Car: 0.21,
      Bus: 0.08,
      Train: 0.04,
      Bike: 0,
      Walk: 0
    };

    breakdown.transport +=
      (transportFactors[e.transport] || 0) *
      (e.vehicleDistance || 0);

    if (e.airTravelFreq === "Frequent") breakdown.transport += 50;
    if (e.airTravelFreq === "Occasional") breakdown.transport += 20;

    /* FOOD */
    const dietFactors = {
      Vegan: 1.5,
      Vegetarian: 2.0,
      Omnivore: 3.5,
      MeatHeavy: 5.5
    };
    breakdown.food += dietFactors[e.diet] || 2;

    /* ENERGY */
    const efficiencyFactors = {
      Low: 2.5,
      Medium: 1.8,
      High: 1.0
    };

    breakdown.energy +=
      (efficiencyFactors[e.energyEfficiency] || 1.8) +
      (e.tvPcHours || 0) * 0.06 +
      (e.internetHours || 0) * 0.02;

    /* WASTE */
    breakdown.waste += (e.wasteBagWeekly || 0) * 0.8;
  });

  // round values
  Object.keys(breakdown).forEach((k) => {
    breakdown[k] = Number(breakdown[k].toFixed(2));
  });

  return breakdown;
}

/* ================= EXPORTS ================= */

module.exports = {
  calculateCO2,
  breakdownFromEntries
};
