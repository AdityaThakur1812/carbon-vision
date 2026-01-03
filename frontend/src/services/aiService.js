import api from "./api";

export const getRecommendations = (regen = false) => {
  return api.get(`/ai/recommend${regen ? "?regen=true" : ""}`, {
    timeout: 20000
  });
};
