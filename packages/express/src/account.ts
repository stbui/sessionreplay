export class AccountControl {
    constructor() {}

    toJSON() {
        return {
            data: {
                userId: 4339,
                tenantId: 2566,
                email: 'w431106@gmail.com',
                role: 'owner',
                name: 'demo',
                verifiedEmail: true,
                superAdmin: true,
                admin: false,
                member: false,
                origin: null,
                roleId: 9775,
                roleName: 'Owner',
                permissions: ['SESSION_REPLAY', 'DEV_TOOLS', 'METRICS', 'ASSIST_LIVE', 'ASSIST_CALL'],
                allProjects: true,
                hasPassword: true,
                isEnterprise: false,
                plan: { type: 'free', remainingSessions: 1000, billingSetup: false, remainingTrialDays: 0 },
                hasActivePlan: false,
                edition: 'ee',
                expirationDate: -1,
                versionNumber: 'v1.9.0-saas',
                tenantName: 'ch',
                apiKey: 'wdD7B78dUgxovdYYUV85',
                optOut: false,
                smtp: true,
                saml2: false,
            },
        };
    }
}
