import { ProjectDto } from "../@api";
import api from "./api"

// Fetch all projects
export const getAllProjects = async (): Promise<ProjectDto[]> => {
    try {
        const res = await api.get("/projects");
        return res.data
    } catch(err) {
        console.error("Error fetching projects:", err);
        throw err;
    }
}

// Create project
export const createProject = async (
    projectDto: ProjectDto
): Promise<ProjectDto> => {
    try {
        const res = await api.post("/projects");
        return res.data;
    } catch (err) {
        console.error("Error creating project:", err);
        throw err;
    }
}

// Get project details
export const getProjectById = async(
    id: number
): Promise<ProjectDto> => {
    try {
        const res = await api.get(`/projects/${id}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching project:", err);
        throw err;
    }
}