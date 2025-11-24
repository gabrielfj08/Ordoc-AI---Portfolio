'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import organizationsService, { OrganizationCreateRequest } from '@/services/organizations';

interface CreateOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateOrganizationModal({ 
  open, 
  onClose, 
  onSuccess 
}: CreateOrganizationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    corporate_name: '',
    cnpj: '',
    email: '',
    phone: '',
    contact_name: '',
    contact_phone: '',
    site: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.corporate_name.trim()) {
      newErrors.corporate_name = 'Campo obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Campo obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Campo obrigatório';
    }
    if (!formData.contact_name.trim()) {
      newErrors.contact_name = 'Campo obrigatório';
    }
    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = 'Campo obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Create basic organization data
      const organizationData: OrganizationCreateRequest = {
        corporate_name: formData.corporate_name,
        cnpj: formData.cnpj,
        email: formData.email,
        phone: formData.phone,
        contact_name: formData.contact_name,
        contact_phone: formData.contact_phone,
        site: formData.site,
        storage_limit: 100, // Default storage limit
        app_ids: [1, 2, 3, 4], // Default apps
        address: {
          street: '',
          number: '',
          complement: '',
          postal_code: '',
          city: '',
          state: '',
          neighborhood: '',
        }
      };

      await organizationsService.createOrganization(organizationData);
      
      // Reset form and close modal
      setFormData({
        corporate_name: '',
        cnpj: '',
        email: '',
        phone: '',
        contact_name: '',
        contact_phone: '',
        site: '',
      });
      setErrors({});
      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating organization:', error);
      setErrors({ submit: error?.message || 'Erro ao criar organização' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Organização</DialogTitle>
          <DialogDescription>
            Preencha as informações básicas da organização
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="corporate_name">Nome Corporativo *</Label>
            <Input
              id="corporate_name"
              type="text"
              value={formData.corporate_name}
              onChange={(e) => handleInputChange('corporate_name', e.target.value)}
              placeholder="Nome da empresa"
              className={errors.corporate_name ? 'border-red-500' : ''}
            />
            {errors.corporate_name && (
              <p className="text-red-500 text-sm mt-1">{errors.corporate_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              type="text"
              value={formData.cnpj}
              onChange={(e) => handleInputChange('cnpj', e.target.value)}
              placeholder="00.000.000/0000-00"
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@empresa.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(11) 99999-9999"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contact_name">Nome do Contato *</Label>
            <Input
              id="contact_name"
              type="text"
              value={formData.contact_name}
              onChange={(e) => handleInputChange('contact_name', e.target.value)}
              placeholder="Nome do responsável"
              className={errors.contact_name ? 'border-red-500' : ''}
            />
            {errors.contact_name && (
              <p className="text-red-500 text-sm mt-1">{errors.contact_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contact_phone">Telefone do Contato *</Label>
            <Input
              id="contact_phone"
              type="tel"
              value={formData.contact_phone}
              onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              placeholder="(11) 99999-9999"
              className={errors.contact_phone ? 'border-red-500' : ''}
            />
            {errors.contact_phone && (
              <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="site">Site</Label>
            <Input
              id="site"
              type="url"
              value={formData.site}
              onChange={(e) => handleInputChange('site', e.target.value)}
              placeholder="https://www.empresa.com"
            />
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Criando...' : 'Criar Organização'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}