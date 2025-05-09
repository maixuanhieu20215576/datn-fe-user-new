const LoadingSpinner: React.FC = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-transparent border-gray-200 rounded-full" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  };
  
  export default LoadingSpinner;
  