interface SetSuccessProps {
    message: string;
  }

export const SetSuccess: React.FC<SetSuccessProps> = ({ message }) => {
    return (
        <div>
          {message}
        </div>
    );
}
