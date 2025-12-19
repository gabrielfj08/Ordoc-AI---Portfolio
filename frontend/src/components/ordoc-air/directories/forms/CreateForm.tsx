'use client';

import React from 'react';
import { createDirectory } from '../actions';
import type { CreateDirectoryPayload, ParentDirectory } from '@/types/ordoc-air/directory';

export interface CreateDirectoryFormProps {
  parent?: ParentDirectory | null;
  onSuccess?: () => void;
}

const CreateDirectoryForm: React.FC<CreateDirectoryFormProps> = ({ parent, onSuccess }) => {
  const [formData, setFormData] = React.useState<CreateDirectoryPayload>({
    name: '',
    description: '',
    parentDirectoryId: parent?.id || 0,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createDirectory(formData);
      setFormData({ name: '', description: '', parentDirectoryId: parent?.id || 0 });
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="border rounded p-2 w-full"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="border rounded p-2 w-full"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create
      </button>
    </form>
  );
};

export default CreateDirectoryForm;
