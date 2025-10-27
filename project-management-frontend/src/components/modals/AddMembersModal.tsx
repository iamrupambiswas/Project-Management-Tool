interface AddMemberModalProps {
    teamId: string;
    onClose: () => void;
    onMemberAdded: (email: string, role: string) => void;
  }
  
  export default function AddMemberModal({ teamId, onClose, onMemberAdded }: AddMemberModalProps) {
    // implement add-member UI here
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background-darker/70 backdrop-blur-sm z-50">
        <div className="bg-background-light p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">Add Member</h2>
          {/* Inputs for email and role */}
          {/* Add save and cancel buttons */}
        </div>
      </div>
    );
  }
  