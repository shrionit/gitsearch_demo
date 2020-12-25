export default function API() {
  const API_BASE = "https://api.github.com";
  return {
    ENDPOINTS: {
      USER_SEARCH: API_BASE + "/search/users",
      USER_INFO: (user) => `${API_BASE}/users/${user}`,
      USER_REPO: (login) => `${API_BASE}/users/${login}/repos`,
    },
  };
}
