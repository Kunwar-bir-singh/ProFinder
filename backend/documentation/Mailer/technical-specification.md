# Email Service - Technical Specification

## System Architecture

```mermaid
graph TB
    subgraph "Application Layer"
        Auth[Auth Module]
        Users[Users Module]
        Providers[Providers Module]
    end
    
    subgraph "Mail Service Layer"
        MS[Mail Service]
        MT[Mail Templates]
        MC[Mail Controller]
    end
    
    subgraph "Template Engine"
        BT[Base Template]
        WT[Welcome Template]
        PRT[Password Reset Template]
    end
    
    subgraph "Configuration"
        MConst[Mail Constants]
        MConfig[Mail Config]
    end
    
    subgraph "External Services"
        SMTP[Gmail SMTP Server]
    end
    
    Auth --> MS
    Users --> MS
    Providers --> MS
    
    MS --> MT
    MS --> MC
    
    MT --> BT
    MT --> WT
    MT --> PRT
    
    MS --> MConst
    MS --> MConfig
    
    MC --> SMTP
```

## Component Relationships

```mermaid
sequenceDiagram
    participant Client
    participant AuthModule
    participant MailService
    participant TemplateEngine
    participant GmailSMTP
    
    Client->>AuthModule: Register User
    AuthModule->>MailService: Send Welcome Email
    MailService->>TemplateEngine: Generate Welcome HTML
    TemplateEngine->>MailService: Return HTML
    MailService->>GmailSMTP: Send Email
    GmailSMTP->>MailService: Delivery Confirmation
    MailService->>AuthModule: Email Sent
```

## Configuration Flow

```mermaid
flowchart TD
    A[Environment Variables] --> B[MailModule Initialization]
    B --> C[SMTP Configuration]
    C --> D[Template Loading]
    D --> E[Service Registration]
    E --> F[Ready for Use]
```

## Email Template Structure

```mermaid
graph LR
    A[Base Template] --> B[Header]
    A --> C[Content Area]
    A --> D[Footer]
    
    B --> B1[Logo/Branding]
    C --> C1[Dynamic Content]
    C --> C2[Action Buttons]
    D --> D1[Footer Links]
    D --> D2[Contact Info]
```

## Implementation Steps

1. **Mail Module Creation**
   - Create mail module structure
   - Configure NestJS module dependencies
   - Set up service providers

2. **SMTP Configuration**
   - Environment variable setup
   - Gmail app password configuration
   - Connection testing

3. **Template System**
   - Base template creation
   - Specific email templates
   - HTML/CSS styling

4. **Service Integration**
   - Core mail service implementation
   - Error handling and retry logic
   - Logging and monitoring

5. **Testing Implementation**
   - Unit tests for mail service
   - Integration tests
   - Email delivery testing

6. **Documentation**
   - Setup instructions
   - Usage examples
   - Troubleshooting guide