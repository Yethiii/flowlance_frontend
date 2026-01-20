import React, { useEffect } from 'react'; // Retrait de useState s'il n'est pas utilisé
import axios, { AxiosResponse, AxiosError } from 'axios';

function App() {
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/admin/')
            .then((response: AxiosResponse) => {
                console.log("Connexion Django réussie !", response.status);
            })
            .catch((error: AxiosError) => {
                console.log("Django répond, mais l'accès API est limité :", error.message);
            });
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Flowlance est en ligne ! 🚀</h1>
            <p>Le Frontend React communique avec le Backend Django.</p>
        </div>
    );
}

export default App;