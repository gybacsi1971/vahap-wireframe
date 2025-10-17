/**
 * VAHAP - Lista/Csempe Nézet Komponens
 * Újrafelhasználható komponens lista és kártyás (csempe) nézet váltásra
 * Használat: <vihar-lista-csempe :items="ugyek" :view-mode="viewMode" @view-change="viewMode = $event">
 */

const ViharListaCsempe = {
    name: 'vihar-lista-csempe',
    props: {
        items: {
            type: Array,
            required: true,
            default: () => []
        },
        viewMode: {
            type: String,
            default: 'csempe', // 'lista' vagy 'csempe'
            validator: (value) => ['lista', 'csempe'].includes(value)
        },
        itemType: {
            type: String,
            default: 'ugy' // 'ugy', 'dokumentum', 'feladat', stb.
        },
        showActions: {
            type: Boolean,
            default: true
        },
        showFilters: {
            type: Boolean,
            default: true
        }
    },
    emits: ['view-change', 'item-click', 'action-click'],
    data() {
        return {
            searchQuery: '',
            statusFilter: '',
            sortBy: 'datum', // 'datum', 'nev', 'statusz'
            sortDirection: 'desc' // 'asc', 'desc'
        };
    },
    computed: {
        filteredItems() {
            let filtered = [...this.items];

            // Keresés
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(item => {
                    return (item.ugyazonosito && item.ugyazonosito.toLowerCase().includes(query)) ||
                           (item.ugyfel && item.ugyfel.nev && item.ugyfel.nev.toLowerCase().includes(query)) ||
                           (item.megnevezes && item.megnevezes.toLowerCase().includes(query));
                });
            }

            // Státusz szűrés
            if (this.statusFilter) {
                filtered = filtered.filter(item => item.statusz === this.statusFilter);
            }

            // Rendezés
            filtered.sort((a, b) => {
                let aVal, bVal;

                switch (this.sortBy) {
                    case 'datum':
                        aVal = new Date(a.benyujtasDatum || a.datum || 0);
                        bVal = new Date(b.benyujtasDatum || b.datum || 0);
                        break;
                    case 'nev':
                        aVal = (a.ugyfel && a.ugyfel.nev) || a.nev || '';
                        bVal = (b.ugyfel && b.ugyfel.nev) || b.nev || '';
                        break;
                    case 'statusz':
                        aVal = a.statusz || '';
                        bVal = b.statusz || '';
                        break;
                    default:
                        return 0;
                }

                if (this.sortDirection === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });

            return filtered;
        },
        uniqueStatuses() {
            const statuses = this.items.map(item => item.statusz).filter(Boolean);
            return [...new Set(statuses)];
        },
        statusBadgeClass() {
            const badgeMap = {
                'folyamatban': 'bg-warning',
                'hiánypótlás': 'bg-danger',
                'tényállás tisztázás': 'bg-info',
                'döntés előkészítése': 'bg-primary',
                'engedélyezve': 'bg-success',
                'jóváhagyva': 'bg-success',
                'elutasítva': 'bg-secondary',
                'új': 'bg-dark',
                'kiosztva': 'bg-primary',
                'véleményezés alatt': 'bg-info'
            };
            return (statusz) => badgeMap[statusz] || 'bg-secondary';
        }
    },
    template: `
        <div class="vihar-lista-csempe">
            <!-- Fejléc: Nézet váltó és szűrők -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <!-- Nézet váltó gombok -->
                <div class="btn-group" role="group">
                    <button type="button"
                            class="btn"
                            :class="viewMode === 'csempe' ? 'btn-primary' : 'btn-outline-primary'"
                            @click="$emit('view-change', 'csempe')">
                        <i class="bi bi-grid-3x3-gap"></i> Csempe
                    </button>
                    <button type="button"
                            class="btn"
                            :class="viewMode === 'lista' ? 'btn-primary' : 'btn-outline-primary'"
                            @click="$emit('view-change', 'lista')">
                        <i class="bi bi-list-ul"></i> Lista
                    </button>
                </div>

                <!-- Rendezés és találatok száma -->
                <div class="d-flex align-items-center gap-2">
                    <span class="text-muted small">
                        {{ filteredItems.length }} / {{ items.length }} elem
                    </span>
                    <div class="dropdown" v-if="showFilters">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown">
                            <i class="bi bi-sort-down"></i> Rendezés
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <a class="dropdown-item" href="#" @click.prevent="sortBy = 'datum'; sortDirection = 'desc'">
                                    <i class="bi bi-calendar"></i> Dátum (új → régi)
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#" @click.prevent="sortBy = 'datum'; sortDirection = 'asc'">
                                    <i class="bi bi-calendar"></i> Dátum (régi → új)
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#" @click.prevent="sortBy = 'nev'; sortDirection = 'asc'">
                                    <i class="bi bi-sort-alpha-down"></i> Név (A → Z)
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#" @click.prevent="sortBy = 'statusz'; sortDirection = 'asc'">
                                    <i class="bi bi-tag"></i> Státusz
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Szűrők -->
            <div v-if="showFilters" class="row g-2 mb-3">
                <!-- Keresés -->
                <div class="col-md-6">
                    <input type="text"
                           class="form-control"
                           v-model="searchQuery"
                           placeholder="Keresés ügyazonosító, név vagy megnevezés alapján...">
                </div>
                <!-- Státusz szűrő -->
                <div class="col-md-6">
                    <select class="form-select" v-model="statusFilter">
                        <option value="">Összes státusz</option>
                        <option v-for="status in uniqueStatuses" :key="status" :value="status">
                            {{ status }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Csempe nézet -->
            <div v-if="viewMode === 'csempe'" class="row">
                <div v-for="item in filteredItems"
                     :key="item.id || item.ugyazonosito"
                     class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 shadow-sm"
                         :class="{'border-primary': item.uj, 'border-warning': item.sulyos}"
                         style="cursor: pointer;"
                         @click="$emit('item-click', item)">
                        <!-- Kártya fejléc -->
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <strong class="small">
                                {{ item.ugyazonosito || item.azonosito || 'N/A' }}
                            </strong>
                            <span class="badge" :class="statusBadgeClass(item.statusz)">
                                {{ item.statusz || 'N/A' }}
                            </span>
                        </div>

                        <!-- Kártya test -->
                        <div class="card-body">
                            <!-- Ügyfél neve -->
                            <h6 class="card-title mb-2">
                                <i class="bi bi-person"></i>
                                {{ item.ugyfel && item.ugyfel.nev || item.nev || 'N/A' }}
                            </h6>

                            <!-- Megnevezés -->
                            <p class="card-text small text-muted mb-2">
                                {{ item.megnevezes || item.leiras || 'Nincs megnevezés' }}
                            </p>

                            <!-- Dátumok -->
                            <div class="small">
                                <div class="mb-1">
                                    <i class="bi bi-calendar"></i>
                                    <strong>Benyújtva:</strong> {{ item.benyujtasDatum || item.datum || 'N/A' }}
                                </div>
                                <div v-if="item.hatarido" class="mb-1">
                                    <i class="bi bi-alarm"></i>
                                    <strong>Határidő:</strong>
                                    <span :class="{'text-danger': isDue(item.hatarido)}">
                                        {{ item.hatarido }}
                                    </span>
                                </div>
                                <div v-if="item.ugyintezo">
                                    <i class="bi bi-person-badge"></i>
                                    <strong>Ügyintéző:</strong> {{ item.ugyintezo }}
                                </div>
                            </div>
                        </div>

                        <!-- Kártya lábléc - Műveletek -->
                        <div v-if="showActions" class="card-footer bg-light">
                            <div class="d-grid gap-2">
                                <button class="btn btn-sm btn-primary" @click.stop="$emit('action-click', {action: 'open', item: item})">
                                    <i class="bi bi-eye"></i> Megnyitás
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Nincs találat -->
                <div v-if="filteredItems.length === 0" class="col-12">
                    <div class="alert alert-info text-center">
                        <i class="bi bi-info-circle"></i>
                        Nincs megjeleníthető elem a szűrési feltételeknek megfelelően.
                    </div>
                </div>
            </div>

            <!-- Lista nézet -->
            <div v-if="viewMode === 'lista'" class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Ügyazonosító</th>
                            <th>Ügyfél / Név</th>
                            <th>Megnevezés</th>
                            <th>Státusz</th>
                            <th>Benyújtva</th>
                            <th>Határidő</th>
                            <th v-if="itemType === 'ugy'">Ügyintéző</th>
                            <th v-if="showActions">Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredItems"
                            :key="item.id || item.ugyazonosito"
                            :class="{'table-primary': item.uj, 'table-warning': item.sulyos}"
                            style="cursor: pointer;"
                            @click="$emit('item-click', item)">
                            <!-- Ügyazonosító -->
                            <td>
                                <strong>{{ item.ugyazonosito || item.azonosito || 'N/A' }}</strong>
                            </td>
                            <!-- Ügyfél neve -->
                            <td>
                                <i class="bi bi-person me-1"></i>
                                {{ item.ugyfel && item.ugyfel.nev || item.nev || 'N/A' }}
                            </td>
                            <!-- Megnevezés -->
                            <td class="small text-muted">
                                {{ item.megnevezes || item.leiras || 'Nincs megnevezés' }}
                            </td>
                            <!-- Státusz -->
                            <td>
                                <span class="badge" :class="statusBadgeClass(item.statusz)">
                                    {{ item.statusz || 'N/A' }}
                                </span>
                            </td>
                            <!-- Benyújtva -->
                            <td class="small">
                                {{ item.benyujtasDatum || item.datum || 'N/A' }}
                            </td>
                            <!-- Határidő -->
                            <td class="small" :class="{'text-danger fw-bold': isDue(item.hatarido)}">
                                {{ item.hatarido || '-' }}
                            </td>
                            <!-- Ügyintéző -->
                            <td v-if="itemType === 'ugy'" class="small">
                                {{ item.ugyintezo || '-' }}
                            </td>
                            <!-- Műveletek -->
                            <td v-if="showActions">
                                <button class="btn btn-sm btn-outline-primary"
                                        @click.stop="$emit('action-click', {action: 'open', item: item})">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Nincs találat -->
                <div v-if="filteredItems.length === 0" class="alert alert-info text-center">
                    <i class="bi bi-info-circle"></i>
                    Nincs megjeleníthető elem a szűrési feltételeknek megfelelően.
                </div>
            </div>
        </div>
    `,
    methods: {
        isDue(deadline) {
            if (!deadline) return false;
            const today = new Date();
            const deadlineDate = new Date(deadline);
            const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
            return diffDays <= 3; // Lejár 3 napon belül
        }
    },
    mounted() {
        console.log('[VAHAP] Lista/Csempe nézet komponens betöltve');
    }
};
