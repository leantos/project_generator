        let currentStep = 1;
        const totalSteps = 5;
        let configuration = {
            moduleType: 'fullstack',
            fields: [],
            methods: [], // Will use default CRUD methods
            relationships: [],
            apiNotes: '' // Optional custom requirements
        };
        // Methods are now standardized - no need for custom editing

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            updateModuleSummary();
            updateFormVisibility();
            updateEndpointPreview();
        });

        // Step navigation
        document.querySelectorAll('.step-item').forEach(item => {
            item.addEventListener('click', function() {
                const step = parseInt(this.dataset.step);
                if (step <= currentStep || validateCurrentStep()) {
                    goToStep(step);
                }
            });
        });

        function selectModuleType(type) {
            configuration.moduleType = type;
            document.querySelectorAll('.module-type-card').forEach(card => {
                card.classList.remove('selected');
            });
            document.querySelector(`[data-type="${type}"]`).classList.add('selected');
            updateFormVisibility();
        }

        function updateFormVisibility() {
            const moduleType = configuration.moduleType;
            
            // Get elements
            const uiTemplateGroup = document.getElementById('ui-template-group');
            const apiRouteGroup = document.getElementById('api-base-route-group');
            const apiRouteSection = document.getElementById('api-route-section');
            const step2Text = document.querySelector('.step-item[data-step="2"] .step-text');
            const step3Text = document.querySelector('.step-item[data-step="3"] .step-text');
            const step4Text = document.querySelector('.step-item[data-step="4"] .step-text');
            
            // Get the entire UI Template section (the whole form-section)
            const uiTemplateSection = document.querySelector('#step-2 .form-section:has(#ui-template-group)');
            
            // Handle Backend Only - NO UI STUFF AT ALL
            if (moduleType === 'backend') {
                // Hide entire UI template section
                if (uiTemplateSection) {
                    uiTemplateSection.style.display = 'none';
                }
                
                // Hide UI template group
                if (uiTemplateGroup) {
                    uiTemplateGroup.style.display = 'none';
                }
                
                // Show API route field
                if (apiRouteGroup) {
                    apiRouteGroup.style.display = 'block';
                }
                
                // Show API route section in Step 4
                if (apiRouteSection) {
                    apiRouteSection.style.display = 'block';
                }
                
                // Update step text to remove UI references
                if (step2Text) {
                    step2Text.textContent = 'API Configuration';
                }
                
                if (step4Text) {
                    step4Text.textContent = 'API Configuration';
                }
                
                // Entity fields are relevant for backend
                if (step3Text) {
                    step3Text.textContent = 'Entity & Fields';
                }
            } 
            // Handle Frontend Only - NO BACKEND/API STUFF
            else if (moduleType === 'frontend') {
                // Show UI template section
                if (uiTemplateSection) {
                    uiTemplateSection.style.display = 'block';
                }
                
                // Show UI fields within the section
                if (uiTemplateGroup) {
                    uiTemplateGroup.style.display = 'block';
                }
                
                // Hide ALL backend/API fields
                if (apiRouteGroup) {
                    apiRouteGroup.style.display = 'none';
                }
                
                // Hide API route section in Step 4
                if (apiRouteSection) {
                    apiRouteSection.style.display = 'none';
                }
                
                // Update step texts for frontend focus
                if (step2Text) {
                    step2Text.textContent = 'UI Configuration';
                }
                
                if (step4Text) {
                    step4Text.textContent = 'UI Configuration';
                }
                
                // For frontend, entity fields might be for display models
                if (step3Text) {
                    step3Text.textContent = 'Display Fields';
                }
            }
            // Handle Full Stack
            else if (moduleType === 'fullstack') {
                // Show UI template section
                if (uiTemplateSection) {
                    uiTemplateSection.style.display = 'block';
                }
                
                // Show UI fields within the section
                if (uiTemplateGroup) {
                    uiTemplateGroup.style.display = 'block';
                }
                
                // Show API route field
                if (apiRouteGroup) {
                    apiRouteGroup.style.display = 'block';
                }
                
                // Show API route section in Step 4
                if (apiRouteSection) {
                    apiRouteSection.style.display = 'block';
                }
                
                // Update step text
                if (step2Text) {
                    step2Text.textContent = 'UI & API Configuration';
                }
                
                if (step4Text) {
                    step4Text.textContent = 'API Configuration';
                }
                
                // Entity fields for both frontend and backend
                if (step3Text) {
                    step3Text.textContent = 'Entity & Fields';
                }
            }
        }

        function selectUIApproach(approach) {
            const templateSelection = document.getElementById('template-selection');
            const wireframeUpload = document.getElementById('wireframe-upload');
            
            if (approach === 'template') {
                templateSelection.style.display = 'block';
                wireframeUpload.style.display = 'none';
            } else {
                templateSelection.style.display = 'none';
                wireframeUpload.style.display = 'block';
            }
            
            // Update radio button
            document.querySelector(`input[value="${approach}"]`).checked = true;
        }

        // Template selection
        document.addEventListener('DOMContentLoaded', function() {
            // Template option selection
            document.querySelectorAll('.template-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.template-option').forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });

            // File upload handling
            const dropZone = document.getElementById('wireframe-drop-zone');
            const fileInput = document.getElementById('wireframe-file');
            const wireframePreview = document.getElementById('wireframe-preview');
            const wireframeImage = document.getElementById('wireframe-image');

            // Drag and drop events
            dropZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });

            dropZone.addEventListener('dragleave', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
            });

            dropZone.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    handleFileUpload(files[0]);
                }
            });

            // File input change
            fileInput.addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                }
            });

            // Click to upload
            dropZone.addEventListener('click', function() {
                fileInput.click();
            });
        });

        function handleFileUpload(file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('wireframe-image').src = e.target.result;
                    document.getElementById('wireframe-drop-zone').style.display = 'none';
                    document.getElementById('wireframe-preview').style.display = 'block';
                    configuration.wireframeFile = file;
                    configuration.wireframeData = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }

        function removeWireframe() {
            document.getElementById('wireframe-drop-zone').style.display = 'block';
            document.getElementById('wireframe-preview').style.display = 'none';
            document.getElementById('wireframe-file').value = '';
            configuration.wireframeFile = null;
            configuration.wireframeData = null;
        }

        function goToStep(step) {
            document.querySelectorAll('.step-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`step-${step}`).classList.add('active');

            document.querySelectorAll('.step-item').forEach(item => {
                item.classList.remove('active');
                const itemStep = parseInt(item.dataset.step);
                if (itemStep < step) {
                    item.classList.add('completed');
                } else {
                    item.classList.remove('completed');
                }
            });
            document.querySelector(`.step-item[data-step="${step}"]`).classList.add('active');

            currentStep = step;
            updateNavigationButtons();
            
            if (step === 5) {
                showSummary();
            }
        }

        function nextStep() {
            if (currentStep < totalSteps && validateCurrentStep()) {
                goToStep(currentStep + 1);
            }
        }

        function previousStep() {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        }

        function updateNavigationButtons() {
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const generateBtn = document.getElementById('generate-btn');

            prevBtn.style.display = currentStep > 1 ? 'inline-block' : 'none';
            
            if (currentStep === totalSteps) {
                nextBtn.style.display = 'none';
                generateBtn.style.display = 'inline-block';
            } else {
                nextBtn.style.display = 'inline-block';
                generateBtn.style.display = 'none';
            }
        }

        function validateCurrentStep() {
            switch(currentStep) {
                case 2:
                    const moduleName = document.getElementById('module-name').value.trim();
                    if (!moduleName) {
                        alert('Please enter a module name');
                        return false;
                    }
                    break;
                case 3:
                    const entityName = document.getElementById('entity-name').value.trim();
                    if (!entityName) {
                        alert('Please enter an entity name');
                        return false;
                    }
                    break;
            }
            return true;
        }

        function addField() {
            const fieldName = document.getElementById('field-name').value.trim();
            const fieldType = document.getElementById('field-type').value;
            
            if (!fieldName) {
                alert('Please enter a field name');
                return;
            }
            
            // Check if field already exists
            if (configuration.fields.some(f => f.name.toLowerCase() === fieldName.toLowerCase())) {
                alert('Field already exists');
                return;
            }
            
            // Add field with default data source config
            const field = { 
                name: fieldName, 
                type: fieldType,
                dataSource: null // Will be configured if needed
            };
            
            // Auto-detect if field needs data source mapping
            if (fieldName.toLowerCase().includes('_id') || 
                fieldName.toLowerCase().includes('_code') ||
                fieldName.toLowerCase().includes('customer') ||
                fieldName.toLowerCase().includes('product') ||
                fieldName.toLowerCase().includes('user') ||
                fieldName.toLowerCase().includes('site') ||
                fieldName.toLowerCase().includes('tenant')) {
                field.needsDataSource = true;
            }
            
            configuration.fields.push(field);
            updateFieldList();
            updateFieldMappings();
            
            // Clear inputs
            document.getElementById('field-name').value = '';
            document.getElementById('field-type').value = 'string';
        }

        function removeField(index) {
            configuration.fields.splice(index, 1);
            updateFieldList();
            updateFieldMappings();
        }

        function updateFieldList() {
            const fieldList = document.getElementById('field-list');
            const mappingSection = document.getElementById('field-mapping-section');
            const relationshipsSection = document.getElementById('relationships-section');
            
            if (configuration.fields.length === 0) {
                fieldList.innerHTML = '<div style="color: #9aa0a6; text-align: center;">No fields added yet. Add some fields above.</div>';
                mappingSection.style.display = 'none';
                relationshipsSection.style.display = 'none';
                return;
            }
            
            // Show mapping section if there are fields that need data sources
            const fieldsNeedMapping = configuration.fields.some(f => f.needsDataSource || f.type === 'int' || f.name.toLowerCase().includes('_id'));
            if (fieldsNeedMapping) {
                mappingSection.style.display = 'block';
                relationshipsSection.style.display = 'block'; // Also show relationships for foreign keys
            }
            
            fieldList.innerHTML = configuration.fields.map((field, index) => `
                <div class="field-item">
                    <div>
                        <div class="field-name">${field.name}</div>
                        <div class="field-type">${field.type}</div>
                    </div>
                    <div>
                        ${field.needsDataSource ? '<button class="btn-configure" onclick="configureFieldDataSource(' + index + ')">Configure</button>' : ''}
                        <button class="btn-remove" onclick="removeField(${index})">Remove</button>
                    </div>
                </div>
            `).join('');
        }

        function updateFieldMappings() {
            const mappingsDiv = document.getElementById('field-mappings');
            const fieldsNeedMapping = configuration.fields.filter(f => 
                f.needsDataSource || 
                f.type === 'int' && (f.name.toLowerCase().includes('_id') || f.name.toLowerCase().includes('_code'))
            );
            
            if (fieldsNeedMapping.length === 0) {
                mappingsDiv.innerHTML = '<div style="color: #9aa0a6; text-align: center; padding: 20px;">No fields require data source mapping.</div>';
                return;
            }
            
            mappingsDiv.innerHTML = fieldsNeedMapping.map((field, index) => {
                const fieldIndex = configuration.fields.indexOf(field);
                const isEditing = currentEditingFieldIndex === fieldIndex;
                
                // Use empty string as default if field doesn't have a dataSource yet
                const tableValue = field.dataSource?.table || '';
                
                return `
                    <div class="field-mapping-item ${isEditing ? 'editing' : ''}" style="${isEditing ? 'border: 2px solid #8ab4f8; background: #1a1a1a;' : ''}">
                        <div class="field-mapping-header">
                            <div class="field-mapping-title">
                                <span>${field.name}</span>
                                <span class="field-badge">${field.type}</span>
                            </div>
                        </div>
                        ${isEditing ? `
                        <div class="mapping-row">
                            <div class="mapping-label">Source Table:</div>
                            <input type="text" class="mapping-select" id="source-table-${fieldIndex}" 
                                placeholder="e.g., customer, product, user" 
                                value="${tableValue}"
                                onchange="updateFieldDataSource(${fieldIndex}, 'table', this.value)">
                        </div>
                        <div class="mapping-row">
                            <div class="mapping-label">Display Field:</div>
                            <input type="text" class="mapping-select" id="display-field-${fieldIndex}" 
                                placeholder="e.g., customer_name, product_name" 
                                value="${field.dataSource?.displayField || ''}"
                                onchange="updateFieldDataSource(${fieldIndex}, 'displayField', this.value)">
                        </div>
                        <div class="mapping-row">
                            <div class="mapping-label">Value Field:</div>
                            <input type="text" class="mapping-select" id="value-field-${fieldIndex}" 
                                placeholder="e.g., customer_id, product_code" 
                                value="${field.dataSource?.valueField || ''}"
                                onchange="updateFieldDataSource(${fieldIndex}, 'valueField', this.value)">
                        </div>
                        <div class="mapping-row">
                            <div class="mapping-label">Filter (Optional):</div>
                            <input type="text" class="mapping-select" id="filter-${fieldIndex}" 
                                placeholder="e.g., active = true, site_id = @site_id" 
                                value="${field.dataSource?.filter || ''}"
                                onchange="updateFieldDataSource(${fieldIndex}, 'filter', this.value)">
                        </div>
                        <div style="display: flex; gap: 10px; margin-top: 15px; justify-content: flex-end;">
                            <button type="button" class="btn-primary" onclick="saveFieldConfiguration(${fieldIndex})">OK</button>
                            <button type="button" class="btn-secondary" onclick="cancelFieldConfiguration(${fieldIndex})">Cancel</button>
                        </div>
                        ` : `
                        <div style="padding: 10px; color: #9aa0a6;">
                            ${field.dataSource && (field.dataSource.table || field.dataSource.displayField || field.dataSource.valueField) ? `
                                <div><strong>Table:</strong> ${field.dataSource.table || 'Not set'}</div>
                                <div><strong>Display:</strong> ${field.dataSource.displayField || 'Not set'}</div>
                                <div><strong>Value:</strong> ${field.dataSource.valueField || 'Not set'}</div>
                                ${field.dataSource.filter ? `<div><strong>Filter:</strong> ${field.dataSource.filter}</div>` : ''}
                            ` : '<em>Not configured. Click Configure button to set up.</em>'}
                        </div>
                        `}
                    </div>
                `;
            }).join('');
        }

        let currentEditingFieldIndex = -1;
        
        function configureFieldDataSource(index) {
            configuration.fields[index].needsDataSource = true;
            currentEditingFieldIndex = index;
            updateFieldList();
            updateFieldMappings();
            // Scroll to mapping section
            document.getElementById('field-mapping-section').scrollIntoView({ behavior: 'smooth' });
        }

        function updateFieldDataSource(fieldIndex, property, value) {
            if (!configuration.fields[fieldIndex].dataSource) {
                configuration.fields[fieldIndex].dataSource = {};
            }
            configuration.fields[fieldIndex].dataSource[property] = value;
        }
        
        function saveFieldConfiguration(fieldIndex) {
            // Configuration is already saved via onchange events
            // Check if any data was actually entered
            const ds = configuration.fields[fieldIndex].dataSource;
            if (!ds || (!ds.table && !ds.displayField && !ds.valueField)) {
                // No data was configured, remove the needsDataSource flag
                configuration.fields[fieldIndex].needsDataSource = false;
                configuration.fields[fieldIndex].dataSource = null;
            }
            // Close the editing mode
            currentEditingFieldIndex = -1;
            updateFieldList();
            updateFieldMappings();
        }
        
        function cancelFieldConfiguration(fieldIndex) {
            // Reset the field's dataSource if it was being newly configured
            const ds = configuration.fields[fieldIndex].dataSource;
            if (!ds || (!ds.table && !ds.displayField && !ds.valueField)) {
                configuration.fields[fieldIndex].needsDataSource = false;
                configuration.fields[fieldIndex].dataSource = null;
            }
            currentEditingFieldIndex = -1;
            updateFieldList();
            updateFieldMappings();
        }

        function addRelationship() {
            const fromTable = document.getElementById('rel-from-table').value.trim();
            const fromField = document.getElementById('rel-from-field').value.trim();
            const toTable = document.getElementById('rel-to-table').value.trim();
            
            if (!fromTable || !fromField || !toTable) {
                alert('Please fill in all relationship fields');
                return;
            }
            
            // Check if relationship already exists
            const exists = configuration.relationships.some(r => 
                r.fromTable === fromTable && 
                r.fromField === fromField && 
                r.toTable === toTable
            );
            
            if (exists) {
                alert('This relationship already exists');
                return;
            }
            
            configuration.relationships.push({
                fromTable: fromTable,
                fromField: fromField,
                toTable: toTable,
                toField: fromField // Assume same field name in target table (e.g., customer_id -> customer.customer_id)
            });
            
            updateRelationshipsList();
            
            // Clear inputs
            document.getElementById('rel-from-table').value = '';
            document.getElementById('rel-from-field').value = '';
            document.getElementById('rel-to-table').value = '';
            
            // Show relationships section if hidden
            document.getElementById('relationships-section').style.display = 'block';
        }

        function removeRelationship(index) {
            configuration.relationships.splice(index, 1);
            updateRelationshipsList();
        }

        function updateRelationshipsList() {
            const listDiv = document.getElementById('relationships-list');
            
            if (configuration.relationships.length === 0) {
                listDiv.innerHTML = '<div style="color: #9aa0a6; text-align: center;">No relationships defined yet.</div>';
                return;
            }
            
            listDiv.innerHTML = configuration.relationships.map((rel, index) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; margin-bottom: 8px; background: #303134; border-radius: 6px;">
                    <div style="color: #e8eaed;">
                        <strong>${rel.fromTable}</strong>.${rel.fromField} → <strong>${rel.toTable}</strong>
                    </div>
                    <button class="btn-remove" onclick="removeRelationship(${index})">Remove</button>
                </div>
            `).join('');
        }

        // Method management functions
        function addMethod() {
            const operation = document.getElementById('method-operation').value;
            const methodName = document.getElementById('method-name').value.trim();
            const description = document.getElementById('method-description').value.trim();
            
            if (!methodName) {
                alert('Please enter a method name');
                return;
            }
            
            if (!description) {
                alert('Please enter a method description');
                return;
            }
            
            // Check if method already exists
            if (configuration.methods.some(m => m.name.toLowerCase() === methodName.toLowerCase())) {
                alert('Method with this name already exists');
                return;
            }
            
            configuration.methods.push({
                operation: operation,
                name: methodName,
                description: description
            });
            
            updateMethodList();
            updateEndpointPreview();
            
            // Clear inputs
            document.getElementById('method-name').value = '';
            document.getElementById('method-description').value = '';
            document.getElementById('method-operation').value = 'CREATE';
        }

        function removeMethod(index) {
            configuration.methods.splice(index, 1);
            updateMethodList();
            updateEndpointPreview();
        }

        function updateMethodList() {
            const methodList = document.getElementById('method-list');
            
            if (configuration.methods.length === 0) {
                methodList.innerHTML = '<div style="color: #9aa0a6; text-align: center; padding: 20px;">No custom methods added yet. Default CRUD methods will be included automatically.</div>';
                return;
            }
            
            methodList.innerHTML = configuration.methods.map((method, index) => `
                <div class="method-item">
                    <div class="method-info">
                        <div class="method-header">
                            <span class="method-tag ${method.operation.toLowerCase().replace('_', '')}">${method.operation}</span>
                            <span class="method-name">${method.name}</span>
                        </div>
                        <div class="method-description">${method.description}</div>
                    </div>
                    <div class="method-actions">
                        <button class="btn-delete" onclick="removeMethod(${index})">Remove</button>
                    </div>
                </div>
            `).join('');
        }

        function updateEndpointPreview() {
            const previewDiv = document.getElementById('endpoint-preview');
            const moduleName = document.getElementById('module-name')?.value?.trim() || 'YourModule';
            const entityName = document.getElementById('entity-name')?.value?.trim() || 'YourEntity';
            const apiBaseRoute = document.getElementById('api-base-route')?.value?.trim() || `/api/${moduleName.toLowerCase()}`;
            
            // Default CRUD endpoints
            let endpoints = [
                `POST   ${apiBaseRoute}/create     - Create new ${entityName}`,
                `GET    ${apiBaseRoute}/getall     - Get all ${entityName} records`,
                `PUT    ${apiBaseRoute}/update     - Update existing ${entityName}`,
                `DELETE ${apiBaseRoute}/delete/{id} - Delete ${entityName} by ID`,
                `POST   ${apiBaseRoute}/search     - Search ${entityName} records`,
                `GET    ${apiBaseRoute}/getbyid/{id} - Get ${entityName} by ID`,
                `POST   ${apiBaseRoute}/export     - Export ${entityName} data`,
                `POST   ${apiBaseRoute}/import     - Import ${entityName} data`
            ];
            
            // Add custom methods
            configuration.methods.forEach(method => {
                const httpMethod = getHttpMethod(method.operation);
                const endpoint = `${apiBaseRoute}/${method.name.toLowerCase()}`;
                const pathSuffix = ['DELETE', 'GET_ONE'].includes(method.operation) ? '/{id}' : '';
                endpoints.push(`${httpMethod.padEnd(6)} ${endpoint}${pathSuffix} - ${method.description}`);
            });
            
            previewDiv.innerHTML = endpoints.join('\n');
        }

        function getHttpMethod(operation) {
            switch(operation) {
                case 'CREATE': return 'POST';
                case 'READ':
                case 'GET_MANY':
                case 'GET_ONE': return 'GET';
                case 'UPDATE': return 'PUT';
                case 'DELETE': return 'DELETE';
                case 'SEARCH':
                case 'EXPORT':
                case 'IMPORT':
                case 'CUSTOM':
                default: return 'POST';
            }
        }

        // Update API route display when module name changes
        function updateApiRouteDisplay() {
            const moduleName = document.getElementById('module-name')?.value?.trim() || '';
            const apiRouteDisplay = document.getElementById('api-route-display');
            const apiBaseRoute = document.getElementById('api-base-route');
            
            if (apiRouteDisplay) {
                if (moduleName) {
                    const autoRoute = `/api/${moduleName.toLowerCase()}`;
                    apiRouteDisplay.value = apiBaseRoute?.value?.trim() || autoRoute;
                } else {
                    apiRouteDisplay.value = '';
                }
                apiRouteDisplay.placeholder = moduleName ? `/api/${moduleName.toLowerCase()}` : 'Will be auto-generated based on module name';
            }
            
            updateEndpointPreview();
        }

        // Initialize endpoint preview when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            // Update preview when module name or entity name changes
            const moduleNameInput = document.getElementById('module-name');
            const entityNameInput = document.getElementById('entity-name');
            const apiBaseRouteInput = document.getElementById('api-base-route');
            
            if (moduleNameInput) {
                moduleNameInput.addEventListener('input', updateApiRouteDisplay);
            }
            if (entityNameInput) {
                entityNameInput.addEventListener('input', updateEndpointPreview);
            }
            if (apiBaseRouteInput) {
                apiBaseRouteInput.addEventListener('input', updateEndpointPreview);
            }
        });

        function collectConfiguration() {
            const apiBaseRoute = document.getElementById('api-base-route').value.trim();
            const moduleName = document.getElementById('module-name').value.trim();
            const uiApproach = document.querySelector('input[name="ui-approach"]:checked')?.value || 'template';
            
            const config = {
                moduleType: configuration.moduleType,
                moduleName: moduleName,
                moduleCode: document.getElementById('module-code').value.trim(),
                description: document.getElementById('module-description').value.trim(),
                namespacePrefix: '{PROJECT_NAMESPACE}', // Will be replaced with actual namespace from project seed file
                apiBaseRoute: apiBaseRoute || `/api/${moduleName.toLowerCase()}`,
                entityName: document.getElementById('entity-name').value.trim(),
                fields: configuration.fields,
                methods: configuration.methods, // Use configured methods plus defaults
                apiNotes: document.getElementById('api-notes')?.value.trim() || '',
                relationships: configuration.relationships
            };
            
            // Add UI-specific configuration
            if (configuration.moduleType === 'frontend' || configuration.moduleType === 'fullstack') {
                config.uiApproach = uiApproach;
                
                if (uiApproach === 'template') {
                    const selectedTemplate = document.querySelector('.template-option.selected');
                    config.uiTemplate = selectedTemplate ? selectedTemplate.dataset.template : 'MasterDetailCRUDTemplate';
                } else {
                    config.wireframeDescription = document.getElementById('wireframe-description').value.trim();
                    config.hasWireframe = !!configuration.wireframeData;
                    if (configuration.wireframeData) {
                        config.wireframeData = configuration.wireframeData;
                    }
                }
            }
            
            return config;
        }

        function updateModuleSummary() {
            const config = collectConfiguration();
            const summary = document.getElementById('module-summary');
            
            if (!config.moduleName) return;
            
            summary.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px; color: #e8eaed;">
                    <div><strong>Module Type:</strong></div>
                    <div>${config.moduleType.charAt(0).toUpperCase() + config.moduleType.slice(1)}</div>
                    <div><strong>Module Name:</strong></div>
                    <div>${config.moduleName}</div>
                    <div><strong>Namespace:</strong></div>
                    <div>[Inherited from project seed file]</div>
                    ${(config.moduleType === 'frontend' || config.moduleType === 'fullstack') ? `
                    <div><strong>UI Approach:</strong></div>
                    <div>${config.uiApproach === 'template' ? `Template: ${config.uiTemplate}` : 'Custom Wireframe'}</div>` : ''}
                    ${(config.moduleType === 'backend' || config.moduleType === 'fullstack') ? `
                    <div><strong>API Route:</strong></div>
                    <div>${config.apiBaseRoute}</div>` : ''}
                    <div><strong>Entity:</strong></div>
                    <div>${config.entityName}</div>
                    <div><strong>Fields:</strong></div>
                    <div>${config.fields.map(f => `${f.name} (${f.type})${f.dataSource ? ' [mapped]' : ''}`).join(', ') || 'None'}</div>
                    <div><strong>Data Sources:</strong></div>
                    <div>${config.fields.filter(f => f.dataSource).map(f => `${f.name} → ${f.dataSource.table}`).join(', ') || 'None configured'}</div>
                    <div><strong>Relationships:</strong></div>
                    <div>${config.relationships.map(r => `${r.fromTable} → ${r.toTable}`).join(', ') || 'None'}</div>
                    <div><strong>API Endpoints:</strong></div>
                    <div>Standard CRUD operations (Create, Read, Update, Delete, Search, GetById, Export, Import)</div>
                    ${config.apiNotes ? `<div><strong>Special Requirements:</strong></div>
                    <div>${config.apiNotes}</div>` : ''}
                </div>
            `;
        }

        function showSummary() {
            updateModuleSummary();
            const config = collectConfiguration();
            const preview = generateInstructions(config);
            document.getElementById('instructions-preview').textContent = preview.substring(0, 1000) + '...';
        }

        function generateInstructions(config) {
            const timestamp = new Date().toISOString();
            
            return `# MODULE GENERATOR: ${config.moduleName}

## Module Configuration
- **Type**: ${config.moduleType}
- **Entity**: ${config.entityName}
- **Description**: ${config.description}
- **Module Code**: ${config.moduleCode || 'AUTO'}
- **Namespace**: Check project seed file (projectname_*.md) for namespace
${(config.moduleType !== 'frontend') ? `- **API Base Route**: ${config.apiBaseRoute}` : ''}
${(config.moduleType !== 'backend') ? `- **UI Template**: ${config.uiTemplate || 'MasterDetailCRUDTemplate'}
- **UI Approach**: ${config.uiApproach || 'template'}` : ''}

## Entity Definition
\`\`\`
Entity: ${config.entityName}
Fields:
${config.fields.map(f => `  - ${f.name}: ${f.type}${f.dataSource ? ` (lookup from ${f.dataSource.table})` : ''}`).join('\n')}
\`\`\`

${config.relationships.length > 0 ? `## Table Relationships
${config.relationships.map(r => `- ${r.fromTable}.${r.fromField} → ${r.toTable}.${r.toField || r.fromField}`).join('\n')}
` : ''}
${config.fields.filter(f => f.dataSource).length > 0 ? `## Data Source Mappings
${config.fields.filter(f => f.dataSource).map(f => `
**${f.name}:**
- Table: ${f.dataSource.table}
- Display: ${f.dataSource.displayField}
- Value: ${f.dataSource.valueField}
${f.dataSource.filter ? `- Filter: ${f.dataSource.filter}` : ''}`).join('\n')}
` : ''}
${config.apiNotes ? `## Special Requirements
${config.apiNotes}
` : ''}

## Implementation Instructions

${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? `### Backend Implementation

#### 1. Domain Model
**File:** \`[NAMESPACE].Transaction/Domain/${config.entityName}.cs\`
\`\`\`csharp
public class ${config.entityName}
{
    ${config.fields.map(f => `public ${f.type} ${f.name} { get; set; }`).join('\n    ')}
    
    // Nested classes for Search
    public class SearchInput
    {
        public short ClientID { get; set; }
        public short SiteID { get; set; }
        public string SearchTerm { get; set; }
    }
    
    public class SearchOutput
    {
        public List<${config.entityName}> Items { get; set; }
        public int TotalCount { get; set; }
    }
}
\`\`\`

#### 2. Service Interface
**File:** \`[NAMESPACE].Transaction/Interfaces/I${config.entityName}Service.cs\`
- Methods: Create, GetAll, Update, Delete, Search, GetById, Export, Import

#### 3. Service Implementation
**File:** \`[NAMESPACE].Transaction/Services/${config.entityName}Service.cs\`
- Inherit: XOSServiceBase
- Constructor: Accept IServiceProvider and ILogger
- Implement all CRUD operations using repository pattern

#### 4. API Controller
**File:** \`[NAMESPACE].WebApi/Controllers/${config.entityName}Controller.cs\`
- Route: \`${config.apiBaseRoute}\`
- Endpoints:
  - POST ${config.apiBaseRoute}/create
  - GET ${config.apiBaseRoute}/getall
  - PUT ${config.apiBaseRoute}/update
  - DELETE ${config.apiBaseRoute}/delete/{id}
  - POST ${config.apiBaseRoute}/search
  - GET ${config.apiBaseRoute}/getbyid/{id}

#### 5. Dependency Injection
**File:** \`[NAMESPACE].Transaction/Extensions/ServiceExtensions.cs\`
\`\`\`csharp
services.AddScoped<I${config.entityName}Service, ${config.entityName}Service>();
\`\`\`

#### 6. Database Table
\`\`\`sql
CREATE TABLE [namespace]_${config.entityName.toLowerCase()}_mast (
    clnt_id SMALLINT NOT NULL,
    ${config.fields.map(f => `${f.name.toLowerCase()} ${getSqlType(f.type)}`).join(',\n    ')},
    rcrd_stat SMALLINT DEFAULT 1,
    cre_by_usr_cd SMALLINT,
    cre_dttm TIMESTAMP,
    PRIMARY KEY (clnt_id, ${config.fields.find(f => f.name.toLowerCase().includes('id'))?.name.toLowerCase() || 'id'})
);
\`\`\`
` : ''}

${config.moduleType.includes('frontend') || config.moduleType === 'fullstack' ? `### Frontend Implementation

#### 1. ViewModel
**File:** \`UIPages/src/components/${config.moduleName}/${config.entityName}VM.jsx\`
\`\`\`javascript
import { VMBase } from '../../xos-components/VMBase.js';

export class ${config.entityName}VM extends VMBase {
    constructor() {
        super();
        // Observable properties
        ${config.fields.map(f => `this.${f.name.toLowerCase()} = this.observable('');`).join('\n        ')}
        
        // Collections
        this.${config.entityName.toLowerCase()}List = this.observable([]);
        this.isLoading = this.observable(false);
    }
    
    async loadData() {
        const response = await ApiManager.get('${config.apiBaseRoute}/getall');
        this.${config.entityName.toLowerCase()}List.value = response;
    }
    
    async save${config.entityName}() {
        const data = {
            ${config.fields.map(f => `${f.name}: this.${f.name.toLowerCase()}.value`).join(',\n            ')}
        };
        await ApiManager.post('${config.apiBaseRoute}/create', data);
        await this.loadData();
    }
}
\`\`\`

#### 2. React Component
**File:** \`UIPages/src/components/${config.moduleName}/index.jsx\`
- Template: **${config.uiTemplate || 'MasterDetailCRUDTemplate'}**
- Check: \`@claude_docs/frontend/ui-templates/${config.uiTemplate || 'MasterDetailCRUDTemplate'}\`
- Use XOS components (XOSTextbox, XOSGrid, XOSButton)
- Bind to ViewModel properties

${config.uiApproach === 'wireframe' && config.hasWireframe ? `#### 3. Wireframe Notes
- Follow the uploaded wireframe design
- ${config.wireframeDescription || 'Match layout and components shown in the image'}
` : ''}` : ''}

${config.fields.filter(f => f.dataSource).length > 0 ? `## Lookup/Dropdown Configuration
${config.fields.filter(f => f.dataSource).map(f => `
### ${f.name}
- Source Table: \`${f.dataSource.table}\`
- Display Field: \`${f.dataSource.displayField}\`
- Value Field: \`${f.dataSource.valueField}\`
${f.dataSource.filter ? `- Filter: \`${f.dataSource.filter}\`` : ''}
- Implementation: Create dropdown endpoint to load options`).join('\n')}
` : ''}

## Summary

### Files to Create
${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? `**Backend:**
- \`Domain/${config.entityName}.cs\`
- \`Interfaces/I${config.entityName}Service.cs\`
- \`Services/${config.entityName}Service.cs\`
- \`Controllers/${config.entityName}Controller.cs\`
` : ''}
${config.moduleType.includes('frontend') || config.moduleType === 'fullstack' ? `**Frontend:**
- \`components/${config.moduleName}/${config.entityName}VM.jsx\`
- \`components/${config.moduleName}/index.jsx\`
` : ''}

### API Endpoints
All standard CRUD operations:
- Create, Read, Update, Delete
- Search, GetById
- Export, Import

### Important Notes
- ✅ Use namespace from project seed file (look for projectname_*.md)
- ✅ Follow XOS framework patterns (@claude_docs)
- ✅ Database table: \`[namespace]_${config.entityName.toLowerCase()}_mast\`
- ✅ All services use dependency injection
- ✅ Frontend uses MVVM pattern with observables

---
Generated: ${timestamp}
Module Generator v2.0
`;
        }

        // Helper functions for code generation
        function getSqlType(fieldType) {
            switch (fieldType) {
                case 'int': return 'INTEGER';
                case 'short': return 'SMALLINT';
                case 'decimal': return 'DECIMAL(18,2)';
                case 'DateTime': return 'TIMESTAMP';
                case 'bool': return 'BOOLEAN';
                default: return 'VARCHAR(255)';
            }
        }
        
        function generateDomainProperties(fields) {
            if (!fields.length) return '// Add properties here';
            
            return fields.map(field => {
                const propName = field.name.charAt(0).toUpperCase() + field.name.slice(1);
                return `        public ${field.type} ${propName} { get; set; }`;
            }).join('\n');
        }

        function generateNestedClasses(config) {
            return `
        public class SearchInput
        {
            public short ClientID { get; set; }
            public short SiteID { get; set; }
            public string SearchTerm { get; set; }
        }

        public class SearchOutput
        {
            public List<${config.entityName}> Items { get; set; } = new List<${config.entityName}>();
            public int TotalCount { get; set; }
        }`;
        }

        function generateServiceMethods(config) {
            const methods = [];
            const entityName = config.entityName;
            
            // Always use default CRUD methods
            const methodsToGenerate = [
                { operation: 'CREATE', name: 'Create', description: 'Create new record' },
                { operation: 'READ', name: 'GetAll', description: 'Get all records' },
                { operation: 'UPDATE', name: 'Update', description: 'Update existing record' },
                { operation: 'DELETE', name: 'Delete', description: 'Delete record' },
                { operation: 'SEARCH', name: 'Search', description: 'Search records with filters' },
                { operation: 'GET_ONE', name: 'GetById', description: 'Get single record by ID' },
                { operation: 'EXPORT', name: 'Export', description: 'Export records to file' },
                { operation: 'IMPORT', name: 'Import', description: 'Import records from file' }
            ];
            
            methodsToGenerate.forEach(method => {
                switch(method.operation) {
                    case 'CREATE':
                        methods.push(`Task<string> ${method.name}${entityName}Async(${entityName} input);`);
                        break;
                    case 'READ':
                    case 'GET_MANY':
                        methods.push(`Task<List<${entityName}>> ${method.name}${entityName}Async();`);
                        break;
                    case 'UPDATE':
                        methods.push(`Task<string> ${method.name}${entityName}Async(${entityName} input);`);
                        break;
                    case 'DELETE':
                        methods.push(`Task<bool> ${method.name}${entityName}Async(int id);`);
                        break;
                    case 'SEARCH':
                        methods.push(`Task<${entityName}.SearchOutput> ${method.name}${entityName}Async(${entityName}.SearchInput input);`);
                        break;
                    case 'GET_ONE':
                        methods.push(`Task<${entityName}> ${method.name}Async(int id);`);
                        break;
                    case 'EXPORT':
                        methods.push(`Task<byte[]> ${method.name}${entityName}Async(ExportInput input);`);
                        break;
                    case 'IMPORT':
                        methods.push(`Task<ImportResult> ${method.name}${entityName}Async(ImportInput input);`);
                        break;
                    case 'CUSTOM':
                        methods.push(`Task<object> ${method.name}Async(object input); // ${method.description}`);
                        break;
                }
            });
            
            return methods.map(method => `        ${method}`).join('\n');
        }

        function generateServiceImplementation(config) {
            const methods = [];
            const entityName = config.entityName;
            
            // Always use default CRUD methods
            const methodsToGenerate = [
                { operation: 'CREATE', name: 'Create', description: 'Create new record' },
                { operation: 'READ', name: 'GetAll', description: 'Get all records' },
                { operation: 'UPDATE', name: 'Update', description: 'Update existing record' },
                { operation: 'DELETE', name: 'Delete', description: 'Delete record' },
                { operation: 'SEARCH', name: 'Search', description: 'Search records with filters' },
                { operation: 'GET_ONE', name: 'GetById', description: 'Get single record by ID' },
                { operation: 'EXPORT', name: 'Export', description: 'Export records to file' },
                { operation: 'IMPORT', name: 'Import', description: 'Import records from file' }
            ];
            
            methodsToGenerate.forEach(method => {
                const methodImpl = generateMethodImplementation(method, entityName);
                if (methodImpl) {
                    methods.push(methodImpl);
                }
            });
            
            return methods.join('\n\n        ');
        }
        
        function generateMethodImplementation(method, entityName) {
            switch(method.operation) {
                case 'CREATE':
                case 'UPDATE':
                    return `public async Task<string> ${method.name}${entityName}Async(${entityName} input)
        {
            // ${method.description}
            await Task.CompletedTask;
            return "S"; // Success
        }`;
                case 'READ':
                case 'GET_MANY':
                    return `public async Task<List<${entityName}>> ${method.name}${entityName}Async()
        {
            // ${method.description}
            var result = new List<${entityName}>();
            await Task.CompletedTask;
            return result;
        }`;
                case 'DELETE':
                    return `public async Task<bool> ${method.name}${entityName}Async(int id)
        {
            // ${method.description}
            await Task.CompletedTask;
            return true;
        }`;
                case 'SEARCH':
                    return `public async Task<${entityName}.SearchOutput> ${method.name}${entityName}Async(${entityName}.SearchInput input)
        {
            // ${method.description}
            var output = new ${entityName}.SearchOutput();
            try
            {
                // Implementation here
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                this.Logger.LogError(ex, $"${method.name} ${entityName} failed");
            }
            return output;
        }`;
                case 'GET_ONE':
                    return `public async Task<${entityName}> ${method.name}Async(int id)
        {
            // ${method.description}
            await Task.CompletedTask;
            return new ${entityName}();
        }`;
                case 'EXPORT':
                    return `public async Task<byte[]> ${method.name}${entityName}Async(ExportInput input)
        {
            // ${method.description}
            await Task.CompletedTask;
            return new byte[0];
        }`;
                case 'IMPORT':
                    return `public async Task<ImportResult> ${method.name}${entityName}Async(ImportInput input)
        {
            // ${method.description}
            await Task.CompletedTask;
            return new ImportResult();
        }`;
                case 'CUSTOM':
                    return `public async Task<object> ${method.name}Async(object input)
        {
            // ${method.description}
            await Task.CompletedTask;
            return new { Success = true };
        }`;
                default:
                    return null;
            }
        }

        function generateControllerMethods(config) {
            const methods = [];
            const entityName = config.entityName;
            
            // Always use default CRUD methods
            const methodsToGenerate = [
                { operation: 'CREATE', name: 'Create', description: 'Create new record' },
                { operation: 'READ', name: 'GetAll', description: 'Get all records' },
                { operation: 'UPDATE', name: 'Update', description: 'Update existing record' },
                { operation: 'DELETE', name: 'Delete', description: 'Delete record' },
                { operation: 'SEARCH', name: 'Search', description: 'Search records with filters' },
                { operation: 'GET_ONE', name: 'GetById', description: 'Get single record by ID' },
                { operation: 'EXPORT', name: 'Export', description: 'Export records to file' },
                { operation: 'IMPORT', name: 'Import', description: 'Import records from file' }
            ];
            
            methodsToGenerate.forEach(method => {
                const controllerMethod = generateControllerMethod(method, entityName);
                if (controllerMethod) {
                    methods.push(controllerMethod);
                }
            });
            
            return methods.map(method => `        ${method}`).join('\n\n');
        }
        
        function generateControllerMethod(method, entityName) {
            const serviceName = `_${entityName.toLowerCase()}Service`;
            
            switch(method.operation) {
                case 'CREATE':
                    return `[HttpPost("${method.name.toLowerCase()}")]
        public async Task<IActionResult> ${method.name}([FromBody] ${entityName} input)
        {
            var result = await ${serviceName}.${method.name}${entityName}Async(input);
            return Ok(new { Status = result });
        }`;
                case 'UPDATE':
                    return `[HttpPut("${method.name.toLowerCase()}")]
        public async Task<IActionResult> ${method.name}([FromBody] ${entityName} input)
        {
            var result = await ${serviceName}.${method.name}${entityName}Async(input);
            return Ok(new { Status = result });
        }`;
                case 'READ':
                case 'GET_MANY':
                    return `[HttpGet("${method.name.toLowerCase()}")]
        public async Task<IActionResult> ${method.name}()
        {
            var result = await ${serviceName}.${method.name}${entityName}Async();
            return Ok(result);
        }`;
                case 'DELETE':
                    return `[HttpDelete("${method.name.toLowerCase()}/{id}")]
        public async Task<IActionResult> ${method.name}(int id)
        {
            var result = await ${serviceName}.${method.name}${entityName}Async(id);
            return Ok(new { Success = result });
        }`;
                case 'SEARCH':
                    return `[HttpPost("${method.name.toLowerCase()}")]
        public async Task<IActionResult> ${method.name}([FromBody] ${entityName}.SearchInput input)
        {
            var result = await ${serviceName}.${method.name}${entityName}Async(input);
            return Ok(result);
        }`;
                case 'GET_ONE':
                    return `[HttpGet("${method.name.toLowerCase()}/{id}")]
        public async Task<IActionResult> ${method.name}(int id)
        {
            var result = await ${serviceName}.${method.name}Async(id);
            return Ok(result);
        }`;
                case 'EXPORT':
                    return `[HttpPost("${method.name.toLowerCase()}")]
        public async Task<IActionResult> ${method.name}([FromBody] ExportInput input)
        {
            var result = await ${serviceName}.${method.name}${entityName}Async(input);
            return File(result, "application/octet-stream", "${entityName}_export.xlsx");
        }`;
                case 'IMPORT':
                    return `[HttpPost("${method.name.toLowerCase()}")]
        public async Task<IActionResult> ${method.name}([FromBody] ImportInput input)
        {
            var result = await ${serviceName}.${method.name}${entityName}Async(input);
            return Ok(result);
        }`;
                case 'CUSTOM':
                    return `[HttpPost("${method.name.toLowerCase()}")]
        public async Task<IActionResult> ${method.name}([FromBody] object input)
        {
            // ${method.description}
            var result = await ${serviceName}.${method.name}Async(input);
            return Ok(result);
        }`;
                default:
                    return null;
            }
        }

        function generateViewModelProperties(fields) {
            if (!fields.length) return '        // Add properties here';
            
            return fields.map(field => {
                const propName = field.name.charAt(0).toLowerCase() + field.name.slice(1);
                return `        this.${propName} = this.observable('');`;
            }).join('\n');
        }

        function generateViewModelMethods(config) {
            const methods = [];
            const entityName = config.entityName;
            
            // Always add loadData method
            methods.push(`async loadData() {
        try {
            this.isLoading.value = true;
            // Use standard getall endpoint
            const response = await ApiManager.get('${config.apiBaseRoute}/getall');
            this.${entityName.toLowerCase()}List.value = response.Items || response || [];
        } catch (error) {
            console.error('Load data failed:', error);
        } finally {
            this.isLoading.value = false;
        }
    }`);

            // Add save method (standard CRUD always includes this)
            methods.push(`async save${entityName}() {
        try {
            const data = {
                ClientID: this.sessionInfo.ClientID,
                SiteID: this.sessionInfo.SiteID,
                ${config.fields.map(f => `${f.name}: this.${f.name.toLowerCase()}.value`).join(',\n                ')}
            };
            
            const response = await ApiManager.post('${config.apiBaseRoute}/create', data);
            if (response.Status === 'S') {
                await this.loadData();
                this.clearForm();
            }
        } catch (error) {
            console.error('Save failed:', error);
        }
    }`);
            
            // Add delete method (standard CRUD always includes this)
            methods.push(`async delete${entityName}(id) {
        try {
            const response = await ApiManager.delete('${config.apiBaseRoute}/delete/' + id);
            if (response.Success) {
                await this.loadData();
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    }`);
            
            // Add clearForm method
            methods.push(`clearForm() {
        ${config.fields.map(f => `this.${f.name.toLowerCase()}.value = '';`).join('\n        ')}
        this.selectedItem.value = null;
    }`);
            
            return methods.join('\n\n    ');
        }

        function getTemplateInstructions(template, config) {
            // Simplified - Claude Code already knows to check @claude_docs
            return '';
        }

        function getWireframeInstructions(config) {
            // Simplified - wireframe instructions are already in main content
            return '';
        }

        function generateComponentRender(config) {
            return `<div className="module-container">
                    <div className="module-header">
                        <h2>${config.moduleName}</h2>
                    </div>
                    
                    {/* Add your UI components here */}
                    <XOSGrid
                        data={this.vm.${config.entityName.toLowerCase()}List}
                        columns={[
                            ${config.fields.map(f => `{ name: '${f.name}', title: '${f.name}' }`).join(',\n                            ')}
                        ]}
                    />
                </div>`;
        }

        function generateEndpointDocumentation(config) {
            const entityName = config.entityName;
            const apiRoute = config.apiBaseRoute;
            
            // Default CRUD methods
            const defaultMethods = [
                { operation: 'CREATE', name: 'Create', description: 'Create new record' },
                { operation: 'READ', name: 'GetAll', description: 'Get all records' },
                { operation: 'UPDATE', name: 'Update', description: 'Update existing record' },
                { operation: 'DELETE', name: 'Delete', description: 'Delete record' },
                { operation: 'SEARCH', name: 'Search', description: 'Search records with filters' },
                { operation: 'GET_ONE', name: 'GetById', description: 'Get single record by ID' },
                { operation: 'EXPORT', name: 'Export', description: 'Export records to file' },
                { operation: 'IMPORT', name: 'Import', description: 'Import records from file' }
            ];
            
            // Combine default methods with custom methods
            const allMethods = [...defaultMethods];
            
            if (config.methods && config.methods.length > 0) {
                allMethods.push(...config.methods);
            }
            
            const endpoints = [];
            
            allMethods.forEach(method => {
                const httpMethod = getHttpMethodForEndpoint(method.operation);
                const endpoint = `${apiRoute}/${method.name.toLowerCase()}`;
                const pathSuffix = ['DELETE', 'GET_ONE'].includes(method.operation) ? '/{id}' : '';
                const requestBody = getRequestBody(method.operation, entityName);
                
                endpoints.push(`| ${httpMethod} | ${endpoint}${pathSuffix} | ${method.description} | ${requestBody} |`);
            });
            
            return endpoints.join('\n');
        }
        
        function getHttpMethodForEndpoint(operation) {
            switch(operation) {
                case 'CREATE': return 'POST';
                case 'READ':
                case 'GET_MANY':
                case 'GET_ONE': return 'GET';
                case 'UPDATE': return 'PUT';
                case 'DELETE': return 'DELETE';
                case 'SEARCH':
                case 'EXPORT':
                case 'IMPORT':
                case 'CUSTOM':
                default: return 'POST';
            }
        }
        
        function getRequestBody(operation, entityName) {
            switch(operation) {
                case 'CREATE':
                case 'UPDATE': return `${entityName} object`;
                case 'DELETE':
                case 'GET_ONE': return 'id parameter';
                case 'READ':
                case 'GET_MANY': return 'None';
                case 'SEARCH': return 'SearchInput object';
                case 'EXPORT': return 'ExportInput object';
                case 'IMPORT': return 'ImportInput object';
                case 'CUSTOM':
                default: return 'Custom object';
            }
        }

        function generateTableColumns(fields) {
            if (!fields.length) return '    -- Add columns here';
            
            return fields.map(field => {
                let sqlType = 'VARCHAR(255)';
                switch (field.type) {
                    case 'int': sqlType = 'INTEGER'; break;
                    case 'short': sqlType = 'SMALLINT'; break;
                    case 'decimal': sqlType = 'DECIMAL(18,2)'; break;
                    case 'DateTime': sqlType = 'TIMESTAMP'; break;
                    case 'bool': sqlType = 'BOOLEAN'; break;
                }
                return `    ${field.name.toLowerCase()} ${sqlType},`;
            }).join('\n');
        }

        function generateModule() {
            const config = collectConfiguration();
            
            if (!config.moduleName || !config.entityName) {
                alert('Please fill in all required fields');
                return;
            }
            
            let instructions = generateInstructions(config);
            
            // If there's a wireframe, embed it in the markdown
            if (config.hasWireframe && config.wireframeData) {
                const wireframeSection = `

## 🎨 WIREFRAME REFERENCE

**CLAUDE**: The user has provided a wireframe/UI design. Analyze this image carefully:

![Wireframe Design](${config.wireframeData})

**Description**: ${config.wireframeDescription || 'No description provided'}

**Instructions**: 
- Study the wireframe layout and components
- Implement the design using XOS framework components
- Match the visual structure and user interaction patterns shown
- Map wireframe elements to the entity fields provided

---

`;
                // Insert wireframe section after the module configuration
                instructions = instructions.replace('## STEP 1:', wireframeSection + '## STEP 1:');
            }
            
            // Create a blob and download
            const blob = new Blob([instructions], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Generate clean filename with timestamp for uniqueness
            const cleanModuleName = config.moduleName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            
            // Create timestamp: YYYYMMDD_HHMMSS
            const now = new Date();
            const dateStr = now.getFullYear().toString() + 
                           (now.getMonth() + 1).toString().padStart(2, '0') + 
                           now.getDate().toString().padStart(2, '0');
            const timeStr = now.getHours().toString().padStart(2, '0') + 
                           now.getMinutes().toString().padStart(2, '0') +
                           now.getSeconds().toString().padStart(2, '0');
            
            a.download = `${cleanModuleName}_${dateStr}_${timeStr}.md`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Show a success message in the preview area
            const preview = document.getElementById('instructions-preview');
            preview.innerHTML = `<div style="color: #34a853; text-align: center; padding: 20px;">
                <span class="material-icons" style="font-size: 48px;">check_circle</span>
                <h3>Download Started!</h3>
                <p>Your module instructions have been downloaded as:</p>
                <p style="font-family: monospace; color: #8ab4f8;">${a.download}</p>
                <p style="margin-top: 20px;">Give this file to Claude Code to automatically generate your ${config.moduleType} module.</p>
            </div>`;
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            updateFormVisibility();
        });