/**
 * VAHAP Paraméterező - Univerzális Táblázat Komponens
 * Használat: <param-tabla :columns="columns" :data="data" :sortable="true" @edit="handleEdit" @delete="handleDelete"></param-tabla>
 */

const ParamTabla = {
    name: 'param-tabla',
    emits: ['edit', 'delete', 'sort', 'select', 'action'],
    props: {
        columns: {
            type: Array,
            required: true
            // Formátum: [{ key: 'nev', label: 'Név', sortable: true, type: 'string', width: '200px' }]
        },
        data: {
            type: Array,
            default: () => []
        },
        sortable: {
            type: Boolean,
            default: true
        },
        filterable: {
            type: Boolean,
            default: true
        },
        editable: {
            type: Boolean,
            default: true
        },
        deletable: {
            type: Boolean,
            default: true
        },
        selectable: {
            type: Boolean,
            default: false
        },
        striped: {
            type: Boolean,
            default: true
        },
        hover: {
            type: Boolean,
            default: true
        },
        bordered: {
            type: Boolean,
            default: true
        },
        small: {
            type: Boolean,
            default: false
        },
        emptyText: {
            type: String,
            default: 'Nincs megjelen íthető adat'
        },
        actionsLabel: {
            type: String,
            default: 'Műveletek'
        }
    },
    data() {
        return {
            sortKey: '',
            sortOrder: 'asc',
            filterText: '',
            selectedRows: []
        };
    },
    computed: {
        tableClasses() {
            return {
                'table': true,
                'table-striped': this.striped,
                'table-hover': this.hover,
                'table-bordered': this.bordered,
                'table-sm': this.small
            };
        },
        filteredData() {
            let result = [...this.data];

            // Szűrés
            if (this.filterable && this.filterText) {
                const search = this.filterText.toLowerCase();
                result = result.filter(row => {
                    return this.columns.some(col => {
                        const value = this.getCellValue(row, col.key);
                        return value && value.toString().toLowerCase().includes(search);
                    });
                });
            }

            // Rendezés
            if (this.sortKey) {
                result.sort((a, b) => {
                    const aVal = this.getCellValue(a, this.sortKey);
                    const bVal = this.getCellValue(b, this.sortKey);

                    let comparison = 0;
                    if (aVal < bVal) comparison = -1;
                    if (aVal > bVal) comparison = 1;

                    return this.sortOrder === 'asc' ? comparison : -comparison;
                });
            }

            return result;
        },
        hasActions() {
            return this.editable || this.deletable;
        }
    },
    template: `
        <div class="param-tabla">
            <!-- Eszköztár -->
            <div v-if="filterable || selectable" class="tabla-toolbar mb-3 d-flex justify-content-between align-items-center">
                <div v-if="filterable" class="tabla-filter">
                    <div class="input-group" style="max-width: 300px;">
                        <span class="input-group-text">
                            <i class="bi bi-search"></i>
                        </span>
                        <input type="text"
                               class="form-control"
                               v-model="filterText"
                               placeholder="Keresés...">
                        <button v-if="filterText"
                                class="btn btn-outline-secondary"
                                @click="filterText = ''">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                </div>

                <div v-if="selectable && selectedRows.length > 0" class="tabla-selection-info">
                    <span class="badge bg-primary">
                        {{ selectedRows.length }} kijelölve
                    </span>
                    <button class="btn btn-sm btn-outline-danger ms-2" @click="selectedRows = []">
                        <i class="bi bi-x"></i> Kijelölés törlése
                    </button>
                </div>
            </div>

            <!-- Táblázat -->
            <div class="table-responsive">
                <table :class="tableClasses">
                    <thead class="table-light">
                        <tr>
                            <!-- Kijelölő checkbox -->
                            <th v-if="selectable" style="width: 40px;">
                                <input type="checkbox"
                                       class="form-check-input"
                                       @change="toggleAllSelection"
                                       :checked="selectedRows.length === data.length && data.length > 0">
                            </th>

                            <!-- Oszlopok -->
                            <th v-for="col in columns"
                                :key="col.key"
                                :style="col.width ? { width: col.width } : {}"
                                :class="{
                                    'sortable-column': sortable && col.sortable !== false,
                                    'sorted-asc': sortKey === col.key && sortOrder === 'asc',
                                    'sorted-desc': sortKey === col.key && sortOrder === 'desc'
                                }"
                                @click="sortable && col.sortable !== false && sortByColumn(col.key)">
                                {{ col.label }}
                                <i v-if="sortable && col.sortable !== false"
                                   class="bi ms-1"
                                   :class="{
                                       'bi-chevron-expand': sortKey !== col.key,
                                       'bi-chevron-up': sortKey === col.key && sortOrder === 'asc',
                                       'bi-chevron-down': sortKey === col.key && sortOrder === 'desc'
                                   }"></i>
                            </th>

                            <!-- Műveletek oszlop -->
                            <th v-if="hasActions" style="width: 120px;">
                                {{ actionsLabel }}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <!-- Üres állapot -->
                        <tr v-if="filteredData.length === 0">
                            <td :colspan="columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)"
                                class="text-center text-muted py-4">
                                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                {{ emptyText }}
                            </td>
                        </tr>

                        <!-- Adatsorok -->
                        <tr v-for="(row, index) in filteredData"
                            :key="index"
                            :class="{ 'table-active': isRowSelected(row) }">

                            <!-- Kijelölő checkbox -->
                            <td v-if="selectable">
                                <input type="checkbox"
                                       class="form-check-input"
                                       :checked="isRowSelected(row)"
                                       @change="toggleRowSelection(row)">
                            </td>

                            <!-- Adatok -->
                            <td v-for="col in columns" :key="col.key">
                                <span v-if="col.type === 'badge'"
                                      class="badge"
                                      :class="getBadgeClass(row, col)">
                                    {{ getCellValue(row, col.key) }}
                                </span>
                                <span v-else-if="col.type === 'boolean'">
                                    <i class="bi"
                                       :class="getCellValue(row, col.key) ? 'bi-check-circle text-success' : 'bi-x-circle text-danger'"></i>
                                </span>
                                <span v-else-if="col.type === 'date'">
                                    {{ formatDate(getCellValue(row, col.key)) }}
                                </span>
                                <span v-else-if="col.format">
                                    {{ col.format(getCellValue(row, col.key), row) }}
                                </span>
                                <span v-else>
                                    {{ getCellValue(row, col.key) }}
                                </span>
                            </td>

                            <!-- Műveletek -->
                            <td v-if="hasActions">
                                <div class="btn-group btn-group-sm">
                                    <button v-if="editable"
                                            class="btn btn-outline-primary"
                                            @click="$emit('edit', row)"
                                            title="Szerkesztés">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button v-if="deletable"
                                            class="btn btn-outline-danger"
                                            @click="confirmDelete(row)"
                                            title="Törlés">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Információs sáv -->
            <div class="tabla-footer mt-2 d-flex justify-content-between align-items-center text-muted small">
                <div>
                    Összesen: <strong>{{ filteredData.length }}</strong> elem
                    <span v-if="filterText">({{ data.length }}-ból szűrve)</span>
                </div>
            </div>
        </div>
    `,
    methods: {
        getCellValue(row, key) {
            return key.split('.').reduce((obj, k) => obj?.[k], row);
        },
        getBadgeClass(row, col) {
            if (col.badgeClass) {
                return col.badgeClass(this.getCellValue(row, col.key), row);
            }
            return 'bg-secondary';
        },
        formatDate(date) {
            if (!date) return '-';
            const d = new Date(date);
            return d.toLocaleDateString('hu-HU');
        },
        sortByColumn(key) {
            if (this.sortKey === key) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = key;
                this.sortOrder = 'asc';
            }
            this.$emit('sort', { key, order: this.sortOrder });
        },
        isRowSelected(row) {
            return this.selectedRows.includes(row);
        },
        toggleRowSelection(row) {
            const index = this.selectedRows.indexOf(row);
            if (index > -1) {
                this.selectedRows.splice(index, 1);
            } else {
                this.selectedRows.push(row);
            }
            this.$emit('select', this.selectedRows);
        },
        toggleAllSelection() {
            if (this.selectedRows.length === this.data.length) {
                this.selectedRows = [];
            } else {
                this.selectedRows = [...this.data];
            }
            this.$emit('select', this.selectedRows);
        },
        confirmDelete(row) {
            if (confirm('Biztosan törli ezt az elemet?')) {
                this.$emit('delete', row);
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.ParamTabla = ParamTabla;
}
