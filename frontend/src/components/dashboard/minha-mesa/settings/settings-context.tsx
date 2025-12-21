'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usersService } from '@/services/users';
import { groupsService } from '@/services/groups';
import { organizationsService } from '@/services/organizations';
import { policiesService } from '@/services/policies';

// Define types for our data
export type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    group: string;
    organization?: string;
};

export type Group = {
    id: string;
    name: string;
    members: number;
    permissions: string;
    description: string;
    status: string;
};

export type Organization = {
    id: string;
    name: string;
    cnpj: string;
    type: string;
    status: string;
    city: string;
    state: string;
    users: number;
};

export type Policy = {
    id: string;
    name: string;
    description: string;
    effect: 'Allow' | 'Deny';
    type: string;
    resource: string;
    actions: string[];
    status: string;
};

interface SettingsContextType {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    groups: Group[];
    setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
    orgs: Organization[];
    setOrgs: React.Dispatch<React.SetStateAction<Organization[]>>;
    policies: Policy[];
    setPolicies: React.Dispatch<React.SetStateAction<Policy[]>>;
    isLoading: boolean;
    refreshData: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            const [usersData, groupsData, orgsData, policiesData] = await Promise.all([
                usersService.getUsers(),
                groupsService.getGroups(),
                organizationsService.getOrganizations(),
                policiesService.getPolicies()
            ]);

            // Map Users
            // Handle different API response structures (DRF pagination uses 'results', custom might use 'users')
            const rawUsers = (usersData as any).results || (usersData as any).users || (Array.isArray(usersData) ? usersData : []);

            const mappedUsers: User[] = rawUsers.map((u: any) => ({
                id: u.id,
                name: u.name || u.username || 'Sem Nome',
                email: u.email,
                phone: u.phone || '',
                role: u.role || 'Membro',
                status: u.status,
                group: u.group_name || 'Geral', // Backend might not send group_name directly
                organization: u.organization_name || 'Principal'
            }));
            setUsers(mappedUsers);

            // Map Groups
            const rawGroups = (groupsData as any).results || (groupsData as any).groups || (Array.isArray(groupsData) ? groupsData : []);

            const mappedGroups: Group[] = rawGroups.map((g: any) => ({
                id: g.id,
                name: g.name,
                members: g.members_count || 0,
                permissions: 'Personalizado', // Backend hasn't exposed this yet
                description: g.description || '',
                status: g.is_active ? 'active' : 'inactive'
            }));
            setGroups(mappedGroups);

            // Map Organizations
            const rawOrgs = (orgsData as any).results || (orgsData as any).organizations || (Array.isArray(orgsData) ? orgsData : []);

            const mappedOrgs: Organization[] = rawOrgs.map((o: any) => ({
                id: o.id,
                name: o.corporateName || o.corporate_name,
                cnpj: o.cnpj,
                type: 'Matriz', // Defaulting for now
                status: 'active', // Defaulting
                city: o.address?.city || 'N/A',
                state: o.address?.state || 'UF',
                users: 0 // Count not in list response usually
            }));
            setOrgs(mappedOrgs);

            // Map Policies
            // Map Policies
            // Handle different API response structures (DRF pagination uses 'results', custom might use 'policies')
            const rawPolicies = (policiesData as any).results || (policiesData as any).policies || (Array.isArray(policiesData) ? policiesData : []);

            const mappedPolicies: Policy[] = rawPolicies.map((p: any) => ({
                id: p.id,
                name: p.name,
                description: p.description || '',
                effect: p.effect, // Should be 'Allow' | 'Deny'
                type: 'Sistema', // differentiate system vs custom?
                resource: p.resource,
                actions: p.actions || [],
                status: p.status || 'active'
            }));
            setPolicies(mappedPolicies);

        } catch (error) {
            console.error("Failed to fetch settings data:", error);
            // Optional: toast error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <SettingsContext.Provider value={{
            users, setUsers,
            groups, setGroups,
            orgs, setOrgs,
            policies, setPolicies,
            isLoading,
            refreshData
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
