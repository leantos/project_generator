        let currentStep = 1;
        const totalSteps = 5;
        let configuration = {
            moduleType: 'fullstack',
            fields: [],
            methods: [],
            relationships: []
        };
        let editingMethodIndex = -1;

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            updateModuleSummary();
            updateFormVisibility();
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
            const step2Text = document.querySelector('.step-item[data-step="2"] .step-text');
            const step3Text = document.querySelector('.step-item[data-step="3"] .step-text');
            
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
                
                // Update step text to remove UI references
                if (step2Text) {
                    step2Text.textContent = 'API Configuration';
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
                
                // Update step texts for frontend focus
                if (step2Text) {
                    step2Text.textContent = 'UI Configuration';
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
                
                // Update step text
                if (step2Text) {
                    step2Text.textContent = 'UI & API Configuration';
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
            
            // Get the table name from the input field to use as default
            const defaultTableName = document.getElementById('table-name')?.value.trim() || '';
            
            mappingsDiv.innerHTML = fieldsNeedMapping.map((field, index) => {
                const fieldIndex = configuration.fields.indexOf(field);
                
                // Use the entered table name as default if field doesn't have a dataSource yet
                const tableValue = field.dataSource?.table || defaultTableName;
                
                return `
                    <div class="field-mapping-item">
                        <div class="field-mapping-header">
                            <div class="field-mapping-title">
                                <span>${field.name}</span>
                                <span class="field-badge">${field.type}</span>
                            </div>
                        </div>
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
                    </div>
                `;
            }).join('');
        }

        function configureFieldDataSource(index) {
            configuration.fields[index].needsDataSource = true;
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

        function addMethod() {
            const operation = document.getElementById('method-operation').value;
            const methodName = document.getElementById('method-name').value.trim();
            const description = document.getElementById('method-description').value.trim();
            
            // Set default method names based on operation if not provided
            const defaultNames = {
                'CREATE': 'Create',
                'READ': 'GetAll',
                'UPDATE': 'Update',
                'DELETE': 'Delete',
                'SEARCH': 'Search',
                'GET_ONE': 'GetById',
                'GET_MANY': 'GetByFilter',
                'EXPORT': 'Export',
                'IMPORT': 'Import',
                'CUSTOM': 'CustomMethod'
            };
            
            const name = methodName || defaultNames[operation];
            const desc = description || `${operation} operation`;
            
            // Check if method already exists
            if (configuration.methods.some(m => m.name.toLowerCase() === name.toLowerCase())) {
                alert('Method with this name already exists');
                return;
            }
            
            configuration.methods.push({
                operation: operation,
                name: name,
                description: desc
            });
            
            updateMethodList();
            
            // Clear inputs
            document.getElementById('method-name').value = '';
            document.getElementById('method-description').value = '';
            document.getElementById('method-operation').value = 'CREATE';
        }

        function addQuickMethod(operation, name, description) {
            // Check if method already exists
            if (configuration.methods.some(m => m.name.toLowerCase() === name.toLowerCase())) {
                alert(`Method "${name}" already exists`);
                return;
            }
            
            configuration.methods.push({
                operation: operation,
                name: name,
                description: description
            });
            
            updateMethodList();
        }

        function removeMethod(index) {
            configuration.methods.splice(index, 1);
            updateMethodList();
        }

        function updateMethodList() {
            const methodList = document.getElementById('method-list');
            
            if (configuration.methods.length === 0) {
                methodList.innerHTML = '<div style="color: #9aa0a6; text-align: center; padding: 20px;">No methods added yet. Use the quick add buttons or add custom methods above.</div>';
                return;
            }
            
            methodList.innerHTML = configuration.methods.map((method, index) => {
                if (editingMethodIndex === index) {
                    // Show edit form
                    return `
                        <div class="method-item editing" style="display: flex; gap: 16px;">
                            <div class="method-edit-form">
                                <div class="edit-row">
                                    <span class="method-tag ${method.operation.toLowerCase().replace('_', '')}">${method.operation}</span>
                                    <input type="text" class="edit-input" id="edit-name-${index}" value="${method.name}" placeholder="Method name (e.g., FindStudentById, CreateNewRecord)">
                                </div>
                                <div class="edit-row">
                                    <input type="text" class="edit-input" id="edit-desc-${index}" value="${method.description}" placeholder="Method description - what does this method do?">
                                </div>
                            </div>
                            <div class="method-actions" style="display: flex; flex-direction: column; gap: 6px;">
                                <button class="btn-save" onclick="saveMethodEdit(${index})">Save</button>
                                <button class="btn-cancel" onclick="cancelMethodEdit()">Cancel</button>
                            </div>
                        </div>
                    `;
                } else {
                    // Show normal view
                    return `
                        <div class="method-item">
                            <div class="method-info">
                                <div class="method-header">
                                    <span class="method-tag ${method.operation.toLowerCase().replace('_', '')}">${method.operation}</span>
                                    <span class="method-name">${method.name}</span>
                                </div>
                                <div class="method-description">${method.description}</div>
                            </div>
                            <div class="method-actions">
                                <button class="btn-edit" onclick="editMethod(${index})">Edit</button>
                                <button class="btn-remove" onclick="removeMethod(${index})">Remove</button>
                            </div>
                        </div>
                    `;
                }
            }).join('');
        }

        function editMethod(index) {
            editingMethodIndex = index;
            updateMethodList();
            // Focus on the name input
            setTimeout(() => {
                const nameInput = document.getElementById(`edit-name-${index}`);
                const descInput = document.getElementById(`edit-desc-${index}`);
                
                if (nameInput) {
                    nameInput.focus();
                    nameInput.select();
                    
                    // Add keyboard event listeners
                    nameInput.addEventListener('keydown', (e) => handleEditKeydown(e, index));
                    descInput.addEventListener('keydown', (e) => handleEditKeydown(e, index));
                }
            }, 0);
        }
        
        function handleEditKeydown(event, index) {
            if (event.key === 'Enter') {
                event.preventDefault();
                saveMethodEdit(index);
            } else if (event.key === 'Escape') {
                event.preventDefault();
                cancelMethodEdit();
            }
        }

        function saveMethodEdit(index) {
            const nameInput = document.getElementById(`edit-name-${index}`);
            const descInput = document.getElementById(`edit-desc-${index}`);
            
            const newName = nameInput.value.trim();
            const newDesc = descInput.value.trim();
            
            if (!newName) {
                alert('Method name is required');
                return;
            }
            
            // Check if another method has the same name (excluding current method)
            const duplicate = configuration.methods.some((m, i) => 
                i !== index && m.name.toLowerCase() === newName.toLowerCase()
            );
            
            if (duplicate) {
                alert('Another method with this name already exists');
                return;
            }
            
            // Update the method
            configuration.methods[index].name = newName;
            configuration.methods[index].description = newDesc || `${configuration.methods[index].operation} operation`;
            
            editingMethodIndex = -1;
            updateMethodList();
        }

        function cancelMethodEdit() {
            editingMethodIndex = -1;
            updateMethodList();
        }

        function collectConfiguration() {
            const apiBaseRoute = document.getElementById('api-base-route').value.trim();
            const moduleName = document.getElementById('module-name').value.trim();
            const uiApproach = document.querySelector('input[name="ui-approach"]:checked')?.value || 'template';
            
            const config = {
                moduleType: configuration.moduleType,
                moduleName: moduleName,
                moduleCode: document.getElementById('module-code').value.trim(),
                description: document.getElementById('module-description').value.trim(),
                namespacePrefix: '{PROJECT_NAMESPACE}', // Will be replaced with actual namespace from PROJECT_SEED.md
                apiBaseRoute: apiBaseRoute || `/api/${moduleName.toLowerCase()}`,
                entityName: document.getElementById('entity-name').value.trim(),
                tableName: document.getElementById('table-name').value.trim(),
                fields: configuration.fields,
                methods: configuration.methods,
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
                    <div>[Inherited from PROJECT_SEED.md]</div>
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
                    <div><strong>Methods:</strong></div>
                    <div>${config.methods.map(m => `${m.name} (${m.operation})`).join(', ') || 'None'}</div>
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

## CLAUDE CODE - BUILD THIS MODULE

**IMPORTANT: You MUST check @claude_docs for XOS framework patterns before implementing!**

This file contains instructions to create a ${config.moduleType} module for ${config.moduleName}.

### 🔴 MANDATORY: Check @claude_docs First!
**CLAUDE: Before writing ANY code, you MUST:**
1. Check @claude_docs/xos-framework/patterns for the correct implementation patterns
2. Review @claude_docs/xos-framework/components for component usage
3. Follow @claude_docs/best-practices for code standards
4. Use @claude_docs/frontend/ui-templates for UI template references

**DO NOT PROCEED without checking @claude_docs for the proper XOS patterns!**

### 📦 IMPORTANT: Namespace Configuration
**The namespace for this module should be inherited from the PROJECT_SEED.md file in the root directory.**
- Look for the namespace configuration in PROJECT_SEED.md
- Use that namespace throughout this module (e.g., if PROJECT_SEED.md specifies "CVS", use "CVS.Transaction.Domain", etc.)

### Module Configuration
- **Name**: ${config.moduleName}
- **Type**: ${config.moduleType}
- **Entity**: ${config.entityName}
- **Namespace**: [Use namespace from PROJECT_SEED.md]
- **Code**: ${config.moduleCode || 'Generated'}
${(config.moduleType === 'frontend' || config.moduleType === 'fullstack') ? `- **UI Template**: ${config.uiTemplate}` : ''}
${(config.moduleType === 'backend' || config.moduleType === 'fullstack') ? `- **API Route**: ${config.apiBaseRoute}` : ''}

### Data Source Mappings
${config.fields.filter(f => f.dataSource).length > 0 ? config.fields.filter(f => f.dataSource).map(f => `
#### Field: ${f.name}
- **Source Table**: ${f.dataSource.table}
- **Display Field**: ${f.dataSource.displayField}
- **Value Field**: ${f.dataSource.valueField}
- **Filter**: ${f.dataSource.filter || 'None'}
`).join('') : 'No data source mappings configured.'}

### Table Relationships
${config.relationships.length > 0 ? config.relationships.map(r => `
- **${r.fromTable}.${r.fromField}** → **${r.toTable}.${r.toField || r.fromField}**
`).join('') : 'No relationships defined.'}

## STEP 1: Create Domain Model ${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? '' : '(Skip for frontend-only)'}

${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? `
**CLAUDE: Create the domain model class:**

### CREATE FILE: [PROJECT_NAMESPACE].Transaction/Domain/${config.entityName}.cs
\`\`\`csharp
using System.ComponentModel.DataAnnotations;

namespace [PROJECT_NAMESPACE].Transaction.Domain
{
    public class ${config.entityName}
    {
        ${generateDomainProperties(config.fields)}
        
        ${generateNestedClasses(config)}
    }
}
\`\`\`
` : ''}

## STEP 2: Create Service Interface ${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? '' : '(Skip for frontend-only)'}

${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? `
**CLAUDE: Create the service interface:**

### CREATE FILE: [PROJECT_NAMESPACE].Transaction/Interfaces/I${config.entityName}Service.cs
\`\`\`csharp
using [PROJECT_NAMESPACE].Transaction.Domain;

namespace [PROJECT_NAMESPACE].Transaction.Interfaces
{
    public interface I${config.entityName}Service
    {
        ${generateServiceMethods(config)}
    }
}
\`\`\`
` : ''}

## STEP 3: Create Service Implementation ${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? '' : '(Skip for frontend-only)'}

${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? `
**CLAUDE: Create the service implementation following @claude_docs patterns:**

⚠️ **IMPORTANT**: Check @claude_docs/xos-framework/services/service-base for XOSServiceBase patterns
⚠️ **IMPORTANT**: Review @claude_docs/xos-framework/data-access for repository patterns
⚠️ **IMPORTANT**: Follow @claude_docs/error-handling for proper error handling

### CREATE FILE: [PROJECT_NAMESPACE].Transaction/Services/${config.entityName}Service.cs
\`\`\`csharp
using [PROJECT_NAMESPACE].Transaction.Core;
using [PROJECT_NAMESPACE].Transaction.Domain;
using [PROJECT_NAMESPACE].Transaction.Interfaces;
using Microsoft.Extensions.Logging;
using XOS.Data;

namespace [PROJECT_NAMESPACE].Transaction.Services
{
    public class ${config.entityName}Service : XOSServiceBase, I${config.entityName}Service
    {
        #region Constructor
        
        public ${config.entityName}Service(IServiceProvider serviceProvider, ILogger<${config.entityName}Service> logger)
          : base(serviceProvider, logger)
        {
        }
        
        #endregion
        
        #region Public Methods
        
        ${generateServiceImplementation(config)}
        
        #endregion
        
        #region Private Methods
        
        // Add private helper methods here
        
        #endregion
    }
}
\`\`\`
` : ''}

## STEP 4: Create API Controller ${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? '' : '(Skip for frontend-only)'}

${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? `
**CLAUDE: Create the API controller:**

### CREATE FILE: ${config.namespacePrefix}.WebApi/Controllers/${config.entityName}Controller.cs
\`\`\`csharp
using ${config.namespacePrefix}.Transaction.Domain;
using ${config.namespacePrefix}.Transaction.Interfaces;
using ${config.namespacePrefix}.WebApi.Domain;
using Microsoft.AspNetCore.Mvc;

namespace ${config.namespacePrefix}.WebApi.Controllers
{
    [Route("${config.apiBaseRoute}")]
    [ApiController]
    public class ${config.entityName}Controller : XOSBaseController
    {
        private readonly I${config.entityName}Service _${config.entityName.toLowerCase()}Service;
        
        public ${config.entityName}Controller(I${config.entityName}Service ${config.entityName.toLowerCase()}Service)
        {
            _${config.entityName.toLowerCase()}Service = ${config.entityName.toLowerCase()}Service;
        }
        
        ${generateControllerMethods(config)}
    }
}
\`\`\`
` : ''}

## STEP 5: Create Frontend Components ${config.moduleType.includes('frontend') || config.moduleType === 'fullstack' ? '' : '(Skip for backend-only)'}

${config.moduleType.includes('frontend') || config.moduleType === 'fullstack' ? `
**CLAUDE: Create the React components${config.uiApproach === 'template' ? ` using ${config.uiTemplate}` : ' based on the wireframe'}:**

### 📌 CRITICAL: You MUST check @claude_docs before proceeding!
1. **@claude_docs/xos-framework/components** - For XOSComponent base class patterns
2. **@claude_docs/xos-framework/mvvm** - For ViewModel (VM) implementation patterns  
3. **@claude_docs/xos-framework/observable** - For observable state management
4. **@claude_docs/frontend/ui-templates** - For UI template implementations
5. **@claude_docs/frontend/xos-components** - For XOS UI component usage (XOSTextbox, XOSGrid, etc.)

${config.uiApproach === 'wireframe' && config.hasWireframe ? `
### 🎨 WIREFRAME ANALYSIS REQUIRED

**CLAUDE**: The user has uploaded a wireframe/UI design. You need to:
1. **Analyze the wireframe image** provided in the generated file
2. **Understand the layout, components, and user interactions**
3. **Create components that match the design intent**

**Wireframe Description**: ${config.wireframeDescription || 'No description provided'}

**Key Requirements**:
- Match the visual layout shown in the wireframe
- Implement all interactive elements visible in the design
- Use XOS components where possible to maintain consistency
- Follow the entity fields: ${config.fields.map(f => `${f.name} (${f.type})`).join(', ')}

` : ''}

### CREATE FILE: ${config.namespacePrefix}.WebApi/UIPages/src/components/${config.moduleName}/${config.entityName}VM.jsx
\`\`\`javascript
import { VMBase } from '../../xos-components/VMBase.js';
import { ApiManager } from '../../xos-components/Core/ApiManager.js';

export class ${config.entityName}VM extends VMBase {
    constructor() {
        super();
        
        // State properties
        ${generateViewModelProperties(config.fields)}
        
        // Lists and collections
        this.${config.entityName.toLowerCase()}List = this.observable([]);
        this.selectedItem = this.observable(null);
        this.isLoading = this.observable(false);
        
        // Form validation
        this.validationErrors = this.observable({});
    }
    
    ${generateViewModelMethods(config)}
}
\`\`\`

### CREATE FILE: ${config.namespacePrefix}.WebApi/UIPages/src/components/${config.moduleName}/index.jsx

${config.uiApproach === 'template' ? `
### ⚠️ TEMPLATE IMPLEMENTATION REQUIRED
**CLAUDE: You MUST do the following IN THIS EXACT ORDER:**
1. **FIRST**: Open and read @claude_docs/frontend/ui-templates/${config.uiTemplate}/index.jsx
2. **COPY**: Copy the ENTIRE template structure from @claude_docs
3. **CUSTOMIZE**: Replace placeholder values with ${config.entityName} entity fields
4. **VERIFY**: Check that you're using XOS components correctly per @claude_docs/frontend/xos-components

**DO NOT write generic React code! You MUST use the exact template from @claude_docs!**
` : `**IMPORTANT**: Create components based on the uploaded wireframe design following @claude_docs patterns.`}

\`\`\`javascript
import React from 'react';
import { XOSComponent } from '../../xos-components/XOSComponent.js';
import { ${config.entityName}VM } from './${config.entityName}VM.jsx';

${config.uiApproach === 'template' ? `// CLAUDE: Copy from @claude_docs/frontend/ui-templates/${config.uiTemplate}/index.jsx
// Then customize for ${config.entityName} entity with these fields:` : `// CLAUDE: Implement the wireframe design for ${config.entityName} entity with these fields:`}
${config.fields.map(field => `//   - ${field.name} (${field.type})`).join('\n')}

export class ${config.moduleName} extends XOSComponent {
    constructor(props) {
        super(props);
        this.vm = new ${config.entityName}VM();
    }
    
    async componentDidMount() {
        await this.vm.loadData();
    }
    
    render() {
        // CLAUDE: Replace with ${config.uiTemplate} template render method
        return (
            ${generateComponentRender(config)}
        );
    }
}

export default ${config.moduleName};
\`\`\`

### ${config.uiApproach === 'template' ? 'Template-Specific Instructions:' : 'Wireframe Implementation Instructions:'}
${config.uiApproach === 'template' ? getTemplateInstructions(config.uiTemplate, config) : getWireframeInstructions(config)}
` : ''}

## STEP 6: Register Services ${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? '' : '(Skip for frontend-only)'}

${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? `
**CLAUDE: Register the service in dependency injection:**

### MODIFY FILE: ${config.namespacePrefix}.Transaction/Extensions/ServiceExtensions.cs

Add this line in the service registration method:
\`\`\`csharp
services.AddScoped<I${config.entityName}Service, ${config.entityName}Service>();
\`\`\`
` : ''}

## STEP 7: Database Setup ${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? '' : '(Skip for frontend-only)'}

${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? `
**CLAUDE: Create the database table:**

### SQL Script for ${config.entityName} table:
\`\`\`sql
CREATE TABLE ${config.tableName || `${config.namespacePrefix.toLowerCase()}_${config.entityName.toLowerCase()}_mast`} (
    clnt_id SMALLINT NOT NULL,
    ${generateTableColumns(config.fields)}
    rcrd_stat SMALLINT DEFAULT 1,
    cre_by_usr_cd SMALLINT,
    cre_dttm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mod_by_usr_cd SMALLINT,
    mod_dttm TIMESTAMP,
    
    PRIMARY KEY (clnt_id, ${config.fields.find(f => f.name.toLowerCase().includes('id') || f.name.toLowerCase().includes('cd'))?.name.toLowerCase() || 'id'})
);
\`\`\`
` : ''}

## STEP 8: Data Source Implementation ${(config.fields.filter(f => f.dataSource).length > 0 || config.relationships.length > 0) ? '' : '(Skip - no data sources configured)'}

${(config.fields.filter(f => f.dataSource).length > 0 || config.relationships.length > 0) ? `
**CLAUDE: Implement data sources for dropdowns and lookups:**

${config.fields.filter(f => f.dataSource).map(f => `
### Dropdown for ${f.name}:
\`\`\`csharp
// In service method for loading ${f.name} dropdown options:
var ${f.dataSource.table}List = await _repository.GetAsync<${f.dataSource.table}>(
    "${f.dataSource.table}",
    new { ${f.dataSource.filter ? `/* Apply filter: ${f.dataSource.filter} */` : ''} }
);

// Return as dropdown options:
var options = ${f.dataSource.table}List.Select(x => new {
    Value = x.${f.dataSource.valueField},
    Display = x.${f.dataSource.displayField}
});
\`\`\`

// Frontend component:
\`\`\`javascript
// Load ${f.name} dropdown options
const load${f.name.charAt(0).toUpperCase() + f.name.slice(1)}Options = async () => {
    const response = await ApiManager.get('/api/${f.dataSource.table}/dropdown');
    setOptions(response.data);
};
\`\`\`
`).join('')}

${config.relationships.length > 0 ? `
### Join Queries for Related Data:
${config.relationships.map(r => `
\`\`\`sql
-- Join ${r.fromTable} with ${r.toTable}
SELECT t1.*, t2.* 
FROM ${r.fromTable} t1
LEFT JOIN ${r.toTable} t2 ON t1.${r.fromField} = t2.${r.toField || r.fromField}
WHERE t1.clnt_id = @clnt_id
\`\`\`
`).join('')}
` : ''}
` : ''}

## STEP 9: API Endpoints Documentation ${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? '' : '(Skip for frontend-only)'}

${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? `
**CLAUDE: Your module will expose these API endpoints:**

| Method | Route | Purpose | Request Body |
|--------|-------|---------|--------------|
${generateEndpointDocumentation(config)}

**Example API Calls:**
\`\`\`javascript
// Search ${config.entityName}s
const searchResult = await ApiManager.post('${config.apiBaseRoute}/search', {
    ClientID: 1,
    SiteID: 1,
    SearchTerm: 'example'
});

// Save ${config.entityName}
const saveResult = await ApiManager.post('${config.apiBaseRoute}/save', {
    ClientID: 1,
    SiteID: 1,
    ${config.fields.map(f => `${f.name}: 'value'`).join(',\n    ')}
});
\`\`\`
` : ''}

## STEP 9: Testing

**CLAUDE: Test the module:**

1. Build the solution: \`dotnet build\`
2. Run the application: \`dotnet run --project ${config.namespacePrefix}.WebApi\`
3. Test API endpoints at: https://localhost:5001/swagger
${config.moduleType.includes('frontend') || config.moduleType === 'fullstack' ? `4. Test frontend component using ${config.uiTemplate} patterns` : ''}

## Methods Included:

${config.methods.length > 0 ? config.methods.map(method => `✅ ${method.name} (${method.operation}) - ${method.description}`).join('\n') : '✅ Default CRUD operations'}

## Module Structure Created:

\`\`\`
${config.namespacePrefix}/
${config.moduleType.includes('backend') || config.moduleType === 'fullstack' ? `├── ${config.namespacePrefix}.Transaction/
│   ├── Domain/${config.entityName}.cs
│   ├── Interfaces/I${config.entityName}Service.cs
│   └── Services/${config.entityName}Service.cs
├── ${config.namespacePrefix}.WebApi/
│   └── Controllers/${config.entityName}Controller.cs` : ''}
${config.moduleType.includes('frontend') || config.moduleType === 'fullstack' ? `├── UIPages/src/components/${config.moduleName}/
│   ├── ${config.entityName}VM.jsx
│   └── index.jsx` : ''}
\`\`\`

---

## 📚 FINAL REMINDER: Use @claude_docs!

**CLAUDE: Before you finish, verify you have:**
✅ Checked @claude_docs for ALL XOS framework patterns
✅ Used the EXACT template structure from @claude_docs (not generic code)
✅ Followed @claude_docs naming conventions and patterns
✅ Implemented proper error handling per @claude_docs
✅ Used XOS components correctly per @claude_docs documentation

**If you haven't checked @claude_docs, GO BACK and check it NOW!**

**Generated**: ${timestamp}
**Module Type**: ${config.moduleType}
**Generator Version**: 1.0.0
`;
        }

        // Helper functions for code generation
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
            
            // If no methods defined, add default CRUD methods
            const methodsToGenerate = config.methods.length > 0 ? config.methods : [
                { operation: 'CREATE', name: 'Create', description: 'Create new record' },
                { operation: 'READ', name: 'GetAll', description: 'Get all records' },
                { operation: 'UPDATE', name: 'Update', description: 'Update existing record' },
                { operation: 'DELETE', name: 'Delete', description: 'Delete record' }
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
            
            // If no methods defined, add default CRUD methods
            const methodsToGenerate = config.methods.length > 0 ? config.methods : [
                { operation: 'CREATE', name: 'Create', description: 'Create new record' },
                { operation: 'READ', name: 'GetAll', description: 'Get all records' }
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
            
            // If no methods defined, add default CRUD methods
            const methodsToGenerate = config.methods.length > 0 ? config.methods : [
                { operation: 'CREATE', name: 'Create', description: 'Create new record' },
                { operation: 'READ', name: 'GetAll', description: 'Get all records' }
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
            // Find a suitable read method or use default
            const readMethod = config.methods.find(m => ['READ', 'GET_MANY', 'SEARCH'].includes(m.operation));
            const endpoint = readMethod ? 
                '${config.apiBaseRoute}/' + readMethod.name.toLowerCase() : 
                '${config.apiBaseRoute}/getall';
            
            const response = await ApiManager.${readMethod && readMethod.operation === 'SEARCH' ? 'post' : 'get'}(endpoint, 
                ${readMethod && readMethod.operation === 'SEARCH' ? `{
                ClientID: this.sessionInfo.ClientID,
                SiteID: this.sessionInfo.SiteID
            }` : ''});
            
            this.${entityName.toLowerCase()}List.value = response.Items || response || [];
        } catch (error) {
            console.error('Load data failed:', error);
        } finally {
            this.isLoading.value = false;
        }
    }`);

            // Add save method if CREATE or UPDATE operations exist
            const saveMethod = config.methods.find(m => ['CREATE', 'UPDATE'].includes(m.operation));
            if (saveMethod) {
                methods.push(`async save${entityName}() {
        try {
            const data = {
                ClientID: this.sessionInfo.ClientID,
                SiteID: this.sessionInfo.SiteID,
                ${config.fields.map(f => `${f.name}: this.${f.name.toLowerCase()}.value`).join(',\n                ')}
            };
            
            const response = await ApiManager.post('${config.apiBaseRoute}/${saveMethod.name.toLowerCase()}', data);
            if (response.Status === 'S') {
                await this.loadData();
                this.clearForm();
            }
        } catch (error) {
            console.error('Save failed:', error);
        }
    }`);
            }
            
            // Add delete method if DELETE operation exists
            const deleteMethod = config.methods.find(m => m.operation === 'DELETE');
            if (deleteMethod) {
                methods.push(`async delete${entityName}(id) {
        try {
            const response = await ApiManager.delete('${config.apiBaseRoute}/${deleteMethod.name.toLowerCase()}/' + id);
            if (response.Success) {
                await this.loadData();
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    }`);
            }
            
            // Add clearForm method
            methods.push(`clearForm() {
        ${config.fields.map(f => `this.${f.name.toLowerCase()}.value = '';`).join('\n        ')}
        this.selectedItem.value = null;
    }`);
            
            return methods.join('\n\n    ');
        }

        function getTemplateInstructions(template, config) {
            const instructions = {
                'MasterDetailCRUDTemplate': `
### 🔴 CRITICAL: Master-Detail CRUD Template Implementation

**CLAUDE: You are REQUIRED to use @claude_docs for this template!**

**STEP-BY-STEP INSTRUCTIONS:**
1. **OPEN**: @claude_docs/frontend/ui-templates/MasterDetailCRUDTemplate/index.jsx
2. **READ**: The complete template implementation from @claude_docs
3. **COPY**: The exact structure including:
   - Two-column form layout (col-md-6) 
   - Save/Close buttons with classes (.btn-save1, .btn-close1)
   - Mandatory field indicators
   - Validation with focus management
   - Loading states during save operations
   - Toast notifications for success/error
4. **CUSTOMIZE**: Only replace entity-specific values
5. **VERIFY**: Compare your implementation with @claude_docs template

**Path in @claude_docs**: frontend/ui-templates/MasterDetailCRUDTemplate/`,

                'SearchListGridTemplate': `
### 🔴 CRITICAL: Search/List Grid Template Implementation

**CLAUDE: MANDATORY @claude_docs usage required!**

**IMPLEMENTATION STEPS:**
1. **CHECK**: @claude_docs/frontend/ui-templates/SearchListGridTemplate/index.jsx
2. **IMPLEMENT** from @claude_docs:
   - Search bar with filters (exact structure from template)
   - XOSGrid with pagination (use @claude_docs/frontend/xos-components/XOSGrid)
   - Export functionality pattern
   - Audit trail integration
   - Advanced filters with collapsible sections
   - Row actions (edit/delete/view)
3. **VERIFY**: Your code matches the @claude_docs template structure

**Path in @claude_docs**: frontend/ui-templates/SearchListGridTemplate/`,

                'WorkflowFormTemplate': `
### 🔴 CRITICAL: Workflow Form Template Implementation

**CLAUDE: You MUST reference @claude_docs for this workflow template!**

**REQUIRED STEPS:**
1. **LOCATE**: @claude_docs/frontend/ui-templates/WorkflowFormTemplate/index.jsx
2. **COPY** the exact implementation including:
   - Multi-section accordion layout from @claude_docs
   - File attachment component (check @claude_docs/frontend/xos-components/FileUpload)
   - Approval/rejection workflow buttons
   - History timeline component
   - Comments section pattern
   - Workflow state management
3. **FOLLOW**: @claude_docs patterns for workflow state handling

**Path in @claude_docs**: frontend/ui-templates/WorkflowFormTemplate/`,

                'ReportParameterTemplate': `
### 🔴 CRITICAL: Report Parameter Template Implementation  

**CLAUDE: @claude_docs reference is MANDATORY!**

**EXACT IMPLEMENTATION REQUIRED:**
1. **READ**: @claude_docs/frontend/ui-templates/ReportParameterTemplate/index.jsx
2. **USE** components from @claude_docs:
   - Date range picker (from @claude_docs/frontend/xos-components/DateRangePicker)
   - Multi-select filters (from @claude_docs/frontend/xos-components/MultiSelect)
   - Download format options
   - Email scheduling component
   - Parameter persistence pattern
3. **MATCH**: The exact structure from @claude_docs template

**Path in @claude_docs**: frontend/ui-templates/ReportParameterTemplate/`
            };
            
            return instructions[template] || '';
        }

        function getWireframeInstructions(config) {
            return `
**Wireframe Implementation Guidelines:**

**CLAUDE: YOU HAVE ACCESS TO THE WIREFRAME IMAGE. ANALYZE IT CAREFULLY.**

1. **Visual Analysis:**
   - Examine the layout, spacing, and component arrangement
   - Identify all UI elements (buttons, inputs, grids, etc.)
   - Note the visual hierarchy and information flow
   - Understand the responsive behavior if indicated

2. **Component Mapping:**
   - Map wireframe elements to XOS components
   - Use standard XOS component patterns where possible
   - Maintain consistency with existing CVS application design

3. **Implementation Strategy:**
   - Start with the main layout structure
   - Implement each section progressively
   - Add interactive functionality based on entity fields
   - Follow XOS framework patterns from @claude_docs

4. **Design Requirements:**
   - Match the wireframe layout as closely as possible
   - Use appropriate XOS components (XOSTextbox, XOSGrid, etc.)
   - Implement proper validation and error handling
   - Add loading states and user feedback

5. **Entity Integration:**
   - Map wireframe form fields to entity properties: ${config.fields.map(f => `${f.name} (${f.type})`).join(', ')}
   - Implement CRUD operations as shown in the design
   - Add appropriate API calls to backend endpoints

**Remember**: The wireframe is your blueprint. Analyze it thoroughly and ask clarifying questions if the design intent is unclear.
`;
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
            
            // If no methods defined, add default CRUD methods
            const methodsToGenerate = config.methods.length > 0 ? config.methods : [
                { operation: 'CREATE', name: 'Create', description: 'Create new record' },
                { operation: 'READ', name: 'GetAll', description: 'Get all records' }
            ];
            
            const endpoints = [];
            
            methodsToGenerate.forEach(method => {
                switch(method.operation) {
                    case 'CREATE':
                        endpoints.push(`| POST | ${apiRoute}/${method.name.toLowerCase()} | ${method.description} | ${entityName} object |`);
                        break;
                    case 'UPDATE':
                        endpoints.push(`| PUT | ${apiRoute}/${method.name.toLowerCase()} | ${method.description} | ${entityName} object |`);
                        break;
                    case 'READ':
                    case 'GET_MANY':
                        endpoints.push(`| GET | ${apiRoute}/${method.name.toLowerCase()} | ${method.description} | None |`);
                        break;
                    case 'DELETE':
                        endpoints.push(`| DELETE | ${apiRoute}/${method.name.toLowerCase()}/{id} | ${method.description} | id parameter |`);
                        break;
                    case 'SEARCH':
                        endpoints.push(`| POST | ${apiRoute}/${method.name.toLowerCase()} | ${method.description} | SearchInput object |`);
                        break;
                    case 'GET_ONE':
                        endpoints.push(`| GET | ${apiRoute}/${method.name.toLowerCase()}/{id} | ${method.description} | id parameter |`);
                        break;
                    case 'EXPORT':
                        endpoints.push(`| POST | ${apiRoute}/${method.name.toLowerCase()} | ${method.description} | ExportInput object |`);
                        break;
                    case 'IMPORT':
                        endpoints.push(`| POST | ${apiRoute}/${method.name.toLowerCase()} | ${method.description} | ImportInput object |`);
                        break;
                    case 'CUSTOM':
                        endpoints.push(`| POST | ${apiRoute}/${method.name.toLowerCase()} | ${method.description} | Custom object |`);
                        break;
                }
            });
            
            return endpoints.join('\n');
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
            const wireframeTag = config.hasWireframe ? '_WIREFRAME' : '';
            const templateTag = config.uiTemplate ? `_${config.uiTemplate.toUpperCase()}` : '';
            a.download = `MODULE_${config.moduleName}_${config.moduleType.toUpperCase()}${wireframeTag}${templateTag}_${Date.now()}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            const approach = config.uiApproach === 'wireframe' ? 'custom wireframe' : 'template';
            alert(`Module instructions generated successfully!\nApproach: ${approach}\nGive this file to Claude Code to create your ${config.moduleType} module.`);
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            updateFormVisibility();
        });