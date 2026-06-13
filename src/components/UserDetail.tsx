import { useUserStore } from "../store/useUserStore";

export default function UserDetail() {
  const { selectedId, getById, select } = useUserStore();

  if (!selectedId) return null;

  const user = getById(selectedId);
  if (!user) return null;

  return (
    <div className="detail-panel">
      <button className="detail-close" onClick={() => select(null)}>
        ✕
      </button>
      <div className="detail-avatar">{user.name.charAt(0).toUpperCase()}</div>
      <h3>{user.name}</h3>
      <table className="detail-table">
        <tbody>
          <tr>
            <td>ID</td>
            <td>
              <code>{user.id}</code>
            </td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>Rol</td>
            <td>{user.role}</td>
          </tr>
          <tr>
            <td>Yaratilgan</td>
            <td>{new Date(user.createdAt).toLocaleDateString("uz-UZ")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
