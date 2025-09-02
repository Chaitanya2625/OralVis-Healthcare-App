import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Login</h1>
      <LoginForm onSuccess={(role)=> navigate(role === 'technician' ? '/tech' : '/dentist')}/>
    </div>
  );
}
