import axios from "axios";

export interface Contributor {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
}

export const fetchContributors = async (): Promise<Contributor[]> => {
    try {
        const response = await axios.get("https://api.github.com/repos/MuonNghiCode/work-clock/contributors");
        return response.data;
    } catch (error) {
        console.error("Error fetching contributors:", error);
        return [];
    }
    
}