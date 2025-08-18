let currentStep = 1;
const totalSteps = 7;
let configuration = {};

// Template defaults
const templates = {
    'xos-enterprise': {
        'project-name': 'MyProject',
        'project-description': 'Enterprise Application Platform',
        'project-version': '1.0.0',
        'industry-domain': 'Enterprise',
        'backend-framework': '.NET 8.0',
        'orm-layer': 'XOS.Data + Npgsql',
        'frontend-framework': 'React 18 + XOS Components',
        'ui-library': 'XOS Components + Bootstrap 5',
        'state-management': 'XOS ViewModels (MVVM)',
        'database-type': 'PostgreSQL',
        'db-host': 'localhost',
        'db-port': '5432',
        'db-username': 'postgres',
        'db-params': 'application name=MyApp_WebApi;',
        'tenancy-strategy': 'single-db',
        'cache-provider': 'SQLite',
        'cache-connection': 'Files\\DB File\\SqliteDB.db',
        'cache-ttl': '3600',
        'cache-pattern': '{site}:{entity}:{id}',
        'auth-type': 'JWT Bearer',
        'token-signing': 'HS256',
        'access-token-expiry': '5',
        'refresh-token-expiry': '1440',
        'password-algorithm': 'BCrypt',
        'salt-rounds': '10',
        'cors-origins': 'https://localhost:3000\nhttp://localhost:3000',
        'encryption-rest': 'Database-native',
        'encryption-transit': 'TLS 1.2+',
        'key-management': 'Local (appsettings.json)',
        'realtime-tech': 'SignalR',
        'realtime-config': '/notificationHub',
        'logging-framework': 'Serilog',
        'log-destinations': 'File (Logs\\transaction-log.txt), Console',
        'log-level': 'Debug (Dev), Information (Prod)',
        'log-rotation': 'Daily, 7 days retention',
        'storage-type': 'Local FileSystem',
        'storage-config': 'LocalPath: E:\\Data',
        'email-provider': 'Microsoft Graph API',
        'email-config': 'Use OAuth2 with Microsoft Graph',
        'external-services': 'External API Integration\nFile Import/Export\nPayment Processing',
        'pagination-limit': '10',
        'pagination-max-limit': '100',
        'pagination-offset': '0',
        'pagination-strategy': 'offset-limit',
        'pagination-include-total': 'true',
        'pagination-params': 'limit={limit}&offset={offset}'
    },
    'simple-api': {
        'project-name': 'SimpleAPI',
        'project-description': 'Basic REST API with authentication',
        'project-version': '1.0.0',
        'backend-framework': '.NET 8.0',
        'frontend-framework': 'None',
        'database-type': 'SQLite',
        'auth-type': 'JWT Bearer',
        'cache-provider': 'In-Memory'
    },
    'microservices': {
        'project-name': 'Microservices',
        'project-description': 'Docker-ready microservices architecture',
        'backend-framework': '.NET 8.0',
        'database-type': 'PostgreSQL',
        'cache-provider': 'Redis',
        'message-system': 'RabbitMQ'
    },
    'saas-multitenant': {
        'project-name': 'SaaSPlatform',
        'project-description': 'Multi-tenant SaaS application',
        'backend-framework': '.NET 8.0',
        'tenancy-strategy': 'multiple-db',
        'database-type': 'PostgreSQL',
        'cache-provider': 'Redis'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadSavedTemplates();
    updateConnectionString();
    applyTemplate('xos-enterprise');
    
    // Add event listeners for connection string updates
    ['db-host', 'db-port', 'db-name', 'db-username', 'db-password', 'db-params'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateConnectionString);
    });
});

// Template selection
document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        const templateName = this.dataset.template;
        if (templateName && templateName !== 'custom') {
            applyTemplate(templateName);
        }
    });
});

function applyTemplate(templateName) {
    const template = templates[templateName];
    if (template) {
        Object.keys(template).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = template[key];
            }
        });
        updateConnectionString();
    }
}

// Step navigation
document.querySelectorAll('.step-item').forEach(item => {
    item.addEventListener('click', function() {
        const step = parseInt(this.dataset.step);
        if (step <= currentStep || validateCurrentStep()) {
            goToStep(step);
        }
    });
});

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
    
    if (step === 7) {
        showReview();
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
    // Add validation logic here if needed
    return true;
}

function updateConnectionString() {
    const host = document.getElementById('db-host').value || 'localhost';
    const port = document.getElementById('db-port').value || '5432';
    const dbName = document.getElementById('db-name').value || '{database}';
    const username = document.getElementById('db-username').value || '{username}';
    const password = document.getElementById('db-password').value || '{password}';
    const params = document.getElementById('db-params').value || '';
    
    const connectionString = `Server=${host};Port=${port};Database=${dbName};User Id=${username};Password=${password};${params}`;
    document.getElementById('connection-preview').textContent = connectionString;
}

function toggleSection(element) {
    element.classList.toggle('collapsed');
    const section = element.nextElementSibling;
    section.classList.toggle('collapsed');
}

function collectConfiguration() {
    const config = {};
    
    // Collect all input values
    document.querySelectorAll('input[type="text"], input[type="password"], input[type="number"], textarea').forEach(input => {
        if (input.id) {
            config[input.id] = input.value || '';
        }
    });
    
    // Add selected template
    const selectedTemplate = document.querySelector('.template-card.selected');
    config.template = selectedTemplate ? selectedTemplate.dataset.template : 'custom';
    
    // Generate secret key if not provided
    if (!config['secret-key']) {
        config['secret-key'] = generateSecretKey();
    }
    
    return config;
}

function generateSecretKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    for (let i = 0; i < 64; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

function showReview() {
    const config = collectConfiguration();
    const reviewContent = document.getElementById('review-content');
    
    const reviewItems = [
        { label: 'Project Name', value: config['project-name'] },
        { label: 'Version', value: config['project-version'] },
        { label: 'Backend', value: config['backend-framework'] },
        { label: 'Frontend', value: config['frontend-framework'] },
        { label: 'Database', value: config['database-type'] },
        { label: 'Authentication', value: config['auth-type'] },
        { label: 'Cache Provider', value: config['cache-provider'] },
        { label: 'Real-time', value: config['realtime-tech'] },
        { label: 'Logging', value: config['logging-framework'] },
        { label: 'Pagination', value: `Limit: ${config['pagination-limit'] || '10'}, Max: ${config['pagination-max-limit'] || '100'}` }
    ];
    
    reviewContent.innerHTML = reviewItems.map(item => `
        <div class="review-item">
            <div class="review-label">${item.label}</div>
            <div class="review-value">${item.value || 'Not configured'}</div>
        </div>
    `).join('');
    
    // Show configuration preview
    const preview = generateMarkdownPreview(config);
    document.getElementById('config-preview').textContent = preview.substring(0, 1000) + '...';
}

function generateMarkdownPreview(config) {
    const timestamp = new Date().toISOString();
    
    return `╔════════════════════════════════════════════════════════════════════╗
║                    PROJECT INITIALIZATION WIZARD                   ║
║                         Configuration Report                       ║
║                     Generated: ${timestamp}                        ║
╚════════════════════════════════════════════════════════════════════╝

[■■■■■■■■■■] 100% Configuration Complete

## 📋 PROJECT MANIFEST
=====================================
Project Name: ${config['project-name']}
Version: ${config['project-version']}
Description: ${config['project-description']}
Organization: ${config['organization']}
Industry: ${config['industry-domain']}
Template: ${config.template}

## 🚀 QUICK START COMMANDS FOR CLAUDE CODE
\`\`\`bash
# Initialize project structure
mkdir ${config['project-name']}
cd ${config['project-name']}

# Create solution
dotnet new sln -n ${config['project-name']}

# Create projects
dotnet new webapi -n ${config['project-name']}.WebApi
dotnet new classlib -n ${config['project-name']}.Transaction

# Add projects to solution
dotnet sln add ${config['project-name']}.WebApi/${config['project-name']}.WebApi.csproj
dotnet sln add ${config['project-name']}.Transaction/${config['project-name']}.Transaction.csproj

# Add reference
cd ${config['project-name']}.WebApi
dotnet add reference ../${config['project-name']}.Transaction/${config['project-name']}.Transaction.csproj

# Install packages
dotnet add package Npgsql --version 9.0.3
dotnet add package Serilog.AspNetCore --version 9.0.0
dotnet add package Swashbuckle.AspNetCore --version 7.3.1
\`\`\`

## ⚙️ SYSTEM REQUIREMENTS CHECK
✅ ${config['backend-framework']} SDK
✅ Node.js 18+ ${config['frontend-framework'].includes('React') ? '(for React frontend)' : ''}
✅ ${config['database-type']}
✅ Git

## 🗄️ DATABASE CONFIGURATION
Connection String (Development):
\`\`\`
${document.getElementById('connection-preview').textContent}
\`\`\`

...continued in full file`;
}

function generateFullMarkdown(config) {
    const timestamp = new Date().toISOString();
    
    return `# PROJECT SEED: ${config['project-name']}

## CLAUDE CODE - BUILD THIS PROJECT HERE
This file was placed in the project folder. Build the project in the current directory.
Use @claude_docs for XOS framework patterns and best practices.

### Project Configuration
- **Name**: ${config['project-name']}
- **Type**: ${config.template} template
- **Stack**: ${config['backend-framework']} + ${config['frontend-framework']}
- **Database**: ${config['database-type']}

## STEP 1: Initialize Project in Current Directory

**CLAUDE: You are in the project folder. Create the .NET solution here:**

\`\`\`bash
# Create solution in current directory
dotnet new sln -n ${config['project-name']}

# Create projects
dotnet new webapi -n ${config['project-name']}.WebApi
dotnet new classlib -n ${config['project-name']}.Transaction

# Add projects to solution
dotnet sln add ${config['project-name']}.WebApi/${config['project-name']}.WebApi.csproj
dotnet sln add ${config['project-name']}.Transaction/${config['project-name']}.Transaction.csproj

# Add project reference
cd ${config['project-name']}.WebApi
dotnet add reference ../${config['project-name']}.Transaction/${config['project-name']}.Transaction.csproj
cd ..
\`\`\`

## STEP 2: Install Required Packages

**CLAUDE: Install all necessary NuGet packages:**
\`\`\`bash
# WebApi packages
cd ${config['project-name']}.WebApi
dotnet add package Microsoft.AspNetCore.Mvc.NewtonsoftJson --version 8.0.14
dotnet add package Npgsql --version 9.0.3
dotnet add package Serilog.AspNetCore --version 9.0.0
dotnet add package Serilog.Sinks.Async --version 2.1.0
dotnet add package Serilog.Sinks.File --version 6.0.0
dotnet add package Swashbuckle.AspNetCore --version 7.3.1

# Transaction packages
cd ../${config['project-name']}.Transaction
dotnet add package CsvHelper --version 33.1.0
dotnet add package Microsoft.Extensions.DependencyInjection.Abstractions --version 9.0.2
dotnet add package Microsoft.Extensions.Logging.Abstractions --version 9.0.2
cd ..
\`\`\`

### Step 3: Setup Frontend (if React selected)
${config['frontend-framework'].includes('React') ? `\`\`\`bash
cd ${config['project-name']}.WebApi/UIPages
npx create-react-app . --template typescript
npm install bootstrap@5.1.3
npm install @microsoft/signalr@8.0.7
npm install moment@2.29.4
npm install react-router-dom@6
cd ../..
\`\`\`` : '# No frontend framework selected'}

### Step 4: Initialize Database
\`\`\`sql
-- Connect to PostgreSQL and run:
CREATE DATABASE ${config['db-name'] || config['project-name'] + '_DEV'};
\`\`\`

## ⚙️ SYSTEM REQUIREMENTS CHECK
================================
✅ ${config['backend-framework']} SDK
${config['frontend-framework'].includes('React') ? '✅ Node.js 18+ (for React frontend)' : ''}
✅ ${config['database-type']}
✅ Git
${config['cache-provider'] === 'Redis' ? '✅ Redis Server' : ''}
${config['message-system'] ? '✅ ' + config['message-system'] : ''}

## 📁 PROJECT STRUCTURE TO GENERATE
\`\`\`
${config['project-name']}/
├── 📦 ${config['project-name']}.sln
├── 📂 ${config['project-name']}.WebApi/
│   ├── 📄 ${config['project-name']}.WebApi.csproj
│   ├── 📄 Program.cs [CREATE]
│   ├── 📄 appsettings.json [GENERATE FROM TEMPLATE]
│   ├── 📄 appsettings.Development.json [GENERATE FROM TEMPLATE]
│   ├── 📂 Controllers/
│   │   ├── 📄 AuthController.cs [CREATE]
│   │   └── 📄 BaseController.cs [CREATE]
│   ├── 📂 Domain/
│   │   ├── 📄 AppConstants.cs [CREATE]
│   │   ├── 📄 Token.cs [CREATE]
│   │   ├── 📄 PaginationRequest.cs [CREATE]
│   │   └── 📄 PaginatedResponse.cs [CREATE]
│   ├── 📂 Services/
│   │   ├── 📂 Interfaces/
│   │   └── 📄 TokenService.cs [CREATE]
│   ├── 📂 Extensions/
│   │   └── 📄 ServiceExtensions.cs [CREATE]
${config['realtime-tech'] === 'SignalR' ? `│   ├── 📂 SignalR/
│   │   └── 📄 NotificationHub.cs [CREATE]` : ''}
${config['frontend-framework'].includes('React') ? `│   ├── 📂 UIPages/
│   │   ├── 📄 package.json [GENERATE]
│   │   ├── 📂 src/
│   │   └── 📂 public/` : ''}
│   └── 📂 wwwroot/
├── 📂 ${config['project-name']}.Transaction/
│   ├── 📄 ${config['project-name']}.Transaction.csproj
│   ├── 📂 Domain/
│   ├── 📂 Services/
│   └── 📂 Interfaces/
└── 📂 Documents/
    └── 📄 README.md [GENERATE]
\`\`\`

## STEP 3: Create Configuration Files

**CLAUDE: Create the following configuration files:**

### CREATE FILE: ${config['project-name']}.WebApi/appsettings.json
\`\`\`json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "${document.getElementById('connection-preview').textContent}"${config['cache-provider'] === 'Redis' ? `,
    "RedisCache": "${config['cache-connection'] || 'localhost:6379'}"` : ''}
  },
  "JwtSettings": {
    "SecretKey": "${config['secret-key']}",
    "Issuer": "http://localhost:5000",
    "Audience": "${config['project-name']}",
    "AccessTokenExpirationMinutes": ${config['access-token-expiry'] || '5'},
    "RefreshTokenExpirationMinutes": ${config['refresh-token-expiry'] || '1440'}
  },
  "CorsSettings": {
    "AllowedOrigins": [${config['cors-origins'] ? config['cors-origins'].split('\n').map(o => `"${o.trim()}"`).join(', ') : ''}]
  },
  "PaginationSettings": {
    "DefaultPageSize": ${config['pagination-limit'] || '10'},
    "MaxPageSize": ${config['pagination-max-limit'] || '100'},
    "DefaultOffset": ${config['pagination-offset'] || '0'},
    "Strategy": "${config['pagination-strategy'] || 'offset-limit'}",
    "IncludeTotalCount": ${config['pagination-include-total'] || 'true'},
    "QueryParameters": "${config['pagination-params'] || 'limit={limit}&offset={offset}'}"
  }${config['cache-provider'] === 'SQLite' ? `,
  "SqliteCache": "${config['cache-connection'] || 'cache.db'}"` : ''}${config['logging-framework'] === 'Serilog' ? `,
  "Serilog": {
    "MinimumLevel": {
      "Default": "Debug",
      "Override": {
        "Microsoft": "Information",
        "System": "Error"
      }
    },
    "WriteTo": [
      {
        "Name": "File",
        "Args": {
          "path": "${config['log-destinations'].includes('File') ? 'Logs/log-.txt' : ''}",
          "rollingInterval": "Day",
          "retainedFileCountLimit": 7
        }
      }${config['log-destinations'].includes('Console') ? `,
      {
        "Name": "Console"
      }` : ''}
    ]
  }` : ''}
}
\`\`\`

### CREATE FILE: ${config['project-name']}.WebApi/Program.cs
\`\`\`csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
${config['logging-framework'] === 'Serilog' ? 'using Serilog;' : ''}
${config['realtime-tech'] === 'SignalR' ? 'using Microsoft.AspNetCore.SignalR;' : ''}

var builder = WebApplication.CreateBuilder(args);

${config['logging-framework'] === 'Serilog' ? `// Configure Serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));` : ''}

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policy =>
        {
            policy.WithOrigins(builder.Configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>() ?? new[] { "*" })
                  .AllowAnyHeader()
                  .AllowAnyMethod()${config['realtime-tech'] === 'SignalR' ? `
                  .AllowCredentials()` : ''};
        });
});

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT Secret Key not configured"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(secretKey)
        };
    });

${config['realtime-tech'] === 'SignalR' ? '// Add SignalR\nbuilder.Services.AddSignalR();' : ''}

${config['cache-provider'] === 'Redis' ? `// Add Redis Cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("RedisCache");
});` : config['cache-provider'] === 'In-Memory' ? '// Add Memory Cache\nbuilder.Services.AddMemoryCache();' : ''}

// Register application services
builder.Services.AddScoped<ITokenService, TokenService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigins");
app.UseAuthentication();
app.UseAuthorization();

${config['realtime-tech'] === 'SignalR' ? 'app.MapHub<NotificationHub>("/notificationHub");' : ''}
app.MapControllers();

app.Run();
\`\`\`

### CREATE FILE: ${config['project-name']}.WebApi/Domain/PaginationRequest.cs
\`\`\`csharp
namespace ${config['project-name']}.WebApi.Domain
{
    public class PaginationRequest
    {
        private int _limit = ${config['pagination-limit'] || '10'};
        private int _offset = ${config['pagination-offset'] || '0'};

        public int Limit
        {
            get => _limit;
            set => _limit = Math.Min(value, ${config['pagination-max-limit'] || '100'});
        }

        public int Offset
        {
            get => _offset;
            set => _offset = Math.Max(0, value);
        }

        public bool IncludeTotalCount { get; set; } = ${config['pagination-include-total'] || 'true'};
        
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; }
        
        // Helper properties
        public int PageNumber => (Offset / Limit) + 1;
        public int Skip => Offset;
        public int Take => Limit;
    }
}
\`\`\`

### CREATE FILE: ${config['project-name']}.WebApi/Domain/PaginatedResponse.cs
\`\`\`csharp
namespace ${config['project-name']}.WebApi.Domain
{
    public class PaginatedResponse<T>
    {
        public List<T> Data { get; set; } = new();
        public int Offset { get; set; }
        public int Limit { get; set; }
        public int? TotalCount { get; set; }
        public bool HasNext => TotalCount.HasValue && (Offset + Limit) < TotalCount;
        public bool HasPrevious => Offset > 0;
        public int? TotalPages => TotalCount.HasValue && Limit > 0 ? (int)Math.Ceiling((double)TotalCount / Limit) : null;
        public int CurrentPage => Limit > 0 ? (Offset / Limit) + 1 : 1;
        
        public PaginatedResponse(List<T> data, int offset, int limit, int? totalCount = null)
        {
            Data = data;
            Offset = offset;
            Limit = limit;
            TotalCount = totalCount;
        }
    }
}
\`\`\`

${config['frontend-framework'].includes('React') ? `### CREATE FILE: ${config['project-name']}.WebApi/UIPages/package.json
\`\`\`json
{
  "name": "${config['project-name'].toLowerCase()}-ui",
  "version": "${config['project-version']}",
  "private": true,
  "dependencies": {
    "@microsoft/signalr": "^8.0.7",
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^14.2.5",
    "bootstrap": "^5.1.3",
    "moment": "^2.29.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.0.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
\`\`\`` : ''}

## STEP 4: Configure Database

**CLAUDE: Set up the database with these settings:**

### Database Configuration
- **Type**: ${config['database-type']}
- **Host**: ${config['db-host']}
- **Port**: ${config['db-port']}
- **Database**: ${config['db-name'] || '{database_name}'}
- **Username**: ${config['db-username']}

### Connection Strings
**Development**:
\`\`\`
${document.getElementById('connection-preview').textContent}
\`\`\`

**Production** (update credentials):
\`\`\`
Server={PROD_HOST};Port=${config['db-port']};Database={PROD_DB};User Id={PROD_USER};Password={PROD_PASSWORD};${config['db-params'] || ''}
\`\`\`

${config['tenancy-strategy'] ? `### Multi-Tenancy Configuration
- **Strategy**: ${config['tenancy-strategy'] === 'single-db' ? 'Multi-Tenant with Single DB (Row-level isolation using site_id)' : config['tenancy-strategy'] === 'multiple-db' ? 'Multi-Tenant with Multiple DBs (Database per tenant)' : 'Single-tenant'}` : ''}

## 🔐 SECURITY CONFIGURATION
=====================================

### Authentication
- **Type**: ${config['auth-type']}
- **Token Signing**: ${config['token-signing']}
- **Access Token Expiry**: ${config['access-token-expiry']} minutes
- **Refresh Token Expiry**: ${config['refresh-token-expiry']} minutes

### Password Security
- **Algorithm**: ${config['password-algorithm']}
- **Salt Rounds**: ${config['salt-rounds']}

### Encryption
- **At Rest**: ${config['encryption-rest'] || 'Database-native'}
- **In Transit**: ${config['encryption-transit'] || 'TLS 1.2+'}
- **Key Management**: ${config['key-management'] || 'Local'}

### CORS Configuration
Allowed Origins:
${config['cors-origins'] ? config['cors-origins'].split('\n').map(o => `- ${o.trim()}`).join('\n') : '- *'}

## 📄 PAGINATION CONFIGURATION
=====================================
- **Default Page Size**: ${config['pagination-limit'] || '10'} records
- **Maximum Page Size**: ${config['pagination-max-limit'] || '100'} records
- **Default Offset**: ${config['pagination-offset'] || '0'}
- **Pagination Strategy**: ${config['pagination-strategy'] || 'offset-limit'}
- **Include Total Count**: ${config['pagination-include-total'] || 'true'}
- **Query Parameters**: ${config['pagination-params'] || 'limit={limit}&offset={offset}'}

## 💾 CACHING CONFIGURATION
=====================================
- **Provider**: ${config['cache-provider']}
- **Connection**: ${config['cache-connection'] || 'Default'}
- **Default TTL**: ${config['cache-ttl']} seconds
- **Key Pattern**: ${config['cache-pattern'] || '{entity}:{id}'}

## 📡 ADDITIONAL SERVICES
=====================================

${config['realtime-tech'] ? `### Real-time Communication
- **Technology**: ${config['realtime-tech']}
- **Endpoint**: ${config['realtime-config'] || '/hub'}` : ''}

${config['logging-framework'] ? `### Logging
- **Framework**: ${config['logging-framework']}
- **Destinations**: ${config['log-destinations']}
- **Level**: ${config['log-level']}
- **Rotation**: ${config['log-rotation']}` : ''}

${config['storage-type'] ? `### File Storage
- **Type**: ${config['storage-type']}
- **Configuration**: ${config['storage-config']}` : ''}

${config['email-provider'] ? `### Email Service
- **Provider**: ${config['email-provider']}
- **Configuration**: ${config['email-config']}` : ''}

${config['message-system'] ? `### Message Queue
- **System**: ${config['message-system']}
- **Configuration**: ${config['message-config']}` : ''}

${config['external-services'] ? `### External Integrations
${config['external-services'].split('\n').map(s => `- ${s.trim()}`).join('\n')}` : ''}

## STEP 5: Final Setup and Verification

**CLAUDE: Complete the project setup:**

1. Create a database named \`${config['db-name'] || config['project-name'] + '_DEV'}\` in ${config['database-type']}
2. Run \`dotnet build\` to verify everything compiles
3. Run \`dotnet run --project ${config['project-name']}.WebApi\` to start the application
4. The API should be available at https://localhost:5001/swagger

## IMPORTANT NOTES FOR CLAUDE

- Use the XOS framework patterns from @claude_docs when implementing features
- Follow MVVM pattern for all frontend components
- All database operations should use the repository pattern
- Implement proper error handling and logging throughout
- Use dependency injection for all services
- Follow the naming conventions established in the XOS framework

## 📊 INSTALLATION SUMMARY
====================================
### Components Selected:
${config['backend-framework'] ? '☑ Backend API (' + config['backend-framework'] + ')' : '☐ Backend API'}
${config['frontend-framework'] && config['frontend-framework'] !== 'None' ? '☑ Frontend (' + config['frontend-framework'] + ')' : '☐ Frontend'}
${config['database-type'] ? '☑ Database (' + config['database-type'] + ')' : '☐ Database'}
${config['cache-provider'] ? '☑ Caching (' + config['cache-provider'] + ')' : '☐ Caching'}
${config['realtime-tech'] ? '☑ Real-time (' + config['realtime-tech'] + ')' : '☐ Real-time'}
${config['auth-type'] ? '☑ Authentication (' + config['auth-type'] + ')' : '☐ Authentication'}
${config['message-system'] ? '☑ Message Queue (' + config['message-system'] + ')' : '☐ Message Queue'}

### Resource Requirements:
- **Disk Space**: ~500 MB (including packages)
- **Memory**: 2 GB minimum for development
- **Setup Time**: ~5-10 minutes

## PROJECT GENERATION COMPLETE

**CLAUDE: This project seed file is ready for execution.**

When you're ready, start with STEP 1 and work through each step in order.
Remember to use @claude_docs for XOS framework patterns and best practices.

---
**Generated**: ${timestamp}
**Template**: ${config.template}
**Generator Version**: 1.0.0
`;
}

function generateProject() {
    const config = collectConfiguration();
    const markdown = generateFullMarkdown(config);
    
    // Create a blob and download
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PROJECT_SEED_${config['project-name']}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Project seed file generated successfully! Give this file to Claude Code to create your project.');
}

function saveTemplate() {
    const templateName = document.getElementById('template-name').value;
    if (!templateName) {
        alert('Please enter a template name');
        return;
    }
    
    const config = collectConfiguration();
    const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '{}');
    savedTemplates[templateName] = config;
    localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
    
    alert(`Template "${templateName}" saved successfully!`);
    loadSavedTemplates();
}

function loadSavedTemplates() {
    const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '{}');
    const select = document.getElementById('saved-templates');
    
    // Clear existing options except the first one
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Add saved templates
    Object.keys(savedTemplates).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}

document.getElementById('saved-templates').addEventListener('change', function() {
    const templateName = this.value;
    if (templateName) {
        const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '{}');
        const template = savedTemplates[templateName];
        if (template) {
            Object.keys(template).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = template[key];
                }
            });
            updateConnectionString();
        }
    }
});