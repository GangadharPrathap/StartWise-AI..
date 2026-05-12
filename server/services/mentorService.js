export async function getMentors(industry) {
    return [
        {
            id: 1,
            name: "Elena Rodriguez",
            expertise: "AI Startups",
            experience: "Ex-Google Ventures",
            rating: 4.9,
            industry
        },
        {
            id: 2,
            name: "Michael Chen",
            expertise: "SaaS Scaling",
            experience: "YC Advisor",
            rating: 4.8,
            industry
        }
    ];
}