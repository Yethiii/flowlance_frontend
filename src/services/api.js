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

// --- HARD SKILLS ---
export const addSkill = async (skillData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/my-skills/`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            skill: skillData.skill_name,
            level: parseInt(skillData.skill_level),     
            sector_id: parseInt(skillData.sector_id)   
        }),
    });
    
    if (!res.ok) { 
        const err = await res.json(); 
        alert("Erreur Hard Skill: " + JSON.stringify(err)); 
        throw new Error("Erreur Backend"); 
    }
    return await res.json();
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

// --- SECTEURS & SOFT SKILLS ---
export const getSectors = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/sectors/`, { headers: { 'Authorization': `Bearer ${token}` } });
    return await res.json();
};

export const getSoftSkills = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/soft-skills/`, { headers: { 'Authorization': `Bearer ${token}` } });
    return await res.json();
};

export const addEducation = async (formData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/educations/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    return await res.json();
};
export const deleteEducation = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/educations/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
};

export const addCertification = async (formData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/certifications/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    return await res.json();
};
export const deleteCertification = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/certifications/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
};

export const addLicense = async (formData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/licenses/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    return await res.json();
};
export const deleteLicense = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/licenses/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
};

// --- LANGUES ---
export const addLanguage = async (data) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/languages/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return await res.json();
};
export const deleteLanguage = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/languages/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
};

// --- CV & COMPTE ---
export const updateCV = async (profileId, cvFile) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("freelance_cv_file", cvFile);
    const res = await fetch(`${API_URL}/freelances/${profileId}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
    if (!res.ok) {
        const errorData = await res.json();
        console.error("Refus de Django pour le CV:", errorData);
        throw new Error("Le serveur a refusé le fichier.");
    }
    
    return await res.json();
}

// --- GESTION DE LA VIE DU COMPTE ---

export const deactivateAccount = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/freelances/deactivate/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur lors de la suspension");
    return await res.json();
};

export const deleteAccount = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/freelances/delete_account/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    // La suppression renvoie un status 204 (No Content), donc on ne fait pas de .json()
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    return true; 
};

export const getCompanyProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/companies/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur Backend");
    const data = await res.json();
    return data[0]; 
};

export const updateCompanyProfile = async (id, formData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/companies/${id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData, 
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        alert("Refus du serveur (Erreur 400) : " + JSON.stringify(errorData));
        throw new Error("Erreur Backend");
    }
    
    return await res.json();
};

export const deactivateCompanyAccount = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/companies/deactivate/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur lors de la suspension");
    return await res.json();
};

export const deleteCompanyAccount = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/companies/delete_account/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    return true; 
};