import BasicForm from './components/BasicForm'
import BasicList from './components/BasicList'
import { useAppSelector } from './store/hooks'

export default function App() {
  const total = useAppSelector(s => s.basic.length)
  const active = useAppSelector(s => s.basic.filter(u => u.status).length)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <h1>
            <span className="logo-icon">🔴</span> Redux CRUD
          </h1>
          <div className="header-stats">
            <span className="stat-chip">{total} total</span>
            <span className="stat-chip active">{active} active</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <BasicForm />
        </aside>
        <section className="content">
          <BasicList />
        </section>
      </main>
    </div>
  )
}
