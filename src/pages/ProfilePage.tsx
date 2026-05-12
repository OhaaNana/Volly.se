type Props = {
  userEmail: string;
  onLogout: () => void;
};

export default function ProfilePage({ userEmail, onLogout }: Props) {
  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-2xl font-semibold text-dark-gray">Profil</h2>
      <p className="text-zinc-600">
        Inloggad som: <strong className="text-dark-gray">{userEmail}</strong>
      </p>

      <button type="button" onClick={onLogout} className="rounded-xl border border-zinc-300 px-4 py-2">
        Log out
      </button>
    </div>
  );
}
