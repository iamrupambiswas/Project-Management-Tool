import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

const LoadingSpinner = () => (
  <motion.div
    className="flex flex-col items-center justify-center text-text-muted text-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      <Loader2 size={24} className="text-accent-blue" />
    </motion.div>
    <p className="mt-2">Loading members...</p>
  </motion.div>
);

export default function Members() {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((data) => {
      setMembers(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 text-text-base font-sans">
      {members.length === 0 ? (
        <p className="text-text-muted text-sm">No members found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-background-light">
          <table className="min-w-full bg-background-light">
            <thead>
              <tr className="bg-background-dark text-left text-text-muted text-xs uppercase tracking-wider">
                <th className="py-3 px-4 rounded-tl-xl">User ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Roles</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member.id} className={`${index % 2 === 0 ? "bg-background-light" : "bg-background-light"} border-b border-background-dark`}>
                  <td className="py-3 px-4 text-sm font-mono text-accent-blue">{member.id}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-background-dark flex items-center justify-center text-xs font-semibold uppercase text-accent-blue mr-3">
                        {member.username.charAt(0)}
                      </div>
                      <div className="text-text-base">
                        <div className="font-medium text-sm">{member.username}</div>
                        <div className="text-text-muted text-xs">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex gap-2 flex-wrap">
                      {member.roles.map((role) => (
                        <span key={role} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-background-dark text-text-muted">
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}