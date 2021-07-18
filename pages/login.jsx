import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {

    const router = useRouter();

    async function handleSubmit(event) {
        event.preventDefault();
        let email = event.target.email.value;
        let password = event.target.password.value;

        if (!email || !password) {
            alert('Para registrar una cuenta tienes que especificar un correo electrónico y una contraseña')
            return;
        }

        const res = await fetch(
            '/api/authenticate/login',
            {
                body: JSON.stringify({
                    email,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            }
        )

        const result = await res.json();
        if (result && result.status === 'success') {
            localStorage.setItem('token', result.data.token);
            router.push('/user');
        }
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen
    bg-gradient-to-br from-blue-200 to-blue-300 text-gray-700
    p-6">
            <Head>
                <title>Next.js Auth</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1 className="text-5xl font-bold text-center">
                Inicia sesión
            </h1>
            <p className="mt-3 text-xl text-center">
                No tienes cuenta? {' '}
                <a href="/" className="text-blue-700">
                    Crea una
                </a>
            </p>

            <div className="bg-white w-full md:w-6/12 lg:w-4/12 xl:w-3/12 rounded p-8 mt-12 shadow-lg">

                <form className="" onSubmit={handleSubmit}>

                    <fieldset className="flex flex-col">
                        <label htmlFor="email"
                            className="text-sm font-medium">
                            Correo electrónico
                        </label>
                        <input type="email" id="email"
                            className="border border-gray-300 rounded-lg px-2.5 py-1.5 mt-2
                               focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"/>
                    </fieldset>

                    <fieldset className="flex flex-col mt-6">
                        <label htmlFor="password"
                            className="text-sm font-medium">
                            Contraseña
                        </label>
                        <input type="password" id="password"
                            className="border border-gray-300 rounded-lg px-2.5 py-1.5 mt-2
                               focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"/>
                    </fieldset>

                    <button type="submit"
                        className="w-full bg-blue-400 text-white py-2 mt-10 rounded font-medium">
                        Iniciar sesión
                    </button>

                    <span className="font-medium flex justify-center mt-2">O</span>

                    <button className="w-full shadow p-2 mt-2 rounded flex items-center justify-center font-medium">
                        <img src="/google.svg" alt="Google Logo" className="h-5 mr-3" />
                        <span className="text-center">Inicia sesión con Google</span>
                    </button>

                    <button className="w-full shadow p-2 mt-2 rounded flex items-center justify-center font-medium">
                        <img src="/patreon.svg" alt="Patreon Logo" className="h-5 mr-3" />
                        <span className="text-center">Inicia sesión con Patreon</span>
                    </button>
                </form>
            </div>
        </div>
    )
}
