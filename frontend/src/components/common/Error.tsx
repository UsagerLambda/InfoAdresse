interface SetErrorProps {
    message: string;
  }

export const SetError: React.FC<SetErrorProps> = ({ message }) => {
    return (
        <div className="bg-red-100 rounded-md p-2 text-gray-800 my-1 px-4">
          {message}
        </div>
    );
}
