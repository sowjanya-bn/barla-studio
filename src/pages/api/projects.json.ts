import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const token = import.meta.env.GH_PAT;

  const query = `{
    user(login: "sowjanya-bn") {
      repositories(
        first: 100,
        orderBy: { field: PUSHED_AT, direction: DESC },
        isFork: false,
        isArchived: false,
        privacy: PUBLIC
      ) {
        nodes {
          name
          description
          url
          primaryLanguage { name }
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
            nodes { name }
          }
          repositoryTopics(first: 10) {
            nodes { topic { name } }
          }
          pushedAt
          stargazerCount
        }
      }
    }
  }`;

  let projects = [];

  if (token) {
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const { data } = await res.json();
        const nodes = data?.user?.repositories?.nodes ?? [];
        projects = nodes.map((n: any) => ({
          name: n.name,
          description: n.description ?? "",
          url: n.url,
          primaryLanguage: n.primaryLanguage?.name ?? null,
          languages: n.languages.nodes.map((l: any) => l.name),
          topics: n.repositoryTopics.nodes.map((t: any) => t.topic.name),
          pushedAt: n.pushedAt,
          stars: n.stargazerCount,
        }));
      }
    } catch {}
  }

  return new Response(JSON.stringify({ projects, generatedAt: new Date().toISOString() }, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
