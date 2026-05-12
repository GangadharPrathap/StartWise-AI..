// Service for identifying potential investors
import investors from "../data/investors.json" assert { type: "json" };

export async function getInvestors() {
  return investors;
}
export function getLocalInvestors(city) {
  // In a real application, this would query a database of investors.
  // For now, we return a mock array or filter based on city.
  const allInvestors = [
    { name: "Sequoia Surge", city: "Delhi NCR", fund: "$1.5B" },
    { name: "Nexus Venture Partners", city: "Bangalore", fund: "$1.2B" },
    { name: "Matrix Partners", city: "Mumbai", fund: "$1B" },
    { name: "Elevation Capital", city: "Delhi NCR", fund: "$600M" },
    { name: "Accel Partners", city: "Bangalore", fund: "$1.5B" },
    { name: "Kalaari Capital", city: "Bangalore", fund: "$650M" }
  ];



  if (city === "All") {
    return allInvestors;
  }
  return allInvestors.filter(inv => inv.city.toLowerCase() === city.toLowerCase() || inv.city === "All");
}
