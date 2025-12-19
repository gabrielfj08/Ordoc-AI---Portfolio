interface EmptyStateProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  actionButton?: { text: string; onClick: () => void };
}
const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionButton }) => (
  <div className="text-center py-20">
    <Icon className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-500">{description}</p>
    {actionButton && (
      <button
        onClick={actionButton.onClick}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {actionButton.text}
      </button>
    )}
  </div>
);
export default EmptyState;

