const API_URL = "http://127.0.0.1:8000/api";

// --- AUTHENTIFICATION ---
export const loginUser = async ({email, password}) => {
    const response = await fetch(`${API_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Identifiants incorrects");
    return await response.json();
};

// --- PROFIL FREELANCE ---
export const getMyFreelanceProfile = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/freelances/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error("Erreur profil");
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
};

export const updateFreelanceProfile = async (profileId, formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/freelances/${profileId}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
    if (!response.ok) throw new Error("Erreur mise à jour profil");
    return await response.json();
};

// --- COMPÉTENCES (SKILLS) ---
export const getMySkills = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/my-skills/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error("Erreur skills");
    return await response.json();
};

export const addSkill = async (skillData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/my-skills/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            skill: skillData.skill_name, 
            level: skillData.skill_level
        }),
    });
    if (!response.ok) throw new Error("Erreur ajout skill");
    return await response.json();
};

export const deleteSkill = async (skillId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/my-skills/${skillId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Erreur suppression");
    return true;
};

export const registerUser = async ({ email, password, role }) => {
    const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
    }
    return await response.json();
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/users/me/`, { 
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        localStorage.removeItem("token");
        throw new Error("Session expirée, merci de vous reconnecter.");
    }

    return await response.json();
};