export function generateMockRoadmap(idea, year, skills) {
  return {
    idea_summary: "A startup focused on " + idea.substring(0, 50) + "...",
    idea_viability_score: 8,
    viability_reasoning: "Market demand exists.",
    total_estimated_weeks: 24,
    stages: [
      {
        stage_number: 1,
        stage_name: "Research",
        stage_title: "Planning",
        duration_weeks: 4,
        tasks: [{ task: "Survey", how_to_do_it: "Interview users." }],
        checkpoint: "Validated."
      }
    ],
    skill_gap_analysis: [],
    funding_path: {
      bootstrap_cost_estimate: "₹50k",
      stage_for_funding: "Seed",
      indian_grants_and_programs: []
    }
  };
}

export function generateMockDomains(idea) {
  return {
    overall_confidence: 0.9,
    reasoning_summary: "Based on the sector, these domains are essential for building a scalable MVP.",
    domains: [
      { name: "Frontend Development", priority: "primary", category: "technical", reason: "UI is critical.", confidence: 0.95 },
      { name: "Legal Compliance", priority: "cross-domain", category: "legal", reason: "Indian regulations.", confidence: 0.8 }
    ]
  };
}
