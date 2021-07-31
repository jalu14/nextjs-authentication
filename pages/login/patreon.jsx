import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getQuery } from '../../utils/getQuery';

export default function Login() {

    const router = useRouter();

    useEffect(() => {
        const { code } = getQuery(router.asPath);
        fetch(`/api/authenticate/patreon?code=${code}`)
            .then(res => res.json())
            .then(res => {
                if (!res.success) return;
                console.log(res);
            });
    }, []);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-6
                        bg-gradient-to-br from-blue-200 to-blue-300 text-gray-700">
            <Head>
                <title>Next.js Auth</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="bg-white w-full md:w-6/12 lg:w-4/12 xl:w-3/12 rounded p-8 mt-12 shadow-lg">


                <button type="button" className="w-full p-2 mt-2 rounded flex items-center justify-center font-medium">
                    <img src="/patreon.svg" alt="Patreon Logo" className="h-5 mr-3" />
                    <span className="text-center">Iniciando sesión</span>
                </button>
            </div>
        </div>
    )
}
