/**
 * VAHAP API Konfiguráció
 *
 * Backend API URL és helper függvények
 */

const VAHAP_API = {
    // API Base URL
    baseURL: 'http://localhost:3000/api',

    // Endpointok
    endpoints: {
        parameterezo: {
            ellenorzesiListak: '/parameterezo/ellenorzesi-listak',
            ellenorzesiListaKriteriumok: (listaKod) => `/parameterezo/ellenorzesi-listak/${listaKod}/kriteriumok`,
            hataridok: '/parameterezo/hataridok',
            hataridoById: (id) => `/parameterezo/hataridok/${id}`,
            dijtetelek: (ugytipusKod) => `/parameterezo/dijtetelek/${ugytipusKod}`,
            dijById: (id) => `/parameterezo/dijak/${id}`,
            kedvezmenyek: (ugytipusKod) => `/parameterezo/kedvezmenyek/${ugytipusKod}`,
            kedvezmenyById: (id) => `/parameterezo/kedvezmenyek/${id}`,
            ugytipusok: '/parameterezo/ugytipusok',
            dokumentumSablonok: '/parameterezo/dokumentum-sablonok',
            dokumentumSablonokGrouped: '/parameterezo/dokumentum-sablonok/grouped',
            workflowSablonok: '/parameterezo/workflow-sablonok',
            workflowSablonById: (id) => `/parameterezo/workflow-sablonok/${id}`,
            workflowLepesek: (workflowId) => `/parameterezo/workflow-sablonok/${workflowId}/lepesek`,
            workflowLepesById: (workflowId, lepesId) => `/parameterezo/workflow-sablonok/${workflowId}/lepesek/${lepesId}`,
            szerepkorok: '/parameterezo/szerepkorok',
            felhasznalok: '/parameterezo/felhasznalok'
        },
        vasut: {
            ugyek: '/vasut/ugyek',
            ugy: (ugyazonosito) => `/vasut/ugyek/${ugyazonosito}`,
            ugyElozmeny: (ugyazonosito) => `/vasut/ugyek/${ugyazonosito}/elozmeny`,
            vny024: '/vasut/nyilvantartas/vny024'
        },
        hajozas: {
            ugyek: '/hajozas/ugyek',
            ugy: (ugyazonosito) => `/hajozas/ugyek/${ugyazonosito}`,
            hny501: '/hajozas/nyilvantartas/hny501'
        },
        health: '/health'
    },

    // HTTP Helper metódusok
    async request(method, endpoint, data = null, params = null) {
        try {
            const url = new URL(this.baseURL + endpoint);

            // Query paraméterek hozzáadása
            if (params) {
                Object.keys(params).forEach(key => {
                    if (params[key] !== null && params[key] !== undefined) {
                        url.searchParams.append(key, params[key]);
                    }
                });
            }

            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Body hozzáadása POST/PUT kéréseknél
            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);

            // HTTP hiba ellenőrzés
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || `HTTP hiba! Státusz: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`[VAHAP API] ${method} ${endpoint} hiba:`, error);
            throw error;
        }
    },

    // GET kérés
    async get(endpoint, params = null) {
        return this.request('GET', endpoint, null, params);
    },

    // POST kérés
    async post(endpoint, data) {
        return this.request('POST', endpoint, data);
    },

    // PUT kérés
    async put(endpoint, data) {
        return this.request('PUT', endpoint, data);
    },

    // DELETE kérés
    async delete(endpoint) {
        return this.request('DELETE', endpoint);
    },

    // Health check
    async healthCheck() {
        try {
            const response = await this.get(this.endpoints.health);
            return response.status === 'OK' && response.database === 'Connected';
        } catch (error) {
            console.error('[VAHAP API] Health check failed:', error);
            return false;
        }
    }
};

// Globálisan elérhető
if (typeof window !== 'undefined') {
    window.VAHAP_API = VAHAP_API;
}
