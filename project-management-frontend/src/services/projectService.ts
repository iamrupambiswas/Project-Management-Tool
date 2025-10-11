import api from "./api"

// Fetch all projects
export const getAllProjects = async () => {
    try {
        const res = await api.get("/projects");
        return res.data
    } catch(err) {
        console.error("Error fetching projects:", err);
        throw err;
    }
}