import AdminPanel from './AdminPanel';
import ResidentPanel from './ResidentPanel';

function App() {

  // Hardcoding user for now, but this should be fetched from AuthContext or similar
  const user = {
    id: 4,
    name: 'John Doe',
    email: 'johndoe@example.com',
    role: 'admin'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user.role === 'admin' ? <AdminPanel /> : <ResidentPanel user={user} />}
    </div>
  );
}
export default App;