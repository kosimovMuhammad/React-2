import BasicForm from './components/BasicForm'
import BasicList from './components/BasicList'

export default function App() {

  return (
    <div className="app">
      <header className="app-header">
      
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
