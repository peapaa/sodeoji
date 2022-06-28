import { useEffect } from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Không tìm thấy trang';
  }, []);

  return (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <Link to={ROUTES.DASHBOARD}>
          <p className="text-center text-2xl">Không tìm thấy trang!</p>
        </Link>
      </div>
    </div>
  );
}
