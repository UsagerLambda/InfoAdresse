interface SetErrorProps {
    message: string;
  }

export const SetError: React.FC<SetErrorProps> = ({ message }) => {
    return (
        <div>
          {message}
        </div>
    );
}
