import UserDetail from "./components/UserDetail";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import { useUserStore } from "./store/useUserStore";

export default function App() {
  const count = useUserStore((s) => s.users.length);

  return (
    <div className="app">
      <header className="app-header">
     
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <UserForm />
        </aside>
        <section className="content">
          <UserList />
        </section>
        <aside className="detail">
          <UserDetail />
        </aside>
      </main>
    </div>
  );
}
