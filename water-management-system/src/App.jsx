import AdminPanel from './AdminPanel';
import ResidentPanel from './ResidentPanel';

function App() {
  const role = 'admin'; // or 'resident'

  return (
    <div className="min-h-screen bg-gray-100">
      {role === 'admin' ? <AdminPanel /> : <ResidentPanel />}
    </div>
  );
}
export default App;