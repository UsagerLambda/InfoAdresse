interface SetSuccessProps {
    message: string;
  }

export const SetSuccess: React.FC<SetSuccessProps> = ({ message }) => {
    return (
      <div className="bg-green-100 rounded-md p-2 text-gray-800 my-1 px-4">
          {message}
        </div>
    );
}
