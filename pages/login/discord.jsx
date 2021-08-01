import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getQuery } from '../../utils/getQuery';

export default function Login() {

    const router = useRouter();
    const [error, setError] = useState();

    useEffect(() => {
        const { access_token, error, error_description } = getQuery(router.asPath.replace('#', '?'));

        if (error) {
            setError(error_description);
            return;
        }

        fetch(`/api/login/discord?token=${access_token}`)
            .then(res => res.json())
            .then(res => {
                if (!res.status || res.status !== 'success') {
                    setError(true);
                }

                if (res && res.status === 'success') {
                    localStorage.setItem('token', res.data.token);
                    router.push('/user');
                }
            });
    }, []);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-6
                        bg-gradient-to-br from-blue-200 to-blue-300 text-gray-700">
            <Head>
                <title>Next.js Auth</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col bg-white w-full md:w-6/12 lg:w-4/12 xl:w-3/12 rounded p-8 mt-12 shadow-lg">
                <span className="w-full p-2 mt-2 rounded flex items-center justify-center font-medium">
                    <img src="/discord.svg" alt="Discord Logo" className="h-5 mr-3" />
                    <span className="text-center">{error ? 'Error al iniciar sesión' : 'Iniciando sesión'}</span>
                </span>

                {
                    error ?
                        <a href="/login"
                            className="p-2 mt-2 rounded flex items-center justify-center font-medium bg-blue-600 text-white">
                            <span className="text-center">Volver al inicio de sesion</span>
                        </a>
                        : ''
                }

            </div>
        </div>
    )
}
