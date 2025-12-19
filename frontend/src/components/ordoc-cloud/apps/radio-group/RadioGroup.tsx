'use client';

import * as React from 'react';
import { AppsRadioGroupProps } from './types';

interface FormContextType {
  setFieldValue: (field: string, value: any) => void;
}

const AppsRadioGroup = ({ apps, disabled }: AppsRadioGroupProps) => {
  const [selectedService, setSelectedService] = React.useState<string>('');

  // Mock form context - in real implementation, this would come from a form library
  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    // In real implementation: setFieldValue('service', service);
    // In real implementation: setFieldValue('resource', []);
  };

  return (
    <div className="grid grid-cols-2 grid-flow-row gap-4 items-center">
      {apps
        .filter(
          (filterApps) =>
            filterApps.service !== 'ordoc_optical' &&
            filterApps.service !== 'ordoc_reports'
        )
        .map((app) => (
          <label key={app.id} className="cursor-pointer">
            <div className="flex items-center justify-center gap-2 h-10 w-full shadow-md rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <input
                type="radio"
                name="service"
                value={app.service}
                disabled={disabled}
                checked={selectedService === app.service}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {app.name}
              </span>
            </div>
          </label>
        ))}
    </div>
  );
};

export default AppsRadioGroup;
