import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorStateProps {
  message: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message }) => (
  <div className="text-center py-20">
    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
    <h3 className="mt-4 text-lg font-medium text-gray-900">{message}</h3>
  </div>
);

export default ErrorState;
export { ErrorState };
