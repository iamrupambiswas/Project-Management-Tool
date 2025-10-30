import { ProjectDto, ProjectDtoStatusEnum } from "../@api";
import api from "./api"

// Fetch all projects
export const getAllProjects = async (companyId: number): Promise<ProjectDto[]> => {
    try {
        const res = await api.get(`/projects/company/${companyId}`);
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
        const res = await api.post("/projects", projectDto);
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

// Update an project
export const updateProject = async (id: number, project: ProjectDto): Promise<ProjectDto> => {
    try {
        const res = await api.put(`/projects/${id}`, project);
        return res.data;
    } catch (err) {
        console.error(`Error updating project with id ${id}:`, err);
        throw err;
    }
};

export const updateProjectStatus = async (id: number, status: ProjectDtoStatusEnum): Promise<ProjectDto> => {
    try {
        const res = await api.put(`/projects/${id}/status`, { status }); // 👈 send JSON object
        return res.data;
    } catch (err) {
        console.error(`Error updating project with id ${id}:`, err);
        throw err;
    }
};
  