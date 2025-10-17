/**
 * VAHAP Paraméterező - Univerzális Modal Szerkesztő Komponens
 * Használat: <param-szerkeszto :show="showModal" :schema="formSchema" :data="editedData" :mode="'edit'" @save="handleSave" @cancel="handleCancel"></param-szerkeszto>
 */

const ParamSzerkeszto = {
    name: 'param-szerkeszto',
    emits: ['save', 'cancel', 'close'],
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'Szerkesztés'
        },
        schema: {
            type: Array,
            required: true
            // Formátum: [{ key: 'nev', label: 'Név', type: 'text', required: true, validation: fn }]
        },
        data: {
            type: Object,
            default: () => ({})
        },
        mode: {
            type: String,
            default: 'create', // 'create' | 'edit'
            validator: (value) => ['create', 'edit'].includes(value)
        },
        size: {
            type: String,
            default: 'lg', // 'sm' | 'lg' | 'xl'
            validator: (value) => ['sm', 'lg', 'xl'].includes(value)
        },
        saveButtonText: {
            type: String,
            default: 'Mentés'
        },
        cancelButtonText: {
            type: String,
            default: 'Mégse'
        }
    },
    data() {
        return {
            formData: {},
            errors: {},
            touched: {},
            submitting: false
        };
    },
    computed: {
        modalSizeClass() {
            return `modal-${this.size}`;
        },
        isValid() {
            return Object.keys(this.errors).length === 0;
        },
        modalTitle() {
            return this.mode === 'create' ? `Új ${this.title}` : `${this.title} szerkesztése`;
        }
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.initializeForm();
            }
        },
        data: {
            handler(newVal) {
                if (this.show) {
                    this.initializeForm();
                }
            },
            deep: true
        }
    },
    template: `
        <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog" :class="modalSizeClass">
                <div class="modal-content">
                    <!-- Modal fejléc -->
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi" :class="mode === 'create' ? 'bi-plus-circle' : 'bi-pencil'"></i>
                            {{ modalTitle }}
                        </h5>
                        <button type="button" class="btn-close" @click="handleCancel" :disabled="submitting"></button>
                    </div>

                    <!-- Modal törzs -->
                    <div class="modal-body">
                        <form @submit.prevent="handleSubmit">
                            <div v-for="field in schema" :key="field.key" class="mb-3">

                                <!-- Text input -->
                                <div v-if="field.type === 'text' || field.type === 'email' || field.type === 'url'">
                                    <label :for="field.key" class="form-label">
                                        {{ field.label }}
                                        <span v-if="field.required" class="text-danger">*</span>
                                        <small v-if="field.help" class="text-muted ms-1">
                                            <i class="bi bi-info-circle" :title="field.help"></i>
                                        </small>
                                    </label>
                                    <input
                                        :type="field.type"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors[field.key] && touched[field.key] }"
                                        :id="field.key"
                                        v-model="formData[field.key]"
                                        :placeholder="field.placeholder || ''"
                                        :disabled="field.disabled || submitting"
                                        :maxlength="field.maxLength"
                                        @blur="touchField(field.key)"
                                        @input="validateField(field)">
                                    <div v-if="errors[field.key] && touched[field.key]" class="invalid-feedback">
                                        {{ errors[field.key] }}
                                    </div>
                                    <small v-if="field.hint" class="form-text text-muted">{{ field.hint }}</small>
                                </div>

                                <!-- Number input -->
                                <div v-else-if="field.type === 'number'">
                                    <label :for="field.key" class="form-label">
                                        {{ field.label }}
                                        <span v-if="field.required" class="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors[field.key] && touched[field.key] }"
                                        :id="field.key"
                                        v-model.number="formData[field.key]"
                                        :placeholder="field.placeholder || ''"
                                        :disabled="field.disabled || submitting"
                                        :min="field.min"
                                        :max="field.max"
                                        :step="field.step || 1"
                                        @blur="touchField(field.key)"
                                        @input="validateField(field)">
                                    <div v-if="errors[field.key] && touched[field.key]" class="invalid-feedback">
                                        {{ errors[field.key] }}
                                    </div>
                                    <small v-if="field.hint" class="form-text text-muted">{{ field.hint }}</small>
                                </div>

                                <!-- Textarea -->
                                <div v-else-if="field.type === 'textarea'">
                                    <label :for="field.key" class="form-label">
                                        {{ field.label }}
                                        <span v-if="field.required" class="text-danger">*</span>
                                    </label>
                                    <textarea
                                        class="form-control"
                                        :class="{ 'is-invalid': errors[field.key] && touched[field.key] }"
                                        :id="field.key"
                                        v-model="formData[field.key]"
                                        :placeholder="field.placeholder || ''"
                                        :disabled="field.disabled || submitting"
                                        :rows="field.rows || 3"
                                        :maxlength="field.maxLength"
                                        @blur="touchField(field.key)"
                                        @input="validateField(field)"></textarea>
                                    <div v-if="errors[field.key] && touched[field.key]" class="invalid-feedback">
                                        {{ errors[field.key] }}
                                    </div>
                                    <small v-if="field.hint" class="form-text text-muted">{{ field.hint }}</small>
                                </div>

                                <!-- Select -->
                                <div v-else-if="field.type === 'select'">
                                    <label :for="field.key" class="form-label">
                                        {{ field.label }}
                                        <span v-if="field.required" class="text-danger">*</span>
                                    </label>
                                    <select
                                        class="form-select"
                                        :class="{ 'is-invalid': errors[field.key] && touched[field.key] }"
                                        :id="field.key"
                                        v-model="formData[field.key]"
                                        :disabled="field.disabled || submitting"
                                        @blur="touchField(field.key)"
                                        @change="validateField(field)">
                                        <option value="" v-if="!field.required">-- Válasszon --</option>
                                        <option v-for="option in field.options"
                                                :key="option.value"
                                                :value="option.value">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                    <div v-if="errors[field.key] && touched[field.key]" class="invalid-feedback">
                                        {{ errors[field.key] }}
                                    </div>
                                    <small v-if="field.hint" class="form-text text-muted">{{ field.hint }}</small>
                                </div>

                                <!-- Date -->
                                <div v-else-if="field.type === 'date'">
                                    <label :for="field.key" class="form-label">
                                        {{ field.label }}
                                        <span v-if="field.required" class="text-danger">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors[field.key] && touched[field.key] }"
                                        :id="field.key"
                                        v-model="formData[field.key]"
                                        :disabled="field.disabled || submitting"
                                        :min="field.min"
                                        :max="field.max"
                                        @blur="touchField(field.key)"
                                        @change="validateField(field)">
                                    <div v-if="errors[field.key] && touched[field.key]" class="invalid-feedback">
                                        {{ errors[field.key] }}
                                    </div>
                                    <small v-if="field.hint" class="form-text text-muted">{{ field.hint }}</small>
                                </div>

                                <!-- Checkbox -->
                                <div v-else-if="field.type === 'checkbox'" class="form-check">
                                    <input
                                        type="checkbox"
                                        class="form-check-input"
                                        :class="{ 'is-invalid': errors[field.key] && touched[field.key] }"
                                        :id="field.key"
                                        v-model="formData[field.key]"
                                        :disabled="field.disabled || submitting"
                                        @blur="touchField(field.key)"
                                        @change="validateField(field)">
                                    <label :for="field.key" class="form-check-label">
                                        {{ field.label }}
                                        <span v-if="field.required" class="text-danger">*</span>
                                    </label>
                                    <div v-if="errors[field.key] && touched[field.key]" class="invalid-feedback">
                                        {{ errors[field.key] }}
                                    </div>
                                    <small v-if="field.hint" class="form-text text-muted d-block">{{ field.hint }}</small>
                                </div>

                                <!-- Radio buttons -->
                                <div v-else-if="field.type === 'radio'">
                                    <label class="form-label">
                                        {{ field.label }}
                                        <span v-if="field.required" class="text-danger">*</span>
                                    </label>
                                    <div v-for="option in field.options" :key="option.value" class="form-check">
                                        <input
                                            type="radio"
                                            class="form-check-input"
                                            :class="{ 'is-invalid': errors[field.key] && touched[field.key] }"
                                            :id="field.key + '_' + option.value"
                                            :name="field.key"
                                            :value="option.value"
                                            v-model="formData[field.key]"
                                            :disabled="field.disabled || submitting"
                                            @blur="touchField(field.key)"
                                            @change="validateField(field)">
                                        <label :for="field.key + '_' + option.value" class="form-check-label">
                                            {{ option.label }}
                                        </label>
                                    </div>
                                    <div v-if="errors[field.key] && touched[field.key]" class="invalid-feedback d-block">
                                        {{ errors[field.key] }}
                                    </div>
                                    <small v-if="field.hint" class="form-text text-muted">{{ field.hint }}</small>
                                </div>

                                <!-- Custom slot for complex fields -->
                                <div v-else-if="field.type === 'custom'">
                                    <slot :name="'field-' + field.key" :field="field" :value="formData[field.key]"></slot>
                                </div>

                            </div>
                        </form>
                    </div>

                    <!-- Modal lábléc -->
                    <div class="modal-footer">
                        <button type="button"
                                class="btn btn-secondary"
                                @click="handleCancel"
                                :disabled="submitting">
                            <i class="bi bi-x-circle"></i>
                            {{ cancelButtonText }}
                        </button>
                        <button type="button"
                                class="btn btn-primary"
                                @click="handleSubmit"
                                :disabled="!isValid || submitting">
                            <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                            <i v-else class="bi bi-check-circle"></i>
                            {{ saveButtonText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        initializeForm() {
            // Initialize form data from props or set defaults
            this.formData = { ...this.data };
            this.errors = {};
            this.touched = {};

            // Set default values for fields
            this.schema.forEach(field => {
                if (!(field.key in this.formData)) {
                    if (field.type === 'checkbox') {
                        this.formData[field.key] = field.default || false;
                    } else if (field.type === 'number') {
                        this.formData[field.key] = field.default || 0;
                    } else {
                        this.formData[field.key] = field.default || '';
                    }
                }
            });
        },

        touchField(key) {
            this.touched[key] = true;
        },

        validateField(field) {
            const value = this.formData[field.key];

            // Required validation
            if (field.required) {
                if (field.type === 'checkbox') {
                    if (!value) {
                        this.errors[field.key] = `${field.label} kötelező`;
                        return false;
                    }
                } else if (!value && value !== 0) {
                    this.errors[field.key] = `${field.label} kötelező`;
                    return false;
                }
            }

            // Type-specific validation
            if (value) {
                if (field.type === 'email' && !this.isValidEmail(value)) {
                    this.errors[field.key] = 'Érvénytelen email cím';
                    return false;
                }

                if (field.type === 'url' && !this.isValidUrl(value)) {
                    this.errors[field.key] = 'Érvénytelen URL';
                    return false;
                }

                if (field.type === 'number') {
                    if (field.min !== undefined && value < field.min) {
                        this.errors[field.key] = `Minimum érték: ${field.min}`;
                        return false;
                    }
                    if (field.max !== undefined && value > field.max) {
                        this.errors[field.key] = `Maximum érték: ${field.max}`;
                        return false;
                    }
                }

                if (field.maxLength && value.length > field.maxLength) {
                    this.errors[field.key] = `Maximum ${field.maxLength} karakter`;
                    return false;
                }
            }

            // Custom validation function
            if (field.validation && typeof field.validation === 'function') {
                const validationResult = field.validation(value, this.formData);
                if (validationResult !== true) {
                    this.errors[field.key] = validationResult;
                    return false;
                }
            }

            // Clear error if valid
            delete this.errors[field.key];
            return true;
        },

        validateForm() {
            let isValid = true;
            this.schema.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                    this.touched[field.key] = true;
                }
            });
            return isValid;
        },

        handleSubmit() {
            if (!this.validateForm()) {
                return;
            }

            this.submitting = true;

            // Clone form data to prevent mutation
            const dataToSave = { ...this.formData };

            this.$emit('save', dataToSave);

            // Reset submitting state after a delay (parent should close modal)
            setTimeout(() => {
                this.submitting = false;
            }, 500);
        },

        handleCancel() {
            if (!this.submitting) {
                this.$emit('cancel');
                this.$emit('close');
            }
        },

        isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        isValidUrl(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        }
    },
    mounted() {
        if (this.show) {
            this.initializeForm();
        }
    }
};

if (typeof window !== 'undefined') {
    window.ParamSzerkeszto = ParamSzerkeszto;
}
