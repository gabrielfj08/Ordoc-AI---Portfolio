
// Componente de teste para isolar o problema do logout
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export const TestLogout = () => {
    const { logout } = useAuth();
    const router = useRouter();

    const doLogout = () => {
        console.log('Test Logout Clicked');
        logout();
        router.push('/login');
    };

    return (
        <Button onClick={doLogout} variant="destructive">
            Teste Logout Direto
        </Button>
    );
};
